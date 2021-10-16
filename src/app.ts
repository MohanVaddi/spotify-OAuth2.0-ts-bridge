import axios from 'axios';
import getToken, { getBase64Encoded } from './token';
import path = require('path');

import express = require('express');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const redirect_uri = `${process.env.APP_URI}/callback/`;
const refresh_token_uri = `${process.env.APP_URI}/refresh_token/`;

app.get('/', ({ res }) => {
    res.redirect('/login');
});

app.get('/login', ({ res }) => {
    var scopes = 'user-read-email user-read-private playlist-modify-public';
    res.redirect(
        'https://accounts.spotify.com/authorize' +
            '?response_type=code' +
            '&client_id=' +
            process.env.SPOTIFY_CLIENT_ID +
            (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
            '&redirect_uri=' +
            encodeURIComponent(redirect_uri)
    );
});

let access_token = '';
let refresh_token =
    process.env.SPOTIFY_CLIENT_REFRESH_TOKEN || (null as string);

app.get('/callback', async (req, res) => {
    const code = req.query.code;
    console.log(`code: ${code}`);
    const response: any = await getToken(code as string);
    access_token = response.data.access_token;
    refresh_token = response.data.refresh_token;
    if (response.status === 200) {
        // if you also want refresh_token to be passed to the frontend, then use: `${process.env.FRONTEND_APP_URI}?access_token=${access_token}&refresh_token=${refresh_token}`
        res.redirect(
            `${process.env.FRONTEND_APP_URI}?access_token=${access_token}`
        );
    } else {
        res.send(`Error Occoured:  ${response.statusText}`);
    }
});

//if you get access_token successfully, you can visit this route to confirm if the access_token is working.

app.get('/user_data', async ({ res }) => {
    try {
        const response: any = await axios.get('https://api.spotify.com/v1/me', {
            headers: { Authorization: 'Bearer ' + access_token },
        });
        res.send(response.data);
    } catch (err: any) {
        if (err.response.data.error.message === 'The access token expired') {
            res.redirect(refresh_token_uri);
        }
    }
});

app.get('/refresh_token', async ({ res }) => {
    try {
        const response: any = await axios.post(
            'https://accounts.spotify.com/api/token',
            null,
            {
                params: {
                    grant_type: 'refresh_token',
                    refresh_token:
                        refresh_token || localStorage.getItem('refresh_token'),
                },
                headers: {
                    Authorization: `Basic ${getBase64Encoded(
                        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
                    )}`,
                },
            }
        );
        access_token = response.data.access_token;
        res.redirect(
            `${process.env.FRONTEND_APP_URI}?access_token=${access_token}`
        );
    } catch (error) {
        console.log(error);
    }
});

app.listen(port, () => {
    console.log(`Server started in ${port}`);
});
