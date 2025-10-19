const SpotifyWebApi = require("spotify-web-api-node");

const spotifyAuth = async (req, res, next) => {
    if (!req.session.accessToken || !req.session.refreshToken) {
        return res.status(401).json({ error: "User not authenticated with Spotify" });
    }
    const spotifyApi = new SpotifyWebApi({
        clientId: process.env.client_id,
        clientSecret: process.env.client_secret,
    });
    spotifyApi.setAccessToken(req.session.accessToken);
    spotifyApi.setRefreshToken(req.session.refreshToken);
    try {
        await spotifyApi.getMe();
        req.spotifyApi = spotifyApi;
        next();
    } catch (err) {
        // If expired, refresh it
        if (err.statusCode === 401) {
            try {
                const data = await spotifyApi.refreshAccessToken();
                req.session.accessToken = data.body.access_token;
                spotifyApi.setAccessToken(data.body.access_token);
                console.log("Spotify access token refreshed!");
                req.spotifyApi = spotifyApi;
                next();
            } catch (refreshError) {
                console.error("Failed to refresh token:", refreshError);
                return res.status(401).json({ error: "Spotify token expired, please log in again" });
            }
        } else {
            console.error("Spotify API error:", err);
            return res.status(500).json({ error: "Spotify authentication failed" });
        }
    }
};
module.exports = spotifyAuth;
