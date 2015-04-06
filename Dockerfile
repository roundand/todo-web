FROM nginx

# remove default and example
RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/conf.d/example_ssl.conf

# replace default
ADD nginx/nginx.conf /etc/nginx/
ADD client /client

EXPOSE 80:80
CMD ["nginx", "-g", "daemon off;"]
