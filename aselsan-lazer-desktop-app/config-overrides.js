const path = require('path');
const { override,useBabelRc,addDecoratorsLegacy,setWebpackTarget} = require('customize-cra');

/*const overrideProcessEnv = value => config => {
  config.resolve.modules = [
    path.join(__dirname, 'src')
  ].concat(config.resolve.modules);
  return config;
};*/


const ENV_PREFIX = /^REACT_APP_/i;

const findWebpackPlugin = (plugins, pluginName) =>
    plugins.find((plugin) => plugin.constructor.name === pluginName);

const overrideProcessEnv = () => (config) => {
    const plugin = findWebpackPlugin(config.plugins, 'DefinePlugin');
    const processEnv = plugin.definitions['process.env'] || {};

    const transformedEnv = Object.keys(processEnv)
        .filter((key) => ENV_PREFIX.test(key))
        .reduce((env, key) => {
            const craKey = key.replace('REACT_APP_', '');
            env[craKey] = processEnv[key];
            return env;
        }, {});

    plugin.definitions['process.env'] = {
        ...processEnv,
        ...transformedEnv,
    };

    return config;
};


module.exports = override(
    setWebpackTarget('electron-renderer'),
    addDecoratorsLegacy(),
  useBabelRc(),

  overrideProcessEnv({
    VERSION: JSON.stringify(require('./package.json').version),
    GOOGLE_API_KEY:"AIzaSyAJ_6n7wqqK8sIk0LV6IqO3OuukpMIbQMM"
  })
);
