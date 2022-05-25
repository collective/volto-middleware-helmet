import helmet from 'helmet';

// TODO: relaxed profile for dev ?
const profiles = {
  default: {
    contentSecurityPolicy: {
      directives: {
        // TODO: need improvements
        scriptSrc: ["'self'", 'https:', "'unsafe-inline'"],
	imgSrc: ["data:", "*.ytimg.com", "*.youtube.com"],
      },
    },
  },
  development: {
    hsts: false,
    contentSecurityPolicy: {
      scriptSrc: ["'self'", 'https:', "'unsafe-inline'"],
      reportOnly: true,
    },
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
  },
};

const applyConfig = (config) => {
  const defaults = {
    helmetSettings: process.env.HELMET_PROFILE
      ? process.env.HELMET_PROFILE
      : __DEVELOPMENT__
      ? 'development'
      : 'default',
  };
  config.settings = {
    ...config.settings,
    ...defaults,
  };
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
