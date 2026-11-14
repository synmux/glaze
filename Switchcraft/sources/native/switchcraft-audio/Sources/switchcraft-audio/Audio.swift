import AudioToolbox
import CoreAudio
import Foundation

enum Audio {
  static let system = AudioObjectID(kAudioObjectSystemObject)
  static let outputScope = kAudioObjectPropertyScopeOutput
  static let inputScope = kAudioObjectPropertyScopeInput

  // MARK: Property helpers

  static func address(
    _ selector: AudioObjectPropertySelector,
    _ scope: AudioObjectPropertyScope = kAudioObjectPropertyScopeGlobal
  ) -> AudioObjectPropertyAddress {
    AudioObjectPropertyAddress(mSelector: selector, mScope: scope, mElement: kAudioObjectPropertyElementMain)
  }

  static func deviceIDs() -> [AudioDeviceID] {
    var propertyAddress = address(kAudioHardwarePropertyDevices)
    var size: UInt32 = 0
    guard AudioObjectGetPropertyDataSize(system, &propertyAddress, 0, nil, &size) == noErr, size > 0 else {
      return []
    }
    var ids = [AudioDeviceID](repeating: 0, count: Int(size) / MemoryLayout<AudioDeviceID>.size)
    guard AudioObjectGetPropertyData(system, &propertyAddress, 0, nil, &size, &ids) == noErr else {
      return []
    }
    return ids
  }

  static func stringProperty(_ object: AudioObjectID, _ selector: AudioObjectPropertySelector) -> String? {
    var propertyAddress = address(selector)
    guard AudioObjectHasProperty(object, &propertyAddress) else { return nil }
    var value: Unmanaged<CFString>?
    var size = UInt32(MemoryLayout<Unmanaged<CFString>?>.size)
    let status = withUnsafeMutablePointer(to: &value) { pointer in
      AudioObjectGetPropertyData(object, &propertyAddress, 0, nil, &size, pointer)
    }
    guard status == noErr, let value else { return nil }
    return value.takeRetainedValue() as String
  }

  static func uint32Property(
    _ object: AudioObjectID,
    _ selector: AudioObjectPropertySelector,
    _ scope: AudioObjectPropertyScope = kAudioObjectPropertyScopeGlobal
  ) -> UInt32? {
    var propertyAddress = address(selector, scope)
    guard AudioObjectHasProperty(object, &propertyAddress) else { return nil }
    var value: UInt32 = 0
    var size = UInt32(MemoryLayout<UInt32>.size)
    guard AudioObjectGetPropertyData(object, &propertyAddress, 0, nil, &size, &value) == noErr else {
      return nil
    }
    return value
  }

  static func flag(
    _ object: AudioObjectID,
    _ selector: AudioObjectPropertySelector,
    _ scope: AudioObjectPropertyScope = kAudioObjectPropertyScopeGlobal
  ) -> Bool {
    (uint32Property(object, selector, scope) ?? 0) != 0
  }

  static func streamCount(_ device: AudioDeviceID, _ scope: AudioObjectPropertyScope) -> Int {
    var propertyAddress = address(kAudioDevicePropertyStreams, scope)
    var size: UInt32 = 0
    guard AudioObjectGetPropertyDataSize(device, &propertyAddress, 0, nil, &size) == noErr else { return 0 }
    return Int(size) / MemoryLayout<AudioStreamID>.size
  }

  // MARK: Devices

  static func uid(of device: AudioDeviceID) -> String? {
    stringProperty(device, kAudioDevicePropertyDeviceUID)
  }

  static func name(of device: AudioDeviceID) -> String {
    stringProperty(device, kAudioObjectPropertyName) ?? "Unknown device"
  }

  static func transport(of device: AudioDeviceID) -> String {
    guard let type = uint32Property(device, kAudioDevicePropertyTransportType) else { return "other" }
    switch type {
    case kAudioDeviceTransportTypeBuiltIn: return "builtIn"
    case kAudioDeviceTransportTypeUSB: return "usb"
    case kAudioDeviceTransportTypeBluetooth, kAudioDeviceTransportTypeBluetoothLE: return "bluetooth"
    case kAudioDeviceTransportTypeHDMI, kAudioDeviceTransportTypeDisplayPort: return "display"
    case kAudioDeviceTransportTypeAirPlay: return "airplay"
    case kAudioDeviceTransportTypeAggregate, kAudioDeviceTransportTypeAutoAggregate: return "aggregate"
    case kAudioDeviceTransportTypeVirtual: return "virtual"
    case kAudioDeviceTransportTypeThunderbolt: return "thunderbolt"
    default: return "other"
    }
  }

  static func device(forUID uid: String) -> AudioDeviceID? {
    deviceIDs().first { self.uid(of: $0) == uid }
  }

  static func defaultDevice(_ selector: AudioObjectPropertySelector) -> AudioDeviceID? {
    var propertyAddress = address(selector)
    var device = AudioDeviceID(kAudioObjectUnknown)
    var size = UInt32(MemoryLayout<AudioDeviceID>.size)
    guard AudioObjectGetPropertyData(system, &propertyAddress, 0, nil, &size, &device) == noErr,
      device != kAudioObjectUnknown
    else { return nil }
    return device
  }

  static func setDefaultDevice(role: String, uid: String) throws {
    let selector: AudioObjectPropertySelector
    switch role {
    case "output": selector = kAudioHardwarePropertyDefaultOutputDevice
    case "alert": selector = kAudioHardwarePropertyDefaultSystemOutputDevice
    case "input": selector = kAudioHardwarePropertyDefaultInputDevice
    default: throw HelperError("unknown role \(role)")
    }
    guard var device = device(forUID: uid) else { throw HelperError("the device isn't connected") }
    var propertyAddress = address(selector)
    let status = AudioObjectSetPropertyData(
      system, &propertyAddress, 0, nil, UInt32(MemoryLayout<AudioDeviceID>.size), &device)
    guard status == noErr else { throw HelperError("macOS refused the change (error \(status))") }
  }

  // MARK: Volume

  static func virtualVolumeAddress(_ scope: AudioObjectPropertyScope) -> AudioObjectPropertyAddress {
    address(kAudioHardwareServiceDeviceProperty_VirtualMainVolume, scope)
  }

  static func isVirtualVolumeSettable(_ device: AudioDeviceID, _ scope: AudioObjectPropertyScope) -> Bool {
    var propertyAddress = virtualVolumeAddress(scope)
    guard AudioHardwareServiceHasProperty(device, &propertyAddress) else { return false }
    var settable = DarwinBoolean(false)
    return AudioHardwareServiceIsPropertySettable(device, &propertyAddress, &settable) == noErr && settable.boolValue
  }

  static func isScalarVolumeSettable(_ device: AudioDeviceID, _ scope: AudioObjectPropertyScope) -> Bool {
    var propertyAddress = address(kAudioDevicePropertyVolumeScalar, scope)
    guard AudioObjectHasProperty(device, &propertyAddress) else { return false }
    var settable = DarwinBoolean(false)
    return AudioObjectIsPropertySettable(device, &propertyAddress, &settable) == noErr && settable.boolValue
  }

  static func isVolumeSettable(_ device: AudioDeviceID, _ scope: AudioObjectPropertyScope) -> Bool {
    isVirtualVolumeSettable(device, scope) || isScalarVolumeSettable(device, scope)
  }

  static func volume(_ device: AudioDeviceID, _ scope: AudioObjectPropertyScope) -> Int? {
    var value = Float32(0)
    var size = UInt32(MemoryLayout<Float32>.size)
    var virtualAddress = virtualVolumeAddress(scope)
    if AudioHardwareServiceHasProperty(device, &virtualAddress),
      AudioHardwareServiceGetPropertyData(device, &virtualAddress, 0, nil, &size, &value) == noErr
    {
      return Int((value * 100).rounded())
    }
    var scalarAddress = address(kAudioDevicePropertyVolumeScalar, scope)
    size = UInt32(MemoryLayout<Float32>.size)
    if AudioObjectHasProperty(device, &scalarAddress),
      AudioObjectGetPropertyData(device, &scalarAddress, 0, nil, &size, &value) == noErr
    {
      return Int((value * 100).rounded())
    }
    return nil
  }

  static func setVolume(uid: String, scope scopeName: String, level: Double) throws {
    guard let device = device(forUID: uid) else { throw HelperError("the device isn't connected") }
    let scope = scopeName == "input" ? inputScope : outputScope
    var value = Float32(max(0, min(100, level)) / 100)
    let size = UInt32(MemoryLayout<Float32>.size)
    let status: OSStatus
    if isVirtualVolumeSettable(device, scope) {
      var propertyAddress = virtualVolumeAddress(scope)
      status = AudioHardwareServiceSetPropertyData(device, &propertyAddress, 0, nil, size, &value)
    } else if isScalarVolumeSettable(device, scope) {
      var propertyAddress = address(kAudioDevicePropertyVolumeScalar, scope)
      status = AudioObjectSetPropertyData(device, &propertyAddress, 0, nil, size, &value)
    } else {
      throw HelperError("the device has no adjustable volume")
    }
    guard status == noErr else { throw HelperError("macOS refused the volume change (error \(status))") }
    if level > 0 { unmute(device, scope) }
  }

  /// Setting a level above zero should be audible, like dragging the system slider.
  static func unmute(_ device: AudioDeviceID, _ scope: AudioObjectPropertyScope) {
    var propertyAddress = address(kAudioDevicePropertyMute, scope)
    guard AudioObjectHasProperty(device, &propertyAddress) else { return }
    var settable = DarwinBoolean(false)
    guard AudioObjectIsPropertySettable(device, &propertyAddress, &settable) == noErr, settable.boolValue else {
      return
    }
    var muted: UInt32 = 0
    var size = UInt32(MemoryLayout<UInt32>.size)
    guard AudioObjectGetPropertyData(device, &propertyAddress, 0, nil, &size, &muted) == noErr, muted != 0 else {
      return
    }
    var unmuted: UInt32 = 0
    _ = AudioObjectSetPropertyData(device, &propertyAddress, 0, nil, size, &unmuted)
  }

  // MARK: Snapshots

  static func uidOrNull(_ device: AudioDeviceID?) -> Any {
    if let device, let uid = uid(of: device) { return uid }
    return NSNull()
  }

  static func intOrNull(_ value: Int?) -> Any {
    if let value { return value }
    return NSNull()
  }

  static func defaults() -> [String: Any] {
    [
      "output": uidOrNull(defaultDevice(kAudioHardwarePropertyDefaultOutputDevice)),
      "alert": uidOrNull(defaultDevice(kAudioHardwarePropertyDefaultSystemOutputDevice)),
      "input": uidOrNull(defaultDevice(kAudioHardwarePropertyDefaultInputDevice)),
    ]
  }

  static func snapshot() -> [String: Any] {
    var devices: [[String: Any]] = []
    for device in deviceIDs() {
      guard let uid = uid(of: device) else { continue }
      if flag(device, kAudioDevicePropertyIsHidden) { continue }
      let hasOutput = streamCount(device, outputScope) > 0
      let hasInput = streamCount(device, inputScope) > 0
      if !hasOutput && !hasInput { continue }
      devices.append([
        "uid": uid,
        "name": name(of: device),
        "transport": transport(of: device),
        "hasOutput": hasOutput,
        "hasInput": hasInput,
        "canBeDefaultOutput": hasOutput && flag(device, kAudioDevicePropertyDeviceCanBeDefaultDevice, outputScope),
        "canBeDefaultInput": hasInput && flag(device, kAudioDevicePropertyDeviceCanBeDefaultDevice, inputScope),
        "canBeSystemOutput": hasOutput
          && flag(device, kAudioDevicePropertyDeviceCanBeDefaultSystemDevice, outputScope),
        "outputVolumeSettable": hasOutput && isVolumeSettable(device, outputScope),
        "inputVolumeSettable": hasInput && isVolumeSettable(device, inputScope),
      ])
    }
    return ["devices": devices, "defaults": defaults()]
  }

  static func currentSettings() -> [String: Any] {
    let output = defaultDevice(kAudioHardwarePropertyDefaultOutputDevice)
    let input = defaultDevice(kAudioHardwarePropertyDefaultInputDevice)
    let volumes: [String: Any] = [
      "output": intOrNull(output.flatMap { volume($0, outputScope) }),
      "input": intOrNull(input.flatMap { volume($0, inputScope) }),
      "alert": intOrNull(AlertVolume.get()),
    ]
    return ["defaults": defaults(), "volumes": volumes]
  }
}

/// Pushes a fresh snapshot (debounced) whenever devices appear/disappear or a default changes.
final class AudioMonitor {
  static let shared = AudioMonitor()
  private var pending: DispatchWorkItem?

  func start() {
    let selectors: [AudioObjectPropertySelector] = [
      kAudioHardwarePropertyDevices,
      kAudioHardwarePropertyDefaultOutputDevice,
      kAudioHardwarePropertyDefaultInputDevice,
      kAudioHardwarePropertyDefaultSystemOutputDevice,
    ]
    for selector in selectors {
      var propertyAddress = Audio.address(selector)
      let status = AudioObjectAddPropertyListenerBlock(Audio.system, &propertyAddress, DispatchQueue.main) {
        [weak self] _, _ in
        self?.scheduleSnapshot()
      }
      if status != noErr { logError("couldn't watch audio changes (error \(status))") }
    }
  }

  private func scheduleSnapshot() {
    pending?.cancel()
    let work = DispatchWorkItem { emit(["event": "audioChanged", "snapshot": Audio.snapshot()]) }
    pending = work
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.15, execute: work)
  }
}
