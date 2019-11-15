## Prepare server
FROM node:10.17-alpine AS server

WORKDIR /server
COPY ./ /server
RUN npm install

EXPOSE 8000

## Run the server in prod mode, ensure that .env.prod file is created
CMD ["npm", "start"]

