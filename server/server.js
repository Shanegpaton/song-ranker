const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const session = require("express-session");
const cors = require('cors');
const app = express();
require('dotenv').config();
const spotifyAuth = require('./middleware/spotifyAuth');


app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(session({
    secret: process.env.session_secret,
    resave: false,
    httpOnly: true,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

app.post('/login', async (req, res) => {
    const code = req.body.code;
    const spotifyWebApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:5173',
        clientId: process.env.client_id,
        clientSecret: process.env.client_secret,
    });
    try {
        const data = await spotifyWebApi.authorizationCodeGrant(code);
        req.session.accessToken = data.body.access_token;
        req.session.refreshToken = data.body.refresh_token;
        req.session.expiresIn = data.body.expires_in;
        res.json({
            message: "Logged in successfully"
        });
    } catch (error) {
        console.error('Spotify auth error:', error);
        res.sendStatus(400);
    }
});

app.get('/session', (req, res) => {
    if (req.session.accessToken) {
        res.json({ loggedIn: true });
    } else {
        res.json({ loggedIn: false });
    }
});

app.use('/spotify', spotifyAuth);


app.get('/spotify/get-albums', async (req, res) => {
    const { artistId, includeGroups } = req.query;
    let albums = [];
    let nextPage = `https://api.spotify.com/v1/artists/${artistId}/albums`;

    // Loop through the paginated albums
    while (nextPage) {
        const response = await axios.get(nextPage, {
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}}`,
            },
            params: {
                market: 'US', // Specify the market (e.g., US)
                limit: 50, // Number of albums per request
                include_groups: includeGroups, // Filter to get only albums
            },
        });

        albums = albums.concat(response.data.items); // Concatenate albums into the array
        nextPage = response.data.next; // Get the next page URL for pagination
    }
    res.json(albums); // Return all albums
});

app.get('/spotify/get-tracks', async (req, res) => {
    const albumId = req.query.albumId;
    let tracks = [];
    let nextPage = `https://api.spotify.com/v1/albums/${albumId}/tracks`;

    // Loop through the paginated tracks
    while (nextPage) {
        const response = await axios.get(nextPage, {
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}}`,
            },
            params: {
                limit: 50, // Number of tracks per request
            },
        });
        if (album) {
            response.data.items.forEach(track => {
                track.album = album; // Add album properties to the track
            });
        }
        tracks = tracks.concat(response.data.items); // Concatenate tracks into the array
        nextPage = response.data.next; // Get the next page URL for pagination
    }
    res.json(tracks); // Return all tracks
});





app.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
});
