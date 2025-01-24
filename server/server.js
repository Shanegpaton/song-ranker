const express = require('express');
const { redirect } = require('react-router-dom');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.post('/login', (req, res) => {
    const code = req.body.code
    const spotifyWebApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:5173',
        clientId: '61da338eac6f4bcd9642daeed0378eb4',
        clientSecret: 'dc0d1206385f4020977ad6f79b7fade3'
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