const express = require('express');
const { redirect } = require('react-router-dom');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.post('/login', (req, res) => {
    const code = req.body.code
    const spotifyWebApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:5173',
        clientId: '//',
        clientSecret: '//'
    })
    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
        .catch(() => {
            res.sendStatus(400)
        })
    })
})
