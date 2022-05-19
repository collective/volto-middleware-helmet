import helmet from 'helmet';

const applyConfig = (config) => {
  if (__SERVER__) {
    const middleware = helmet();
    middleware.id = 'helmet-middleware';

    config.settings.expressMiddleware = [
      ...config.settings.expressMiddleware,
      middleware,
    ];
  }
  return config;
};

export default applyConfig;
