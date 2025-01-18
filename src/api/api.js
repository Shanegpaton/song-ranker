import axios from 'axios';
import { Buffer } from 'buffer';

const client_id = '61da338eac6f4bcd9642daeed0378eb4';
const client_secret = 'dc0d1206385f4020977ad6f79b7fade3';

// Function to get an access token
async function getAccessToken() {
    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', null, {
        headers: {
            'Authorization': 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        params: {
            grant_type: 'client_credentials',
        },
    });

    return tokenResponse.data.access_token;
}

// Function to search for an artist
async function searchArtist(accessToken, artistName) {
    const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
        params: {
            q: artistName,
            type: 'artist',
            limit: 1, // Limit the results to 1
        },
    });

    if (response.data.artists.items.length === 0) {
        throw new Error('Artist not found');
    }

    return response.data.artists.items[0]; // Return the first artist found
}

// Function to get all albums by an artist (only albums, not playlists or singles)
async function getAllAlbums(accessToken, artistId, includeGroups) {
    let albums = [];
    let nextPage = `https://api.spotify.com/v1/artists/${artistId}/albums`;

    // Loop through the paginated albums
    while (nextPage) {
        const response = await axios.get(nextPage, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
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
    return albums; // Return all albums
}

// Function to get all tracks from an album
async function getTracksFromAlbum(accessToken, albumId) {
    let tracks = [];
    let nextPage = `https://api.spotify.com/v1/albums/${albumId}/tracks`;

    // Loop through the paginated tracks
    while (nextPage) {
        const response = await axios.get(nextPage, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            params: {
                limit: 50, // Number of tracks per request
            },
        });

        tracks = tracks.concat(response.data.items); // Concatenate tracks into the array
        nextPage = response.data.next; // Get the next page URL for pagination
    }

    return tracks; // Return all tracks
}

// Main function to combine everything and get all artist songs
export async function findArtistAndSongs(artistName, includeGroups) {
    try {
        const accessToken = await getAccessToken();
        const artist = await searchArtist(accessToken, artistName);
        console.log(`Found Artist: ${artist.name} (ID: ${artist.id})`);

        const albums = await getAllAlbums(accessToken, artist.id, includeGroups);
        let allTracks = [];

        // Iterate through each album and fetch tracks
        for (const album of albums) {
            console.log(`Fetching tracks for album: ${album.name}`);
            const tracks = await getTracksFromAlbum(accessToken, album.id);
            allTracks = allTracks.concat(tracks); // Concatenate tracks into the array
        }

        // Print all songs
        console.log(`All Songs for ${artist.name}:`);
        allTracks.forEach((track, index) => {
            console.log(`${index + 1}. ${track.name}`);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}



export async function searchItem(type, name) {
    const url = 'https://api.spotify.com/v1/search';
    const token = await getAccessToken();
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            params: {
                q: name,
                type: type, // Searching for 'album', 'track', etc.
                limit: 3, // Limit the number of results
            },
        });

        const path = `data.${type}s.items`;
        const items = path.split('.').reduce((acc, key) => acc && acc[key], response);

        if (items) {
            console.log(items); // Log the result to check
            return items;
        } else {
            console.log('No items found.');
            return [];
        }
    } catch (error) {
        console.error('Error fetching data:', error.response?.data || error.message);
        throw error;
    }
}
