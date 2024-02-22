# Usamos la imagen base de Node.js con Alpine
FROM node:18-alpine

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos de paquetes
COPY package*.json ./

# Instalamos las dependencias del proyecto
RUN apk add -q --update --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    npm

# Configuramos las variables de entorno para Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Instalamos las dependencias del proyecto
RUN npm install

# Copiamos el resto de los archivos del proyecto
COPY . .

# Construimos la aplicación
RUN npm run build

# Exponemos el puerto 3000
EXPOSE 3000

# Ejecutamos la aplicación
CMD ["npm", "start"]
