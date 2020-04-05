# Run the Docker image (view a spec thats hosted on a web-server)
# docker run -it --rm -p 80:80 -e SPEC_URL="http://petstore.swagger.io/v2/swagger.json" rapidoc

# Run the Docker image (view a spec thats on the local disk)
# Mount the local spec onto nginx server (available in the docker container)
#   docker run -it --rm -p 80:80 \
#    -v $(pwd)/my-openapi.yaml:/usr/share/nginx/html/my-openapi.yaml \
#    -e SPEC_URL = "my-openapi.yaml" mrin9/rapidoc


# To Run the Docker image  with custom RapiDoc options such as dark theme
# Example 1 (dark mode)
#   docker run -it --rm -p 80:80 \
#    -e SPEC_URL="http://petstore.swagger.io/v2/swagger.json" 
#    -e RAPIDOC_OPTIONS="theme='dark'" mrin9/rapidoc

# Example 2 (provide your own api server) 
#   docker run -it --rm -p 80:80 \
#    -e SPEC_URL="http://petstore.swagger.io/v2/swagger.json" \
#    -e RAPIDOC_OPTIONS="theme='dark' server-url='http://localhost:8080/api'" mrin9/rapidoc

FROM node:alpine

RUN apk update

# Copy files needed for building
WORKDIR /build
COPY package.json yarn.lock webpack.config.js .babelrc .eslintrc jsconfig.json index.html /build/

# Copy src
COPY src /build/src

# Install Dependencies
RUN yarn install --frozen-lockfile --silent

# Build
RUN yarn build


FROM nginx:alpine

ENV PAGE_TITLE="RapiDoc"
ENV PAGE_FAVICON="favicon.png"
ENV SPEC_URL="http://petstore.swagger.io/v2/swagger.json"
ENV PORT=80
ENV RAPIDOC_OPTIONS=

# copy files to the nginx folder
COPY --from=0 build/dist /usr/share/nginx/html
COPY docker/index.tpl.html /usr/share/nginx/html/index.html
COPY logo.png /usr/share/nginx/html/favicon.png
COPY docker/nginx.conf /etc/nginx/
COPY docker/docker-run.sh /usr/local/bin

EXPOSE 80

CMD ["sh", "/usr/local/bin/docker-run.sh"]