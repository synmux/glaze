#!/usr/bin/env python3
"""Aggregate native Ollama NDJSON; no networking, tools, or third-party packages."""

from __future__ import annotations

import argparse
import json
import math
import sys
from typing import BinaryIO, Iterator, Any

MAX_LINE_BYTES = 16 * 1024 * 1024


class StreamError(ValueError):
    """The stream is malformed, failed, or incomplete."""


def reject_constant(value: str) -> None:
    raise ValueError(f"Non-JSON numeric constant: {value}")


def finite_float(value: str) -> float:
    number = float(value)
    if not math.isfinite(number):
        raise ValueError("JSON number exceeds finite floating-point range")
    return number


def events(source: BinaryIO) -> Iterator[dict[str, Any]]:
    line_number = 0
    while True:
        raw = source.readline(MAX_LINE_BYTES + 1)
        if not raw:
            return
        line_number += 1
        if len(raw) > MAX_LINE_BYTES:
            raise StreamError(f"Line {line_number} exceeds the 16 MiB limit")
        if not raw.strip():
            continue
        try:
            item = json.loads(
                raw.decode("utf-8"),
                parse_constant=reject_constant,
                parse_float=finite_float,
            )
        except (ValueError, UnicodeDecodeError) as exc:
            raise StreamError(f"Invalid JSON/UTF-8 on line {line_number}") from exc
        if not isinstance(item, dict):
            raise StreamError(f"Line {line_number} must contain a JSON object")
        yield item


def text_field(item: dict[str, Any], key: str) -> str:
    value = item.get(key, "")
    if not isinstance(value, str):
        raise StreamError(f"{key} must be a string when present")
    return value


def list_field(item: dict[str, Any], key: str) -> list[Any]:
    value = item.get(key, [])
    if not isinstance(value, list):
        raise StreamError(f"{key} must be an array when present")
    return value


def validate_calls(calls: list[Any]) -> None:
    for call in calls:
        if not isinstance(call, dict):
            raise StreamError("Each native tool call must be an object")
        function = call.get("function")
        if not isinstance(function, dict):
            raise StreamError("Each native tool call needs a function object")
        if not isinstance(function.get("name"), str) or not function["name"]:
            raise StreamError("Incomplete tool name; inspect the server's stream contract")
        if not isinstance(function.get("arguments", {}), dict):
            raise StreamError("Native tool arguments must be objects, not string deltas")


def aggregate(source: BinaryIO, kind: str) -> dict[str, Any]:
    if kind not in {"chat", "generate", "status"}:
        raise StreamError("Unknown stream kind")
    final: dict[str, Any] | None = None
    content: list[str] = []
    thinking: list[str] = []
    calls: list[Any] = []
    images: list[Any] = []
    saw_thinking = False
    saw_calls = False
    saw_images = False

    for event in events(source):
        if "error" in event:
            # Do not print server-controlled error text that might contain secrets.
            raise StreamError("Ollama emitted an error event; no complete result")
        if final is not None:
            raise StreamError("Received a record after terminal completion")

        if kind == "status":
            if not isinstance(event.get("status"), str):
                raise StreamError("Status events require a string status")
            if event["status"] == "success":
                final = dict(event)
            continue

        if "done" in event and not isinstance(event["done"], bool):
            raise StreamError("done must be a JSON boolean")
        if kind == "chat":
            if "response" in event:
                raise StreamError("Generate response received in chat mode")
            message = event.get("message", {})
            if not isinstance(message, dict):
                raise StreamError("message must be an object")
            if "role" in message and message["role"] != "assistant":
                raise StreamError("Expected an assistant message")
            content.append(text_field(message, "content"))
            thinking.append(text_field(message, "thinking"))
            calls.extend(list_field(message, "tool_calls"))
            images.extend(list_field(message, "images"))
            saw_thinking |= "thinking" in message
            saw_calls |= "tool_calls" in message
            saw_images |= "images" in message
        else:
            if "message" in event:
                raise StreamError("Chat message received in generate mode")
            content.append(text_field(event, "response"))
            thinking.append(text_field(event, "thinking"))
            saw_thinking |= "thinking" in event

        if event.get("done") is True:
            final = dict(event)

    if final is None:
        marker = 'status: "success"' if kind == "status" else "done: true"
        raise StreamError(f"Incomplete stream: missing terminal {marker}")
    if kind == "status":
        return final
    if kind == "generate":
        final["response"] = "".join(content)
        if saw_thinking:
            final["thinking"] = "".join(thinking)
        return final

    validate_calls(calls)
    if not all(isinstance(image, str) for image in images):
        raise StreamError("Native images must be base64 strings")
    message = dict(final.get("message", {}))
    message.update(role="assistant", content="".join(content))
    if saw_thinking:
        message["thinking"] = "".join(thinking)
    if saw_calls:
        message["tool_calls"] = calls
    if saw_images:
        message["images"] = images
    final["message"] = message
    return final


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--kind", choices=("chat", "generate", "status"), required=True)
    args = parser.parse_args()
    try:
        result = aggregate(sys.stdin.buffer, args.kind)
        sys.stdout.write(json.dumps(result, ensure_ascii=True, allow_nan=False) + "\n")
        return 0
    except (StreamError, OSError) as exc:
        print(f"Stream check failed: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
