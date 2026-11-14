"""Offline contract tests for the bundled native-stream aggregation utility."""

import io
import json
from pathlib import Path
import subprocess
import sys
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
import read_ndjson as reader


def stream(*items, final_newline=True):
    data = "\n".join(json.dumps(item, ensure_ascii=False) for item in items)
    if final_newline:
        data += "\n"
    return io.BytesIO(data.encode("utf-8"))


class AggregationTests(unittest.TestCase):
    def test_generate_preserves_terminal_text_and_metrics(self):
        result = reader.aggregate(stream(
            {"response": "Hel", "done": False},
            {"response": "lo", "done": True, "eval_count": 2},
        ), "generate")
        self.assertEqual(result["response"], "Hello")
        self.assertEqual(result["eval_count"], 2)

    def test_unicode_blanks_crlf_and_no_trailing_newline(self):
        data = '\r\n{"response":"café £","done":false}\r\n\n{"done":true}'
        result = reader.aggregate(io.BytesIO(data.encode()), "generate")
        self.assertEqual(result["response"], "café £")

    def test_chat_accumulates_all_fields_in_same_chunk(self):
        call = {"function": {"name": "add", "arguments": {"a": 2, "b": 3}}}
        result = reader.aggregate(stream(
            {"message": {"thinking": "Plan.", "content": "One", "tool_calls": [call]}},
            {"message": {"thinking": " Done.", "content": " two", "images": ["YWJj"]},
             "done": True, "eval_count": 7},
        ), "chat")
        self.assertEqual(result["message"]["content"], "One two")
        self.assertEqual(result["message"]["thinking"], "Plan. Done.")
        self.assertEqual(result["message"]["tool_calls"], [call])
        self.assertEqual(result["message"]["images"], ["YWJj"])
        self.assertEqual(result["eval_count"], 7)

    def test_multiple_calls_preserved(self):
        calls = [{"function": {"name": name, "arguments": {}}} for name in ("a", "b")]
        result = reader.aggregate(stream(
            {"message": {"tool_calls": calls[:1]}, "done": False},
            {"message": {"tool_calls": calls[1:]}, "done": True},
        ), "chat")
        self.assertEqual(result["message"]["tool_calls"], calls)

    def test_generate_thinking_kept_separate(self):
        result = reader.aggregate(stream(
            {"thinking": "A", "response": "B", "done": True},
        ), "generate")
        self.assertEqual(result["thinking"], "A")
        self.assertEqual(result["response"], "B")

    def test_status_success(self):
        result = reader.aggregate(stream(
            {"status": "pulling", "total": 10, "completed": 2},
            {"status": "success"},
        ), "status")
        self.assertEqual(result, {"status": "success"})

    def test_in_band_error_fails_without_leaking_detail(self):
        with self.assertRaises(reader.StreamError) as caught:
            reader.aggregate(stream(
                {"response": "Partial", "done": False},
                {"error": "secret-value"},
            ), "generate")
        self.assertNotIn("secret-value", str(caught.exception))

    def test_incomplete_all_modes(self):
        for kind, item in (
            ("chat", {"message": {"content": "x"}}),
            ("generate", {"response": "x"}),
            ("status", {"status": "pulling"}),
        ):
            with self.subTest(kind=kind), self.assertRaises(reader.StreamError):
                reader.aggregate(stream(item), kind)

    def test_empty_stream(self):
        with self.assertRaises(reader.StreamError):
            reader.aggregate(io.BytesIO(b""), "generate")

    def test_malformed_inputs(self):
        for data in (b"not json\n", b"[]\n", b"null\n", b"\xff\n",
                     b'data: {"done": true}\n', b"[DONE]\n",
                     b'{"response":NaN,"done":true}\n'):
            with self.subTest(data=data), self.assertRaises(reader.StreamError):
                reader.aggregate(io.BytesIO(data), "generate")

    def test_wrong_field_types(self):
        cases = [
            ("generate", {"response": 42, "done": True}),
            ("generate", {"done": "true"}),
            ("chat", {"message": [], "done": True}),
            ("chat", {"message": {"role": "user"}, "done": True}),
            ("chat", {"message": {"tool_calls": {}}, "done": True}),
            ("chat", {"message": {"images": [123]}, "done": True}),
            ("status", {"status": 7}),
        ]
        for kind, item in cases:
            with self.subTest(item=item), self.assertRaises(reader.StreamError):
                reader.aggregate(stream(item), kind)

    def test_numeric_overflow_is_controlled(self):
        with self.assertRaises(reader.StreamError):
            reader.aggregate(
                io.BytesIO(b'{"done":true,"eval_duration":1e999}'), "generate",
            )

    def test_wrong_mode_rejected(self):
        for kind, item in (
            ("generate", {"message": {"content": "Hello"}, "done": True}),
            ("chat", {"response": "Hello", "done": True}),
        ):
            with self.subTest(kind=kind), self.assertRaises(reader.StreamError):
                reader.aggregate(stream(item), kind)

    def test_fragmented_or_wrong_tool_arguments(self):
        for call in ({}, "bad", {"function": {"name": ""}},
                     {"function": {"name": "add", "arguments": '{"a":'}}):
            with self.subTest(call=call), self.assertRaises(reader.StreamError):
                reader.aggregate(stream(
                    {"message": {"tool_calls": [call]}, "done": True},
                ), "chat")

    def test_record_after_terminal(self):
        for kind, item in (("generate", {"done": True}), ("status", {"status": "success"})):
            with self.subTest(kind=kind), self.assertRaises(reader.StreamError):
                reader.aggregate(stream(item, item), kind)

    def test_trailing_blank_line_allowed(self):
        result = reader.aggregate(io.BytesIO(b'{"done":true}\n\n'), "generate")
        self.assertTrue(result["done"])

    def test_line_size_limit(self):
        with patch.object(reader, "MAX_LINE_BYTES", 8):
            with self.assertRaises(reader.StreamError):
                reader.aggregate(io.BytesIO(b'{"done":true}\n'), "generate")

    def test_unknown_final_metadata_retained(self):
        result = reader.aggregate(stream({"done": True, "future_field": 123}), "chat")
        self.assertEqual(result["future_field"], 123)

    def test_cli_success(self):
        process = subprocess.run(
            [sys.executable, str(ROOT / "scripts/read_ndjson.py"), "--kind", "generate"],
            input=b'{"response":"OK","done":true}', capture_output=True, check=False,
        )
        self.assertEqual(process.returncode, 0)
        self.assertEqual(json.loads(process.stdout)["response"], "OK")

    def test_cli_failure_no_success_output(self):
        process = subprocess.run(
            [sys.executable, str(ROOT / "scripts/read_ndjson.py"), "--kind", "chat"],
            input=b'{"error":"secret-value"}', capture_output=True, check=False,
        )
        self.assertEqual(process.returncode, 1)
        self.assertEqual(process.stdout, b"")
        self.assertNotIn(b"secret-value", process.stderr)

    def test_cli_escaped_surrogate_serialises_without_traceback(self):
        process = subprocess.run(
            [sys.executable, str(ROOT / "scripts/read_ndjson.py"), "--kind", "chat"],
            input=b'{"message":{"content":"\\ud800"},"done":true}',
            capture_output=True, check=False,
        )
        self.assertEqual(process.returncode, 0)
        self.assertEqual(process.stderr, b"")
        self.assertEqual(json.loads(process.stdout)["message"]["content"], "\ud800")


if __name__ == "__main__":
    unittest.main()
