ARG PLATFORM=linux/amd64

FROM --platform=${PLATFORM} node:alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install 

COPY . .

RUN npx prisma generate

RUN npm run build

FROM --platform=${PLATFORM} node:alpine AS prod
WORKDIR /app

COPY --from=build /app ./

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]