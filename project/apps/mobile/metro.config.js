const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../../..");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

// Used by /kitchen-sink to enumerate every component file with require.context.
config.transformer.unstable_allowRequireContext = true;

config.watchFolders = [workspaceRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

config.resolver.unstable_enableSymlinks = true;

config.resolver.extraNodeModules = {
  "@": path.resolve(projectRoot, "src"),
};

const webShimAliases = {
  "next/dynamic": path.resolve(workspaceRoot, "apps/_native/web-shims/next-dynamic.tsx"),
  "next/font/google": path.resolve(workspaceRoot, "apps/_native/web-shims/next-font-google.ts"),
  "next/font/local": path.resolve(workspaceRoot, "apps/_native/web-shims/next-font-local.ts"),
  "next/image": path.resolve(workspaceRoot, "apps/_native/web-shims/next-image.tsx"),
  "next/link": path.resolve(workspaceRoot, "apps/_native/web-shims/next-link.tsx"),
  "next/navigation": path.resolve(workspaceRoot, "apps/_native/web-shims/next-navigation.ts"),
  "~env": path.resolve(workspaceRoot, "apps/_native/web-shims/ui-docs-env.ts"),
};

const defaultResolveRequest = config.resolver.resolveRequest;

// Pin every @react-navigation/* package to one resolved copy. With package
// exports enabled, core can otherwise be loaded through two different
// conditions (src vs built lib), yielding duplicate navigation contexts and a
// "Couldn't register the navigator" crash in the release bundle.
const reactNavigationSingletons = {};
for (const pkg of [
  "@react-navigation/core",
  "@react-navigation/native",
  "@react-navigation/native-stack",
  "@react-navigation/elements",
  "@react-navigation/routers",
]) {
  try {
    reactNavigationSingletons[pkg] = require.resolve(pkg, { paths: [workspaceRoot] });
  } catch {}
}

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const shimPath = webShimAliases[moduleName];

  if (shimPath) {
    return {
      filePath: shimPath,
      type: "sourceFile",
    };
  }

  const navSingleton = reactNavigationSingletons[moduleName];

  if (navSingleton) {
    return {
      filePath: navSingleton,
      type: "sourceFile",
    };
  }

  if (
    moduleName.startsWith("@/") &&
    context.originModulePath.includes(`${path.sep}apps${path.sep}web${path.sep}ui-docs${path.sep}`)
  ) {
    return context.resolveRequest(
      context,
      path.resolve(workspaceRoot, "apps/_web/ui-docs/src", moduleName.slice(2)),
      platform,
    );
  }

  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

config.resolver.sourceExts.push("sql");
config.resolver.assetExts.push("lottie");
config.resolver.assetExts.push("svg");
config.resolver.assetExts.push("wasm");

const uniwindConfig = withUniwindConfig(config, {
  cssEntryFile: "./src/global.css",
  dtsFile: "./src/uniwind-types.d.ts",
});

module.exports = uniwindConfig;
