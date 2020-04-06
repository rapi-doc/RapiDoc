## Run the Docker image (view a spec thats hosted on a web-server)
```
  docker run -it --rm -p 80:80 -e SPEC_URL="http://petstore.swagger.io/v2/swagger.json" rapidoc
```

## Run the Docker image (view a spec thats on the local disk)
```shell
# Mount the local spec onto nginx server (available in the docker container)
  docker run -it --rm -p 80:80 \
    -v $(pwd)/my-openapi.yaml:/usr/share/nginx/html/my-openapi.yaml \
    -e SPEC_URL = "my-openapi.yaml" mrin9/rapidoc
```

## To Run the Docker image  with custom RapiDoc options such as dark theme
```shell
# Example 1 (dark mode)
  docker run -it --rm -p 80:80 \
    -e SPEC_URL="http://petstore.swagger.io/v2/swagger.json" 
    -e RAPIDOC_OPTIONS="theme='dark'" mrin9/rapidoc

# Example 2 (provide your own api server) 
  docker run -it --rm -p 80:80 \
    -e SPEC_URL="http://petstore.swagger.io/v2/swagger.json" \
    -e RAPIDOC_OPTIONS="theme='dark' server-url='http://localhost:8080/api'" mrin9/rapidoc
```