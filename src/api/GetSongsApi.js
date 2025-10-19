import axios from 'axios';
import { Buffer } from 'buffer';

const client_id = '61da338eac6f4bcd9642daeed0378eb4';
const client_secret = 'dc0d1206385f4020977ad6f79b7fade3';



// Function to get an access token
// async function getAccessToken() {
//     const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', null, {
//         headers: {
//             'Authorization': 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
//             'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         params: {
//             grant_type: 'client_credentials',
//         },
//     });

//     return tokenResponse.data.access_token;
// }

// Function to get all albums by an artist (only albums, not playlists or singles)
// async function getAllAlbums(artistId, includeGroups) {
//     let albums = [];
//     let nextPage = `https://api.spotify.com/v1/artists/${artistId}/albums`;

//     // Loop through the paginated albums
//     while (nextPage) {
//         const response = await axios.get(nextPage, {
//             headers: {
//                 'Authorization': `Bearer ${await getAccessToken()}`,
//             },
//             params: {
//                 market: 'US', // Specify the market (e.g., US)
//                 limit: 50, // Number of albums per request
//                 include_groups: includeGroups, // Filter to get only albums
//             },
//         });

//         albums = albums.concat(response.data.items); // Concatenate albums into the array
//         nextPage = response.data.next; // Get the next page URL for pagination
//     }
//     return albums; // Return all albums
// }


// Function to get all tracks from an album and include album properties in each track
// export async function getTracksFromAlbum(album) {
//     let tracks = [];
//     let nextPage = `https://api.spotify.com/v1/albums/${album.id}/tracks`;

//     // Loop through the paginated tracks
//     while (nextPage) {
//         const response = await axios.get(nextPage, {
//             headers: {
//                 'Authorization': `Bearer ${await getAccessToken()}`,
//             },
//             params: {
//                 limit: 50, // Number of tracks per request
//             },
//         });

//         // Loop through the tracks and add album properties to each track

//         if (album) {
//             response.data.items.forEach(track => {
//                 track.album = album; // Add album properties to the track
//             });
//         }

//         tracks = tracks.concat(response.data.items); // Concatenate tracks into the array
//         nextPage = response.data.next; // Get the next page URL for pagination
//     }

//     return tracks; // Return all tracks with album properties included
// }


// Main function to combine everything and get all artist 2s
export async function findArtistAndSongs(artistId, includeGroups) {
    try {
        const albums = await getAllAlbums(artistId, includeGroups);
        let allTracks = [];

        // Iterate through each album and fetch tracks
        for (const album of albums) {
            const tracks = await getTracksFromAlbum(album);
            allTracks = allTracks.concat(tracks); // Concatenate tracks into the array
        }
        return (allTracks);
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