FROM ubuntu:latest
LABEL version="1.2.0"
LABEL author="Aashish Amber"
RUN apt-get update -y
RUN apt-get install -y sudo
RUN apt-get -y install curl
RUN curl -V
RUN curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
RUN apt-get -y install nodejs
RUN echo "[LOG] node version installed"
RUN node -v
RUN echo "[LOG] npm version installed"
RUN npm -v
RUN apt-get -y install git
RUN echo "[LOG] git version installed"
RUN git --version
RUN apt-get -y install wget
RUN echo "[LOG] wget version installed"
RUN wget --version
RUN apt-get -y install unzip
RUN echo "[LOG] unzip version installed"
RUN unzip -v
RUN echo "[LOG] Installation Done"
RUN apt-get -y install nginx
RUN echo "[LOG] nginx version installed"
RUN nginx -v
RUN echo "[LOG] Installation Done"
COPY . /ust_doc_webview
WORKDIR ./ust_doc_webview
RUN npm install --silent
RUN npm install forever
RUN npm run client-build
ENTRYPOINT ["/ust_doc_webview/docker-entrypoint.sh"]


#ENTRYPOINT ["node", "Forever.js"]
#CMD  ["npm","start"]
#EXPOSE 443