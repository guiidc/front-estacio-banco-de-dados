ARG BASE_IMAGE=node:current-alpine3.20

FROM $BASE_IMAGE as builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM $BASE_IMAGE as runner

WORKDIR /app

COPY --from=builder /app/package.json .

COPY --from=builder /app/package-lock.json .

COPY --from=builder /app/next.config.mjs ./

COPY --from=builder /app/public ./public

COPY --from=builder /app/.next/standalone ./

COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENTRYPOINT ["node", "server.js"]
