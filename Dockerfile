ARG REACT_APP_ADMIN_KEY
FROM ${REACT_APP_ADMIN_KEY}

FROM node:12 as builder
WORKDIR /usr/src/app
COPY ./page/package.json ./
RUN yarn
COPY ./page/. .
RUN yarn build

FROM node:12
WORKDIR /usr/src/app
COPY ./server/package.json ./
RUN yarn
COPY --from=builder /usr/src/app/build /usr/src/app/build
COPY ./server/. .

EXPOSE 3000
CMD [ "yarn", "start" ]
