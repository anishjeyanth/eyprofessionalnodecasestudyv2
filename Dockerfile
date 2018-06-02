FROM node:latest

LABEL Author=EYTalentTeam

COPY . /app

WORKDIR /app

EXPOSE 9090

RUN npm install --prod

ENTRYPOINT node .
