
# Install

npm install

# Run On Production

# Run for Local Devlopment

Frontend javascript files are in the 'frontend' folder.

Use the following command to build them:
```
# Windows
> node_modules\.bin\webpack -d --watch

# Linux
> ./node_modules/.bin/webpack -d --watch

# OR equivalently (for both Win/linux)
> npm run dev
```
Above command will compile the files in the 'frontend' folder into 'bundle.js' and place it in 'public/js/bundle.js'.

(Ref. webpack.config.js for more details)

Once built, run the express server:
```
> node server.js
```
Navigate to localhost:3000 to view the app.
