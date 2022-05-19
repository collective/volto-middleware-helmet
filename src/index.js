import helmet from 'helmet';

// TODO: relaxed profile for dev ?
const profiles = {
  strict: {},
};

const applyConfig = (config) => {
  if (__SERVER__) {
    const settings =
      profiles[config.settings?.helmetSettings] === undefined
        ? config.settings?.helmetSettings
        : profiles[config.settings?.helmetSettings];
    const middleware = helmet(settings);
    middleware.id = 'helmet-middleware';

    config.settings.expressMiddleware = [
      ...config.settings.expressMiddleware,
      middleware,
    ];
  }
  return config;
};

export default applyConfig;
