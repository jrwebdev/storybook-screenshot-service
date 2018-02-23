FROM node:8

WORKDIR /app
ADD . /app

RUN 'yarn'

EXPOSE 5008

CMD ['yarn' 'start']