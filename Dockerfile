FROM node:8

ADD ./ ./

RUN 'yarn'

EXPOSE 5008

CMD ['yarn' 'start']