# Usamos la imagen base de Node.js con Alpine
FROM node:18-alpine

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos de paquetes
COPY package*.json ./

# Instalamos las dependencias del proyecto
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn \
    # Configuramos las variables de entorno para Puppeteer
    && export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    && export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    # Instalamos las dependencias del proyecto
    && yarn install --frozen-lockfile \
    # Limpiamos el caché de apk para reducir el tamaño de la imagen
    && rm -rf /var/cache/apk/*

# Copiamos el resto de los archivos del proyecto
COPY . .

# Construimos la aplicación
RUN yarn build

# Exponemos el puerto 3000
EXPOSE 3000

# Ejecutamos la aplicación
CMD ["yarn", "start"]