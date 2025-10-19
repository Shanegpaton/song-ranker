const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const session = require("express-session");
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(session({
    secret: '74389yhrgiuebfdjknvcm,uhwfsivur',
    resave: false,
    httpOnly: true,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

app.post('/login', async (req, res) => {
    const code = req.body.code;
    const spotifyWebApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:5173',
        clientId: '61da338eac6f4bcd9642daeed0378eb4',
        clientSecret: 'dc0d1206385f4020977ad6f79b7fade3'
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

app.get('/get-albums', async (req, res) => {
    const { artistId, includeGroups } = req.query;
    let albums = [];
    let nextPage = `https://api.spotify.com/v1/artists/${artistId}/albums`;

    // Loop through the paginated albums
    while (nextPage) {
        const response = await axios.get(nextPage, {
            headers: {
                'Authorization': `Bearer ${await getAccessToken()}`,
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

app.get('/', (req, res) => {
    res.send("Hello World");
});
app.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
});