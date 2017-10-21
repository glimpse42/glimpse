# glimpse
Take a glimpse at your life...



Docker
1) To build a docker image
```docker build -t <your username>/glimpse .```
2) Run the docker image
```docker run -p 49160:8080 -d <your username>/glimpse```
3) To test, the port the app was mapped to by Docker using ```docker ps``` and then run ```curl -i localhost:49160``` or hit that url from a browser
