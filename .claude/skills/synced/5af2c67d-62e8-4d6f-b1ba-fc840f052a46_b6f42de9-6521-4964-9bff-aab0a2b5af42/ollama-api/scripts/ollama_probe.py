#!/usr/bin/env python3
"""Probe an Ollama server: version, installed models, loaded models, and optional model capabilities.

Usage:
    ollama_probe.py [HOST] [MODEL] [--json] [--timeout SECONDS]

    HOST   defaults to $OLLAMA_HOST or http://localhost:11434. Bare host:port and
           schemeless values are accepted. Use https://ollama.com (with $OLLAMA_API_KEY)
           to inspect the cloud catalogue.
    MODEL  if given, POST /api/show is called and capabilities / context length /
           Modelfile parameters are reported. A missing model is flagged with the pull
           command rather than treated as an error.
    --json emit a single JSON document instead of the human-readable report.

Exit codes: 0 ok, 1 usage error, 2 server unreachable, 3 auth failure (401/403).

Standard library only (urllib + json); no curl or jq required.
"""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from typing import Any, Dict, List, Optional

DEFAULT_HOST = "http://localhost:11434"
DEFAULT_TIMEOUT_SECONDS = 15.0


def normalise_host(raw_host: str) -> str:
    """Turn 'host', 'host:port', 'http://host' into a full base URL, mirroring the SDKs' rules."""
    host = raw_host.strip().rstrip("/")
    if not host:
        return DEFAULT_HOST
    if "://" not in host:
        host = "http://" + host
    scheme, _, remainder = host.partition("://")
    authority, _, path = remainder.partition("/")
    # Add the default port only for plain http hosts without one (https hosts such as ollama.com must stay bare).
    if scheme == "http" and ":" not in authority.split("]")[-1]:
        authority += ":11434"
    return f"{scheme}://{authority}" + (f"/{path}" if path else "")


def build_headers() -> Dict[str, str]:
    headers = {"Content-Type": "application/json", "Accept": "application/json"}
    api_key = os.environ.get("OLLAMA_API_KEY")
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"
    return headers


def request_json(base_url: str, path: str, body: Optional[Dict[str, Any]], timeout: float) -> Any:
    data = json.dumps(body).encode() if body is not None else None
    http_request = urllib.request.Request(base_url + path, data=data, headers=build_headers(), method="POST" if body is not None else "GET")
    with urllib.request.urlopen(http_request, timeout=timeout) as response:
        return json.loads(response.read().decode())


def gigabytes(byte_count: Optional[int]) -> str:
    if not byte_count:
        return "-"
    return f"{byte_count / 1e9:.1f} GB"


def detail(model_entry: Dict[str, Any], key: str) -> str:
    return str((model_entry.get("details") or {}).get(key) or "-")


def max_context_from_model_info(model_info: Dict[str, Any]) -> Optional[int]:
    for info_key, info_value in model_info.items():
        if info_key.endswith(".context_length") and isinstance(info_value, int):
            return info_value
    return None


def parse_arguments(argv: List[str]) -> Dict[str, Any]:
    options: Dict[str, Any] = {"host": None, "model": None, "json": False, "timeout": DEFAULT_TIMEOUT_SECONDS}
    positional: List[str] = []
    index = 0
    while index < len(argv):
        argument = argv[index]
        if argument in ("-h", "--help"):
            print(__doc__)
            sys.exit(0)
        if argument == "--json":
            options["json"] = True
        elif argument == "--timeout":
            index += 1
            try:
                options["timeout"] = float(argv[index])
            except (IndexError, ValueError):
                print("--timeout needs a number of seconds", file=sys.stderr)
                sys.exit(1)
        elif argument.startswith("-"):
            print(f"unknown option {argument}", file=sys.stderr)
            sys.exit(1)
        else:
            positional.append(argument)
        index += 1
    if len(positional) > 2:
        print("too many positional arguments (expected [HOST] [MODEL])", file=sys.stderr)
        sys.exit(1)
    if positional:
        options["host"] = positional[0]
    if len(positional) == 2:
        options["model"] = positional[1]
    return options


def main() -> int:
    options = parse_arguments(sys.argv[1:])
    base_url = normalise_host(options["host"] or os.environ.get("OLLAMA_HOST") or DEFAULT_HOST)
    timeout = options["timeout"]
    report: Dict[str, Any] = {"host": base_url, "authenticated": "Authorization" in build_headers()}

    try:
        report["version"] = request_json(base_url, "/api/version", None, timeout).get("version")
    except urllib.error.HTTPError as http_error:
        if http_error.code in (401, 403):
            print(f"{base_url}: HTTP {http_error.code} — set OLLAMA_API_KEY (cloud) or check the proxy in front of the server", file=sys.stderr)
            return 3
        print(f"{base_url}/api/version returned HTTP {http_error.code}: {http_error.read().decode(errors='replace')[:200]}", file=sys.stderr)
        return 2
    except (urllib.error.URLError, OSError, ValueError) as reach_error:
        print(f"cannot reach Ollama at {base_url}: {reach_error}", file=sys.stderr)
        print("hint: is `ollama serve` running? does OLLAMA_HOST point at the right machine?", file=sys.stderr)
        return 2

    installed_models: List[Dict[str, Any]] = []
    loaded_models: List[Dict[str, Any]] = []
    warnings: List[str] = []
    try:
        installed_models = request_json(base_url, "/api/tags", None, timeout).get("models") or []
    except urllib.error.HTTPError as http_error:
        warnings.append(f"/api/tags failed: HTTP {http_error.code}")
    try:
        loaded_models = request_json(base_url, "/api/ps", None, timeout).get("models") or []
    except urllib.error.HTTPError as http_error:
        warnings.append(f"/api/ps failed: HTTP {http_error.code}")

    report["installed_models"] = [
        {
            "name": entry.get("name") or entry.get("model"),
            "size_bytes": entry.get("size"),
            "family": detail(entry, "family"),
            "parameter_size": detail(entry, "parameter_size"),
            "quantization_level": detail(entry, "quantization_level"),
            "remote_host": entry.get("remote_host"),
        }
        for entry in installed_models
    ]
    report["loaded_models"] = [
        {
            "name": entry.get("name") or entry.get("model"),
            "size_bytes": entry.get("size"),
            "size_vram_bytes": entry.get("size_vram"),
            "context_length": entry.get("context_length"),
            "expires_at": entry.get("expires_at"),
        }
        for entry in loaded_models
    ]

    requested_model = options["model"]
    if requested_model:
        try:
            show_response = request_json(base_url, "/api/show", {"model": requested_model}, timeout)
            model_info = show_response.get("model_info") or {}
            report["model"] = {
                "name": requested_model,
                "capabilities": show_response.get("capabilities") or [],
                "details": show_response.get("details") or {},
                "max_context_length": max_context_from_model_info(model_info),
                "architecture": model_info.get("general.architecture"),
                "parameters": (show_response.get("parameters") or "").strip(),
                "template_present": bool(show_response.get("template")),
            }
        except urllib.error.HTTPError as http_error:
            if http_error.code == 404:
                report["model"] = {"name": requested_model, "missing": True}
                warnings.append(f"model '{requested_model}' is not present — pull it with: ollama pull {requested_model}  (or POST /api/pull)")
            else:
                warnings.append(f"/api/show for '{requested_model}' failed: HTTP {http_error.code}")
    report["warnings"] = warnings

    if options["json"]:
        print(json.dumps(report, indent=2))
        return 0

    print(f"Ollama {report['version']} at {base_url}" + ("  (authenticated)" if report["authenticated"] else ""))
    print()
    print(f"Installed models ({len(installed_models)}):")
    if not installed_models:
        print("  none — pull one with `ollama pull <name>`")
    for entry in report["installed_models"]:
        remote_note = f"  [cloud via {entry['remote_host']}]" if entry.get("remote_host") else ""
        print(f"  {entry['name']:<40} {gigabytes(entry['size_bytes']):>9}  {entry['family']:<12} {entry['parameter_size']:<8} {entry['quantization_level']}{remote_note}")
    print()
    print(f"Loaded models ({len(loaded_models)}):")
    if not loaded_models:
        print("  none loaded (first request will pay load_duration)")
    for entry in report["loaded_models"]:
        total_size = entry["size_bytes"] or 0
        vram_size = entry["size_vram_bytes"] or 0
        gpu_share = f"{100 * vram_size / total_size:.0f}% GPU" if total_size else "-"
        print(f"  {entry['name']:<40} ctx={entry['context_length']}  {gpu_share}  expires {entry['expires_at']}")
    if "model" in report:
        print()
        model_report = report["model"]
        if model_report.get("missing"):
            print(f"Model {model_report['name']}: NOT INSTALLED")
        else:
            print(f"Model {model_report['name']}:")
            print(f"  capabilities : {', '.join(model_report['capabilities']) or '(none reported)'}")
            details = model_report["details"]
            print(f"  details      : {details.get('family', '-')} {details.get('parameter_size', '-')} {details.get('quantization_level', '-')} ({details.get('format', '-')})")
            print(f"  max context  : {model_report['max_context_length'] or 'unknown'}  (active context is /api/ps → context_length or options.num_ctx)")
            if model_report["parameters"]:
                print("  Modelfile parameters:")
                for line in model_report["parameters"].splitlines():
                    print(f"    {line}")
            for capability, hint in (
                ("tools", "no `tools` capability — tool calling will return 400"),
                ("vision", "no `vision` capability — `images` will be ignored or rejected"),
                ("thinking", "no `thinking` capability — `think` has no effect"),
            ):
                if capability not in model_report["capabilities"]:
                    print(f"  note         : {hint}")
    if warnings:
        print()
        for warning in warnings:
            print(f"warning: {warning}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except BrokenPipeError:
        # Piped into head/less and the reader went away. Silence Python's shutdown
        # warning by pointing stdout at devnull before the interpreter flushes it.
        os.dup2(os.open(os.devnull, os.O_WRONLY), sys.stdout.fileno())
        sys.exit(0)
    except KeyboardInterrupt:
        sys.exit(130)
