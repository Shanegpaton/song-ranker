const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const session = require("express-session");
const cors = require('cors');
const app = express();
const axios = require('axios');
require('dotenv').config();
const spotifyAuth = require('./middleware/spotifyAuth');
const { getAlbumsForArtist, getTracksForAlbum } = require('./spotifyService');



app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    httpOnly: true,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Authentication routes
app.post('/auth/sessions', async (req, res) => {
    const code = req.body.code;
    const spotifyWebApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:5173',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
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

app.get('/auth/sessions', (req, res) => {
    if (req.session.accessToken) {
        res.json({
            loggedIn: true,
            accessToken: req.session.accessToken
        });
    } else {
        res.json({ loggedIn: false });
    }
});

// Spotify API proxy routes (require authentication)
app.use('/spotify', spotifyAuth);

// Get all albums for an artist
app.get('/spotify/artists/:artistId/albums', async (req, res) => {
    const { artistId } = req.params;
    const { include_groups } = req.query;
    try {
        const albums = await getAlbumsForArtist(
            artistId,
            include_groups,
            req.session.accessToken
        );
        res.json(albums);
    } catch (error) {
        console.error('Error fetching albums:', error.message);
        res.status(500).json({ error: 'Failed to fetch albums' });
    }
});

// Get all tracks from an album
app.get('/spotify/albums/:albumId/tracks', async (req, res) => {
    const { albumId } = req.params;
    try {
        const tracks = await getTracksForAlbum(albumId, req.session.accessToken);
        res.json(tracks);
    } catch (error) {
        console.error('Error fetching tracks:', error.message);
        res.status(500).json({ error: 'Failed to fetch tracks' });
    }
});

// Get all tracks from all albums by an artist
app.get('/spotify/artists/:artistId/tracks', async (req, res) => {
    const { artistId } = req.params;
    const { include_groups } = req.query;
    try {
        const albums = await getAlbumsForArtist(
            artistId,
            include_groups,
            req.session.accessToken
        );

        let allTracks = [];
        for (const album of albums) {
            const tracks = await getTracksForAlbum(album.id, req.session.accessToken);
            allTracks.push(...tracks);
        }

        res.json(allTracks);
    } catch (error) {
        console.error('Error fetching artist songs:', error.message);
        res.status(500).json({ error: 'Failed to fetch artist songs' });
    }
});


app.get('/spotify/search', async (req, res) => {
    const url = 'https://api.spotify.com/v1/search';
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${req.session.accessToken}`,
                'Content-Type': 'application/json',
            },
            params: {
                q: req.query.name,
                type: req.query.type, // Searching for 'album', 'track', etc.
                limit: 3, // Limit the number of results
            },
        });

        const path = `data.${req.query.type}s.items`;
        const items = path.split('.').reduce((acc, key) => acc && acc[key], response);

        if (items) {
            res.json(items);
        } else {
            console.log('No items found.');
            return [];
        }
    } catch (error) {
        console.error('Error fetching data:', error.response?.data || error.message);
        throw error;
    }
});

app.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
});
