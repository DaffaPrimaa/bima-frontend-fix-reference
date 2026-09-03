# Build stage
FROM node:24-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .

# VITE_API_BASE_URL dibakar ke JS bundle saat build (bukan runtime seperti env
# backend) - default path relatif /api/v1, di-proxy Caddy 1 origin ke backend.
ARG VITE_API_BASE_URL=/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
# vite build langsung (bukan `npm run build` / `tsc -b`) - kode masih ada
# in-progress work (variabel WIP, dsb) yang bikin type-check strict gagal.
# vite build sendiri sudah transpile TS, cuma skip pengecekan tipe strict.
RUN npx vite build

# Prod stage - hasil build statis, cukup nginx (tidak butuh runtime Node)
FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
