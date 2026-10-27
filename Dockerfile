FROM nginx:alpine
# Parchea paquetes de la base (CVE-2026-111497, brotli-libs) hasta que salga nginx:alpine reconstruido
RUN apk upgrade --no-cache

# Sitio estático (index.html + assets/) servido por nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
COPY styles.css /usr/share/nginx/html/styles.css
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY assets/ /usr/share/nginx/html/assets/

EXPOSE 80
