FROM node:lts-alpine3.9

# INIT
# Update Package List
RUN apk update
# Add Python
RUN apk add --update python3
# ----

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]

