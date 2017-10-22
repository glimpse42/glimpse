FROM node:boron

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000
CMD [ "node", "/usr/src/app/bin/www"]

#RUN apk add --update nodejs
#
#COPY package.json /src/package.json
#RUN cd /src; npm install
#
#COPY . /src
#EXPOSE 3000
#CMD ["node", "/src/bin/www"]