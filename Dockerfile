FROM node:17-alpine

RUN mkdir -p /home/app/node_modules

COPY build/ /home/app/
COPY node_modules/ /home/app/node_modules/

CMD ["node", "/home/app/server.js"]
