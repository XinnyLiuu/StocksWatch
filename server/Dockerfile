## Prepare server
FROM node:10.17-alpine AS server

WORKDIR /server
COPY ./ /server
RUN npm install

EXPOSE 8000

## Start the server
CMD ["npm", "start"]