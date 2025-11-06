const axios = require('axios');

async function getAlbumsForArtist(artistId, includeGroups, accessToken) {
    let albums = [];
    let nextPage = `https://api.spotify.com/v1/artists/${artistId}/albums`;

    while (nextPage) {
        const response = await axios.get(nextPage, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
                market: 'US',
                limit: 50,
                include_groups: includeGroups,
            },
        });
        albums.push(...response.data.items);
        nextPage = response.data.next;
    }

    return albums;
}

async function getTracksForAlbum(albumId, accessToken) {
    let tracks = [];
    let nextPage = `https://api.spotify.com/v1/albums/${albumId}/tracks`;

    while (nextPage) {
        const response = await axios.get(nextPage, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { limit: 50 },
        });
        tracks.push(...response.data.items);
        nextPage = response.data.next;
    }

    return tracks;
}

module.exports = { getAlbumsForArtist, getTracksForAlbum };