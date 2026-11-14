#!/usr/bin/env python3
"""Inspect native Ollama JSON/NDJSON. Python 3.9+; standard library only.

Print one JSON object per output line. Errors go to stderr, exit code 1.
No retry, redirect following, model selection, tool execution or blob upload.
An error may follow partial stdout; callers must check the exit code.
"""

import argparse
import http.client
import json
import math
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path


METHODS = {
    "version": "GET", "tags": "GET", "ps": "GET",
    "show": "POST", "chat": "POST", "generate": "POST", "embed": "POST",
    "pull": "POST", "create": "POST", "copy": "POST", "push": "POST",
    "delete": "DELETE", "web_search": "POST", "web_fetch": "POST",
}
INFERENCE = {"chat", "generate"}
PROGRESS = {"pull", "create", "push"}
EMPTY_OK = {"copy", "delete"}


class ProtocolError(Exception):
    pass


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise ProtocolError("Redirect refused; configure the final intended host")


def api_url(host, endpoint):
    parts = urllib.parse.urlsplit(host)
    if (parts.scheme not in {"http", "https"} or not parts.hostname
            or parts.username is not None or parts.password is not None
            or parts.query or parts.fragment or parts.path.rstrip("/") not in {"", "/api"}):
        raise ValueError("Host must be an HTTP(S) origin, optionally ending in /api")
    return urllib.parse.urlunsplit((parts.scheme, parts.netloc, "/api/" + endpoint, "", ""))


def checked_object(raw):
    obj = json.loads(raw)
    if not isinstance(obj, dict):
        raise ProtocolError("Expected a JSON object")
    if "error" in obj:
        raise ProtocolError("Ollama error: " + str(obj["error"]))
    return obj


def response_objects(response, endpoint):
    media_type = response.headers.get_content_type()
    if media_type == "application/x-ndjson":
        # Byte-oriented line reads preserve UTF-8 split across transport chunks.
        for raw in response:
            if raw.strip():
                yield checked_object(raw)
    elif media_type == "application/json":
        raw = response.read()
        if raw.strip():
            yield checked_object(raw)
        elif endpoint not in EMPTY_OK:
            raise ProtocolError("Empty JSON response")
    else:
        raw = response.read()
        if raw.strip() or endpoint not in EMPTY_OK:
            raise ProtocolError("Unexpected response content type: " + media_type)


def check_completion(endpoint, last):
    if last is None and endpoint not in EMPTY_OK:
        raise ProtocolError("Empty response")
    if endpoint in INFERENCE and (last is None or last.get("done") is not True):
        raise ProtocolError("Incomplete generation: missing terminal done:true")
    if endpoint in PROGRESS and (last is None or last.get("status") != "success"):
        raise ProtocolError("Incomplete operation: missing terminal status:success")


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("endpoint", choices=sorted(METHODS))
    parser.add_argument("--host", default=os.getenv("OLLAMA_HOST", "http://localhost:11434"))
    parser.add_argument("--data", metavar="FILE", help="JSON request object; '-' reads stdin")
    parser.add_argument("--api-key-env", metavar="NAME", help="Explicit environment variable holding a Bearer key")
    parser.add_argument("--timeout", type=float, default=120, help="Socket-operation timeout in seconds (default 120)")
    args = parser.parse_args(argv)
    method = METHODS[args.endpoint]
    if not math.isfinite(args.timeout) or args.timeout <= 0:
        parser.error("--timeout must be finite and greater than zero")
    if (method == "GET") == bool(args.data):
        parser.error("GET endpoints take no --data; other endpoints require --data")
    try:
        url = api_url(args.host, args.endpoint)
        payload = None
        if args.data:
            raw = sys.stdin.buffer.read() if args.data == "-" else Path(args.data).read_bytes()
            obj = json.loads(raw)
            if not isinstance(obj, dict):
                raise ValueError("Request body must be a JSON object")
            payload = json.dumps(obj, allow_nan=False).encode("utf-8")
        headers = {"Accept": "application/json, application/x-ndjson"}
        if payload is not None:
            headers["Content-Type"] = "application/json"
        if args.api_key_env:
            key = os.environ.get(args.api_key_env)
            if not key:
                raise ValueError("The requested API-key environment variable is empty or unset")
            if "\n" in key or "\r" in key:
                raise ValueError("API key contains a newline")
            headers["Authorization"] = "Bearer " + key
        request = urllib.request.Request(url, data=payload, headers=headers, method=method)
        opener = urllib.request.build_opener(NoRedirect())
        with opener.open(request, timeout=args.timeout) as response:
            if not 200 <= response.status < 300:
                raise ProtocolError("Unexpected HTTP status: " + str(response.status))
            last = None
            for obj in response_objects(response, args.endpoint):
                print(json.dumps(obj, ensure_ascii=False, allow_nan=False), flush=True)
                last = obj
            check_completion(args.endpoint, last)
        return 0
    except urllib.error.HTTPError as exc:
        body = exc.read(8192)
        try:
            obj = json.loads(body)
            detail = str(obj.get("error", exc.reason)) if isinstance(obj, dict) else str(exc.reason)
        except (ValueError, UnicodeError):
            detail = str(exc.reason)
        print("HTTP " + str(exc.code) + ": " + detail, file=sys.stderr)
    except (ProtocolError, ValueError, OSError, http.client.HTTPException) as exc:
        print(str(exc), file=sys.stderr)
    except KeyboardInterrupt:
        print("Cancelled; any emitted records are partial", file=sys.stderr)
        return 130
    return 1


if __name__ == "__main__":
    sys.exit(main())
