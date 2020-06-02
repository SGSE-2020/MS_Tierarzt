FROM nginx:alpine

EXPOSE 8080
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY dist/client/ /usr/share/nginx/html

RUN chown -R nginx /etc/nginx /run
RUN chmod -R a+w /run /var/cache /var/cache/nginx

USER 100
