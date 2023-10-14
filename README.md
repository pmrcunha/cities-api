# Cities API challenge

The script `index.js` uses a local api to perform various operations on a set of cities. Your task is to implement an api so that the script runs successfully all the way to the end.

Run `npm install` and `npm run start` to start the script.

Your api can load the required data from [here](addresses.json).

In the distance calculations you can assume the earth is a perfect sphere and has a radius is 6371 km.

---

# Usage

1. `docker-compose build`
2. `docker-compose up`
3. Go to `http://localhost/` in your browser

# Implementation

1. I started by making an MVP server in Typescript and Node that solved the challenge. Nothing too exciting.
2. Containers are important for the Danish economy, so I added a Dockerfile and docker-compose.yml to make it easy to deploy.
3. In case there is a section of the target market that thinks `curl` is an hair style, I added a web interface. Using Angular, because I heard some people like it.
