FROM alpine:3.1

RUN apk add --update nodejs

COPY package.json /src/package.json
RUN cd /src; npm install

COPY . /src
EXPOSE 3000
CMD ["node", "/src/bin/www"]