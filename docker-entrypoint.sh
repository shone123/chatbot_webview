#! /bin/bash
forever start webview-server.js --conf prod

tail -f /dev/null