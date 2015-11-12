# Berim Social Network

## Getting started

**Setup Berim Social Network**

Edit `config/settings.js` to set your database, user & password.

```bash
npm install
node tasks/reset # sets up the database
node server.js
```

And then open up [localhost:3000](http://localhost:3000/)

You can also run it with `./script/start` if you are in *nix. The script launches nodemon which
automatically restarts the server if you change any code.
