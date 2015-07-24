FROM nginx

# remove default and example
RUN rm /etc/nginx/conf.d/default.conf

# replace default
ADD nginx/nginx.conf /etc/nginx/
ADD client /client

CMD ["nginx", "-g", "daemon off;"]
