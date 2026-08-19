# Spotify Song Ranker

This is a React web app that lets users search for songs using the Spotify API, add them to a list, and rank them with a drag-and-drop interface.

## Features

- Search for tracks and artists via the Spotify API
- Add songs to a custom list
- Rank songs by dragging and reordering
- View album art and track info
- Highlights the first-added song as a fixed reference point

## Tech Stack

- React + Vite
- Express callback server
- Spotify Web API
- React context/hooks
- CSS modules

## Demo

https://github.com/user-attachments/assets/5c0b1538-f32f-4e13-affd-788188225437

## Running Locally

Spotify requires each developer to register their own application and redirect URI.

```bash
npm install
cd server
npm install
cp .env.example .env
```

Configure the server environment:

```bash
CLIENT_ID=your_spotify_client_id
CLIENT_SECRET=your_spotify_client_secret
REDIRECT_URI=http://localhost:3000/callback
SESSION_SECRET=replace-with-a-local-development-secret
```

Then start the backend and frontend in separate terminals.

```bash
cd server && npm start
npm run dev
```

## Current Scope

This is a focused UI/API project for ranking tracks. It does not include shared accounts, persistence across devices, or public playlist publishing yet.
