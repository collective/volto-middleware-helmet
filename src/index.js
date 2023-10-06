import helmet from "helmet";

const helmetModels = {
  none: false,
  light: {
    'default-src': ["http:", "https:", "'unsafe-inline'"],
    'script-src': ["*", "'unsafe-inline'", "'unsafe-eval'", "'unsafe-hashes'"],
    'style-src': ["*", "http:", "https:", "'unsafe-inline'", "'unsafe-hashes'"],
    'img-src': ["*", "data:", "blob:", "http:", "https:"],
  },
  // TODO: check the hash of the volto scripts, remove the unsafe-inline and unsafe-hashes from the CSP
  medium: { //WARNING: the default page will not load correctly with this setting (script coming from other source)
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-hashes'"],
    'style-src': ["'self'", "'unsafe-inline'", "'unsafe-hashes'"],
    'img-src': ["'self'", 'data:', 'blob:'],
    'connect-src': ["'self'"],
    'frame-src': ["'self'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'manifest-src': ["'self'"],
    'worker-src': ["'self'"],
  },
  strict: { //WARNING: the default page will not load correctly with this setting
    'default-src': ["'self'"],
    'script-src': ["'self'"],
    'style-src': ["'self'"],
    'img-src': ["'self'"],
    'connect-src': ["'self'"],
    'frame-src': ["'self'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'manifest-src': ["'self'"],
    'worker-src': ["'self'"],
  }
}

// Apply the helmet settings based on the environment and the profile chosen
const helmetSpecifiedProfiles = {
  default: {
    contentSecurityPolicy: {
      directives: helmetModels.light,
    },
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
  },
  development: {
    hsts: false,
    contentSecurityPolicy: helmetModels.none,
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
  },
};

const applyConfig = (config) => {
  const helmetSettings = process.env.HELMET_PROFILE || (__DEVELOPMENT__ ? "development" : "default");

  config.settings = {
    ...config.settings,
    helmetSettings,
  };

  // enable helmet middleware only when server side rendering is executed
  if (__SERVER__) {
    const settings = helmetSpecifiedProfiles[helmetSettings] || helmetSettings;
    const middleware = helmet(helmetSpecifiedProfiles.default);
    middleware.id = "helmet-middleware";
    config.settings.expressMiddleware.push(middleware);
  }

  return config;
};

export default applyConfig;
