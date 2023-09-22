FROM node:16.14.2-alpine3.15

ENV TZ Asia/Tokyo

WORKDIR /usr/src/app

COPY ./ ./
RUN apk update && apk add bash
RUN npm install
RUN npm install next react react-dom react-hook-form axios @nextui-org/react framer-motion next-themes @auth0/nextjs-auth0
RUN yarn add react-hook-form axios @nextui-org/react

CMD ["npm", "run", "dev"]