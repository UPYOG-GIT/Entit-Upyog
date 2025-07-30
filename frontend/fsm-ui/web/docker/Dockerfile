FROM upyogio/alpine-node-builder-14:yarn AS build
# FROM ghcr.io/egovernments/alpine-node-builder-14:yarn AS build
RUN apk update && apk upgrade
RUN apk add --no-cache git>2.30.0
# RUN yarn add @entit/digit-ui-css
# RUN yarn add @upyog/digit-ui-libraries
# RUN yarn add @upyog/digit-ui-module-common
# RUN yarn add @upyog/digit-ui-module-commonpt
# RUN yarn add @upyog/digit-ui-module-core
# RUN yarn add @upyog/digit-ui-module-fsm
# RUN yarn add @upyog/digit-ui-module-hrms
# RUN yarn add @upyog/digit-ui-module-receipts
# RUN yarn add @upyog/digit-ui-module-tl
# RUN yarn add @upyog/digit-ui-react-components
# RUN yarn add @upyog/digit-ui-module-pt


ARG WORK_DIR
WORKDIR /app
ENV NODE_OPTIONS "--max-old-space-size=3792"

COPY ${WORK_DIR} .
RUN ls -lah

#RUN node web/envs.js
RUN cd web/ \
    && node envs.js \
    &&  ./install-deps.sh \
    && yarn install \
    && yarn build 

FROM nginx:mainline-alpine
#FROM ghcr.io/egovernments/nginx:mainline-alpine
ENV WORK_DIR=/var/web/fsm-ui

RUN mkdir -p ${WORK_DIR}

COPY --from=build /app/web/build ${WORK_DIR}/
COPY --from=build /app/web/docker/nginx.conf /etc/nginx/conf.d/default.conf

