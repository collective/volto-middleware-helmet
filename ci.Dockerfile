FROM plone/volto-addon-ci
USER root
COPY . /opt/frontend/my-volto-project/src/addons/volto-middleware-helmet
RUN mkdir /opt/frontend/my-volto-project/src/addons/volto-middleware-helmet/node_modules && \
     chown node:node /opt/frontend/my-volto-project/src/addons/volto-middleware-helmet/node_modules
USER node
