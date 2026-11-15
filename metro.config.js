// Expo Metro config. One tweak: force `tslib` to its CommonJS build.
// framer-motion (a moti dependency) imports `tslib`, whose ESM entry breaks the Node render step of
// `expo export --platform web` ("Cannot destructure property '__extends' of 'n.default'").
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
const previousResolve = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'tslib') {
    return context.resolveRequest(context, 'tslib/tslib.js', platform);
  }
  return (previousResolve ?? context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
