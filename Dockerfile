FROM nginx:latest
COPY . /usr/share/nginx/html

# build image 
# docker build -t rxjs-search:v1 .