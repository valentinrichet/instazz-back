FROM node:12

# INIT
# Update Package List
RUN apt-get update \
    && apt-get -y install --no-install-recommends apt-utils dialog 2>&1

# Clean up
RUN apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*
# ----

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install && npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]

