export interface NativeSidecarTarget {
    /** Directory name under native/ — must match the built executable's name. */
    name: string;
    /** Absolute path to the SwiftPM package directory. */
    packageDir: string;
}
export interface NativeSidecarBuildOptions {
    configuration?: "debug" | "release";
    emitBinaries?: boolean;
}
export interface SwiftPackageDump {
    dependencies?: Array<{
        sourceControl?: Array<{
            location?: string | {
                remote?: Array<{
                    urlString?: string;
                }>;
            };
        }>;
    }>;
    products?: Array<{
        name: string;
        type?: Record<string, unknown>;
    }>;
    targets?: Array<{
        name: string;
        type?: string;
        settings?: Array<{
            kind?: Record<string, unknown>;
            tool?: string;
        }>;
    }>;
}
export interface SwiftPackageResolved {
    object?: {
        pins?: Array<{
            package?: string;
            repositoryURL?: string;
            state?: {
                revision?: string;
                version?: string;
                branch?: string;
            };
        }>;
    };
    pins?: Array<{
        identity?: string;
        kind?: string;
        location?: string;
        state?: {
            revision?: string;
            version?: string;
            branch?: string;
        };
    }>;
}
export declare function discoverNativeSidecars(appRoot: string): NativeSidecarTarget[];
export declare function validatePackageDump(name: string, dump: SwiftPackageDump): void;
export declare function validateDependencyPackageDump(sidecarName: string, dependencyIdentity: string, dump: SwiftPackageDump, trustedBuildTooling?: boolean): void;
export declare function validateResolvedDependencies(name: string, resolved: SwiftPackageResolved): void;
export declare function xcodeBuildArguments(name: string, derivedDataPath: string, configuration: "debug" | "release", hasDependencies?: boolean): string[];
export declare function nativeSidecarDerivedDataPath(appRoot: string, name: string): string;
interface GeneratedSwiftBindings {
    definitions: string;
    implementation: string;
}
export declare function generatedSwiftBindingsPaths(derivedDataPath: string, name: string): GeneratedSwiftBindings[];
export declare function findGeneratedSwiftBindings(derivedDataPath: string, name: string): GeneratedSwiftBindings | undefined;
/**
 * Compile every native/<name>/ SwiftPM package into an arm64 executable at
 * <buildOutDir>/bin/<name>. Always compiles from source — prebuilt binaries in
 * the app repo are never copied. Compile errors surface Xcode diagnostics.
 */
export declare function compileNativeSidecars(appRoot: string, options?: NativeSidecarBuildOptions): Promise<void>;
export {};
