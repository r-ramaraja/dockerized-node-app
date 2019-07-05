# ============================================
# ===== BUILD STAGE ==========================
# ============================================
FROM node:10-alpine as buildStage

WORKDIR /usr/src/app

COPY package.json ./

RUN npm i --no-package-lock --production --loglevel verbose

# ============================================
# ===== PACK STAGE ===========================
# ============================================
FROM node:10-alpine

COPY --from=buildStage /usr/src/app/node_modules ./node_modules
COPY . .

EXPOSE 8080

ENTRYPOINT ["node","server/index.js"]