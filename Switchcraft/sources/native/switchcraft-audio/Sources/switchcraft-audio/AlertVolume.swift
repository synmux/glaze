import Foundation

/// The alert volume slider in System Settings → Sound. There is no CoreAudio API for it;
/// Standard Additions' `volume settings` is the supported way to read and set it.
enum AlertVolume {
  private static func run(_ source: String) throws -> NSAppleEventDescriptor {
    guard let script = NSAppleScript(source: source) else {
      throw HelperError("couldn't prepare the alert volume script")
    }
    var errorInfo: NSDictionary?
    let result = script.executeAndReturnError(&errorInfo)
    if let errorInfo {
      let message = errorInfo[NSAppleScript.errorMessage] as? String ?? "macOS refused the alert volume change"
      throw HelperError(message)
    }
    return result
  }

  static func get() -> Int? {
    guard let result = try? run("alert volume of (get volume settings)") else { return nil }
    return Int(result.int32Value)
  }

  static func set(_ level: Double) throws {
    let value = Int(max(0, min(100, level)).rounded())
    _ = try run("set volume alert volume \(value)")
  }
}
