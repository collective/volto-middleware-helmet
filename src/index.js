import helmet from 'helmet';
const crypto = require("crypto");

const helmetModelsCSP = {
  none: false,
  light: {
    'default-src': ['http:', 'https:', "'unsafe-inline'"],
    'script-src': ['*', "'unsafe-inline'", "'unsafe-eval'", "'unsafe-hashes'"],
    'style-src': ['*', 'http:', 'https:', "'unsafe-inline'", "'unsafe-hashes'"],
    'img-src': ['*', 'data:', 'blob:', 'http:', 'https:'],
    'font-src': ['*', 'data:', 'http:', 'https:'],
  },
  // TODO: check the hash of the volto scripts, remove the unsafe-inline and unsafe-hashes from the CSP
  medium: {
    //WARNING: the default page will not load correctly with this setting (script coming from other source)
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
    'font-src': ["'self'", 'data:'],
  },
  strict: {
    //WARNING: the default page will not load correctly with this setting
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
    'font-src': ["'self'"],
  },
};

// Apply the helmet settings based on the environment and the profile chosen
const helmetSpecifiedProfiles = {
  default: {
    contentSecurityPolicy: {
      directives: helmetModelsCSP.light,
    },
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
  },
  development: {
    hsts: false,
    contentSecurityPolicy: {
      directives: {
        ...helmetModelsCSP.medium,
        'default-src': ["'self'", 'ws:', 'localhost:3001'],
        'connect-src': ["'self'", 'ws:', 'localhost:3001'],
        'font-src': ["'self'", 'localhost:3001', 'data:'],
        'img-src': ["'self'", 'data:', 'blob:', 'localhost:3001'],
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-hashes'",
          "'strict-dynamic'",
          (req, res) => {
            res.locals.nonce = crypto.randomBytes(16).toString('hex');
            // cryptoRandomString({
            //   length: 32,
            //   type: 'base64',
            // });
            return `'nonce-${res.locals.nonce}'`;
          },
          'localhost:3001',
        ],
      },
      reportOnly: true,
    },
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
  },
};

const applyConfig = (config) => {
  const helmetSettings =
    process.env.HELMET_PROFILE || (__DEVELOPMENT__ ? 'development' : 'default');

  config.settings = {
    ...config.settings,
    helmetSettings,
  };

  // enable helmet middleware only when server side rendering is executed
  if (__SERVER__) {
    const settings = helmetSpecifiedProfiles[helmetSettings] || helmetSettings;
    const middleware = helmet(settings);
    middleware.id = 'helmet-middleware';
    config.settings.expressMiddleware.push(middleware);
  }

  return config;
};

export default applyConfig;
