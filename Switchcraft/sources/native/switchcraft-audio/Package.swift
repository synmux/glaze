// swift-tools-version:6.0
import PackageDescription

let package = Package(
  name: "switchcraft-audio",
  platforms: [.macOS(.v13)],
  targets: [
    .executableTarget(
      name: "switchcraft-audio",
      swiftSettings: [.swiftLanguageMode(.v5)]
    )
  ]
)
