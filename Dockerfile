FROM --platform=linux/amd64 node:18-alpine
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

COPY prisma ./
COPY package.json pnpm-lock.yaml ./

RUN apk add -q --update --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

RUN npm i -g pnpm
RUN pnpm i

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]