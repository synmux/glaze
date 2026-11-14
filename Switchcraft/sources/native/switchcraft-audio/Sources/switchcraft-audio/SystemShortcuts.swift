import Foundation

/// Looks up macOS's own keyboard shortcuts (System Settings → Keyboard → Keyboard Shortcuts)
/// so Switchcraft can warn before a preset shortcut collides with one.
enum SystemShortcuts {
  private static let shift = 0x20000
  private static let control = 0x40000
  private static let option = 0x80000
  private static let command = 0x100000
  private static let modifierMask = shift | control | option | command

  // ANSI virtual key codes for the keys Switchcraft accepts in shortcuts.
  private static let keyCodes: [String: Int] = [
    "A": 0, "S": 1, "D": 2, "F": 3, "H": 4, "G": 5, "Z": 6, "X": 7, "C": 8, "V": 9, "B": 11,
    "Q": 12, "W": 13, "E": 14, "R": 15, "Y": 16, "T": 17, "O": 31, "U": 32, "I": 34, "P": 35,
    "L": 37, "J": 38, "K": 40, "N": 45, "M": 46,
    "1": 18, "2": 19, "3": 20, "4": 21, "6": 22, "5": 23, "9": 25, "7": 26, "8": 28, "0": 29,
    "RETURN": 36, "ENTER": 36, "TAB": 48, "SPACE": 49, "BACKSPACE": 51, "ESCAPE": 53, "ESC": 53,
    "DELETE": 117, "HOME": 115, "PAGEUP": 116, "END": 119, "PAGEDOWN": 121,
    "LEFT": 123, "RIGHT": 124, "DOWN": 125, "UP": 126,
    "F1": 122, "F2": 120, "F3": 99, "F4": 118, "F5": 96, "F6": 97, "F7": 98, "F8": 100,
    "F9": 101, "F10": 109, "F11": 103, "F12": 111, "F13": 105, "F14": 107, "F15": 113,
    "F16": 106, "F17": 64, "F18": 79, "F19": 80, "F20": 90,
  ]

  private static let names: [Int: String] = [
    7: "Move focus to the menu bar", 8: "Move focus to the Dock",
    9: "Move focus to the active or next window", 10: "Move focus to the window toolbar",
    11: "Move focus to the floating window", 12: "Turn keyboard access on or off",
    13: "Change the way Tab moves focus", 15: "Turn zoom on or off", 17: "Zoom in", 19: "Zoom out",
    21: "Invert colors", 25: "Increase contrast", 26: "Decrease contrast",
    27: "Move focus to the next window", 28: "Save picture of screen as a file",
    29: "Copy picture of screen to the clipboard", 30: "Save picture of selected area as a file",
    31: "Copy picture of selected area to the clipboard", 32: "Mission Control",
    33: "Application windows", 36: "Show Desktop", 52: "Turn Dock hiding on or off",
    57: "Move focus to the status menus", 59: "Turn VoiceOver on or off",
    60: "Select the previous input source", 61: "Select the next input source",
    64: "Show Spotlight search", 65: "Show Finder search window", 79: "Move left a space",
    80: "Move left a space", 81: "Move right a space", 82: "Move right a space",
    98: "Show Help menu", 118: "Switch to Desktop 1", 119: "Switch to Desktop 2",
    120: "Switch to Desktop 3", 121: "Switch to Desktop 4", 160: "Show Launchpad",
    162: "Show Accessibility controls", 163: "Show Notification Center",
    175: "Turn Do Not Disturb on or off", 184: "Screenshot and recording options", 190: "Quick Note",
    222: "Turn Stage Manager on or off",
  ]

  // Shortcuts macOS enables out of the box. They only appear in the preferences file once the
  // user has customised them, so check these when an entry is absent.
  private static let builtInDefaults: [(id: Int, keyCode: Int, modifiers: Int)] = [
    (64, 49, command), (65, 49, command | option), (60, 49, control), (61, 49, control | option),
    (28, 20, shift | command), (29, 20, control | shift | command), (30, 21, shift | command),
    (31, 21, control | shift | command), (184, 23, shift | command), (32, 126, control),
    (33, 125, control), (79, 123, control), (81, 124, control), (36, 103, 0), (52, 2, option | command),
  ]

  private static func parse(_ accelerator: String) -> (keyCode: Int, modifiers: Int)? {
    var modifiers = 0
    var key: String?
    for part in accelerator.split(separator: "+").map(String.init) {
      switch part.lowercased() {
      case "command", "cmd", "commandorcontrol", "cmdorctrl", "super", "meta": modifiers |= command
      case "control", "ctrl": modifiers |= control
      case "alt", "option": modifiers |= option
      case "shift": modifiers |= shift
      default: key = part
      }
    }
    guard let key, let keyCode = keyCodes[key.uppercased()] else { return nil }
    return (keyCode, modifiers)
  }

  private static func name(for id: Int) -> String {
    names[id] ?? "a macOS keyboard shortcut"
  }

  static func conflict(for accelerator: String) -> String? {
    guard let target = parse(accelerator) else { return nil }
    var listed = Set<Int>()
    if let hotkeys = CFPreferencesCopyAppValue(
      "AppleSymbolicHotKeys" as CFString, "com.apple.symbolichotkeys" as CFString) as? [String: Any]
    {
      for (key, value) in hotkeys {
        guard let id = Int(key), let entry = value as? [String: Any] else { continue }
        listed.insert(id)
        let enabled = (entry["enabled"] as? NSNumber)?.boolValue ?? false
        guard enabled,
          let details = entry["value"] as? [String: Any],
          let parameters = details["parameters"] as? [NSNumber],
          parameters.count >= 3
        else { continue }
        if parameters[1].intValue == target.keyCode
          && (parameters[2].intValue & modifierMask) == target.modifiers
        {
          return name(for: id)
        }
      }
    }
    for shortcut in builtInDefaults where !listed.contains(shortcut.id) {
      if shortcut.keyCode == target.keyCode && shortcut.modifiers == target.modifiers {
        return name(for: shortcut.id)
      }
    }
    return nil
  }
}
