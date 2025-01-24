// import express from 'express';
// import bodyParser from 'body-parser';
// import querystring from 'querystring';
// import fetch from 'node-fetch';

// const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));

// const client_id = '61da338eac6f4bcd9642daeed0378eb4'; // Replace with your Spotify client ID
// const client_secret = 'dc0d1206385f4020977ad6f79b7fade3'; // Replace with your Spotify client secret
// const redirect_uri = 'http://localhost:3001/callback'; // Replace with your redirect URI

// app.get('/callback', function (req, res) {
//     const code = req.query.code || null;
//     const state = req.query.state || null;

//     if (state === null) {
//         res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
//     } else {
//         const authOptions = {
//             url: 'https://accounts.spotify.com/api/token',
//             form: {
//                 code: code,
//                 redirect_uri: redirect_uri,
//                 grant_type: 'authorization_code',
//             },
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//                 Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
//             },
//             json: true,
//         };

//         fetch(authOptions.url, {
//             method: 'POST',
//             headers: authOptions.headers,
//             body: new URLSearchParams(authOptions.form),
//         })
//             .then(response => response.json())
//             .then(data => {
//                 if (data.error) {
//                     res.redirect('/#' + querystring.stringify({ error: data.error }));
//                 } else {
//                     res.send(`Access Token: ${data.access_token}`);
//                 }
//             })
//             .catch(err => {
//                 console.error(err);
//                 res.status(500).send('Error retrieving token');
//             });
//     }
// });

// app.listen(3001, () => {
//     console.log('Server is running on http://localhost:3001');
// });


