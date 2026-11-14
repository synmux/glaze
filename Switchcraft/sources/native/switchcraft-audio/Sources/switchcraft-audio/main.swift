// Switchcraft audio helper.
//
// A long-lived process that reads one JSON request per line on stdin and writes one JSON
// response per line on stdout. It also pushes `audioChanged` events whenever the device
// list or a default device changes. It only reads and changes device settings; it never
// opens an audio stream, so it needs no microphone access.

import Foundation

setvbuf(stdout, nil, _IOLBF, 0)

struct HelperError: Error, CustomStringConvertible {
  let description: String
  init(_ description: String) { self.description = description }
}

func logError(_ message: String) {
  FileHandle.standardError.write(Data("switchcraft-audio: \(message)\n".utf8))
}

func emit(_ message: [String: Any]) {
  guard JSONSerialization.isValidJSONObject(message),
    let data = try? JSONSerialization.data(withJSONObject: message, options: []),
    let line = String(data: data, encoding: .utf8)
  else {
    logError("couldn't encode a message")
    return
  }
  print(line)
}

func requireString(_ params: [String: Any], _ key: String) throws -> String {
  guard let value = params[key] as? String, !value.isEmpty else {
    throw HelperError("missing \(key)")
  }
  return value
}

func requireNumber(_ params: [String: Any], _ key: String) throws -> Double {
  guard let value = params[key] as? NSNumber else {
    throw HelperError("missing \(key)")
  }
  return value.doubleValue
}

func handle(method: String, params: [String: Any]) throws -> Any {
  switch method {
  case "getSnapshot":
    return Audio.snapshot()
  case "getCurrentSettings":
    return Audio.currentSettings()
  case "setDefaultDevice":
    let role = try requireString(params, "role")
    let uid = try requireString(params, "uid")
    try Audio.setDefaultDevice(role: role, uid: uid)
    return NSNull()
  case "setVolume":
    let uid = try requireString(params, "uid")
    let scope = try requireString(params, "scope")
    let level = try requireNumber(params, "level")
    try Audio.setVolume(uid: uid, scope: scope, level: level)
    return NSNull()
  case "setAlertVolume":
    let level = try requireNumber(params, "level")
    try AlertVolume.set(level)
    return NSNull()
  case "checkSystemShortcut":
    let accelerator = try requireString(params, "accelerator")
    if let name = SystemShortcuts.conflict(for: accelerator) {
      return ["conflict": name]
    }
    return ["conflict": NSNull()]
  default:
    throw HelperError("unknown method \(method)")
  }
}

func handleLine(_ line: String) {
  let trimmed = line.trimmingCharacters(in: .whitespacesAndNewlines)
  if trimmed.isEmpty { return }
  guard let data = trimmed.data(using: .utf8),
    let object = try? JSONSerialization.jsonObject(with: data),
    let request = object as? [String: Any],
    let id = (request["id"] as? NSNumber)?.intValue,
    let method = request["method"] as? String
  else {
    logError("ignored a malformed request")
    return
  }
  let params = request["params"] as? [String: Any] ?? [:]
  do {
    let result = try handle(method: method, params: params)
    emit(["id": id, "ok": true, "result": result])
  } catch {
    emit(["id": id, "ok": false, "error": String(describing: error)])
  }
}

Thread.detachNewThread {
  while let line = readLine(strippingNewline: true) {
    DispatchQueue.main.async { handleLine(line) }
  }
  // stdin closed: the app has quit.
  DispatchQueue.main.async { exit(0) }
}

AudioMonitor.shared.start()
RunLoop.main.run()
