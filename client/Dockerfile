## Build React for prod 

## `AS build` assigns this base image with an alias of `build` to be used later since we are using multi stage builds
FROM node:10.17-alpine AS build 

WORKDIR /client
COPY ./ /client
RUN npm install
RUN npm run build
COPY ./ /client

## Prepare nginx to serve build files
FROM nginx:1.17.5-alpine
COPY --from=build /client/build/ /usr/share/nginx/html/
COPY --from=build /client/default.conf /etc/nginx/conf.d

## Expose port 80 for nginx
EXPOSE 80

## https://stackoverflow.com/questions/18861300/how-to-run-nginx-within-a-docker-container-without-halting
CMD ["nginx", "-g", "daemon off;"]