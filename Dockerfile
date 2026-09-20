FROM nginx:alpine

# Sitio estático (index.html + assets/) servido por nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
COPY styles.css /usr/share/nginx/html/styles.css
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY pro/ /usr/share/nginx/html/pro/
COPY assets/ /usr/share/nginx/html/assets/

EXPOSE 80
