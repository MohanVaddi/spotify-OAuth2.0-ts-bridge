# Spotify Web api OAuth2.0 Authentication with TypeScript.
### This service will redirect the user to a given frontend application with a valid ```access_token``` as a parameter in the url.
- This project only covers the ```Authorization code``` workflow of OAuth2.0 following the rules mentioned in the [Authorization Guide](https://developer.spotify.com/documentation/general/guides/authorization-guide/).

### Installation:
    $ npm install
    
### Steps to acquire credentials from the spotify web api:
- Register your app and get your own ```client_id``` and ```client_secret``` from the [Spotify Developers Dashboard](https://developer.spotify.com/dashboard/login).
- To do so, go to your [Spotify Developers Dashboard](https://developer.spotify.com/dashboard/login) and create your application.
- Then registered Redirect URIs in the app settings,
- The redirect uri must be:
``` <Your App url>/callback/```
- Please make note of ```client_id```, ```client_secret``` and ```redirect_uri```.
- After creating your app, create a ```.env``` file.

### Create ```.env``` file and add:
     SPOTIFY_CLIENT_ID = '<your spotify client id>'
     SPOTIFY_CLIENT_SECRET = '<your spotify client secret>'
     SPOTIFY_CLIENT_REFRESH_TOKEN = '<redirect uri>'
     APP_URI = '<url of your app with port included>'
     FRONTEND_APP_URI = '<url of your frontend app>'
     
### Note: 
- Incase of development server, your ```APP_URI``` will be ```http://localhost:3000/```. but if you deployed it in heroku or any other platform, chane the APP_URI accordingly.
- ```FRONTEND_APP_URI``` must be the url where you want both the user and access_token to be redirected to.

### To run:
- Start script is already included in the ```package.json```, so run ```npm start``` to start the server:
####
    $ npm start
