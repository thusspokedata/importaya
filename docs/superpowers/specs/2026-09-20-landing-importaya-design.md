# Landing importaya.com.ar — Diseño / Runbook

**Fecha:** 2026-09-20
**Repo:** `importeya` (nombre del repo; el dominio es `importaya.com.ar`)

## Objetivo

Landing page **sencillo** para IMPORTAYA by VERTEX (servicio de importación
China → Argentina). El contenido completo (los 5 pasos, "¿Cómo funciona?" y los
datos de contacto) ya vive dentro de una imagen/infografía generada por diseño.
El landing solo tiene que **mostrar esa imagen** de forma prolija y responsive y
ofrecer un contacto de WhatsApp tappable.

## Alcance (YAGNI)

- **Sí:** una sola página estática mostrando la infografía + botón flotante de WhatsApp + SEO/OpenGraph básico.
- **No:** formularios, backend, CMS, analytics, múltiples páginas, i18n, cookie banners.

## Asset

- Imagen fuente: `assets/importaya.png` (1460×1534, PNG, ~3 MB). Copiada desde `~/Downloads/importaya.png`.
- La imagen incluye ya: logo IMPORTAYA by VERTEX, tagline "Tu negocio sin fronteras",
  los 5 pasos, "Ideal para", y contactos: WhatsApp **385 334 1111**, Instagram **@importaya**, web **importaya.com.ar**.

## Sitio

Un `index.html` + `assets/importaya.png` + CSS inline/mínimo. Sin frameworks, sin build.

- **Layout:** imagen centrada. En móvil ocupa el ancho completo; en desktop con `max-width`
  (~820px, acorde al aspecto casi cuadrado 1460×1534) centrada sobre fondo celeste claro
  que combina con la infografía.
- **Imagen responsive:** `img` con `width:100%; height:auto; max-width`. `loading="eager"`,
  `alt` descriptivo ("IMPORTAYA by VERTEX — Cómo funciona: importá desde China a Argentina").
- **Botón flotante WhatsApp (FAB):** verde, fijo abajo a la derecha, siempre visible,
  con ícono. Link: `https://wa.me/5493853341111`
  (número **385 334 1111**, Santiago del Estero → `+54 9 385 334 1111`). `target="_blank" rel="noopener"`.
  ⚠️ Verificar el número con el cliente antes de publicar.
- **SEO / social:** `<title>`, `<meta name="description">`, OpenGraph (`og:title`, `og:description`,
  `og:image` apuntando a la propia infografía, `og:url`), `theme-color`, favicon, `lang="es"`,
  viewport meta. Preview lindo cuando se comparte por WhatsApp/redes.

## Despliegue

Mismo patrón ya usado en la infra (ej. `lahuelladelcaminante-com`, `viajarpais`).

### Pi `web` (WireGuard 10.8.0.2) — sirve el estático

- Contenedor `nginx:alpine` sirviendo el sitio estático.
- Puerto host **3010** (verificado libre) → `3010:80`.
- Archivos en el repo:
  - `Dockerfile` (FROM nginx:alpine, COPY del sitio a `/usr/share/nginx/html`).
  - `docker-compose.yml` (service `importaya`, `restart: unless-stopped`, `ports: "3010:80"`, `container_name: importaya`).
- Deploy: clonar el repo en la Pi y `docker compose up -d --build`.
- Verificación interna: `curl -I http://localhost:3010` en la Pi → 200.

### VPS `vps2` (187.33.156.20) — TLS + proxy

- Nuevo `server` block nginx `importaya.com.ar` (+ `www.importaya.com.ar`):
  `proxy_pass http://10.8.0.2:3010;` con los headers estándar (igual a `viajarpais`).
- TLS con **certbot** (`--nginx`) → Let's Encrypt. Redirección 80→443 y www→apex.
- Requiere que el DNS ya resuelva (ver Prerequisito).

### Prerequisito del cliente — DNS (bloqueante para HTTPS)

- Estado actual: `importaya.com.ar` **no resuelve** (sin A ni NS).
- El cliente debe registrar/delegar `importaya.com.ar` en **nic.ar** y crear:
  - A `@`   → `187.33.156.20`
  - A `www` → `187.33.156.20`
- Recién cuando propague, certbot puede emitir el certificado.

## Orden de trabajo

1. Copiar imagen al repo, construir `index.html` + CSS + FAB WhatsApp.
2. Probar localmente (abrir en navegador / preview).
3. Agregar `Dockerfile` + `docker-compose.yml`; commit + push.
4. Desplegar en la Pi (`docker compose up -d --build`), verificar `curl` interno.
5. (Cuando DNS resuelva) configurar nginx + certbot en la VPS.
6. Verificación final: `https://importaya.com.ar` carga la infografía y el WhatsApp abre el chat.

## Verificación / criterios de éxito

- La página muestra la infografía completa, nítida y centrada, sin scroll horizontal, en móvil y desktop.
- El botón de WhatsApp abre `wa.me/5493853341111`.
- Al compartir el link, aparece preview con imagen y título.
- `https://importaya.com.ar` con candado válido (una vez hecho el DNS).

## Riesgos / cuestiones abiertas

- **Número de WhatsApp:** asumido `+54 9 385 334 1111`. Confirmar con el cliente.
- **DNS:** fuera de nuestro control; el HTTPS queda pendiente hasta que el cliente lo configure.
- **Tamaño imagen (~3 MB):** aceptable para un landing de una sola imagen; se puede optimizar
  (WebP) más adelante si hace falta, no ahora.
