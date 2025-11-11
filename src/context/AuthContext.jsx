import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const authContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [sessionLoading, setSessionLoading] = useState(true);
    const [player, setPlayer] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [deviceId, setDeviceId] = useState(null);

    // Check session status
    const checkSession = async () => {
        try {
            const res = await fetch('http://localhost:3000/auth/sessions', {
                credentials: 'include',
            });
            const data = await res.json();
            setLoggedIn(data.loggedIn);
            setSessionLoading(false);
            if (data.accessToken) {
                setAccessToken(data.accessToken);
            }
            return data;
        } catch (error) {
            console.error("Error checking session:", error);
            setLoggedIn(false);
            setSessionLoading(false);
            return { loggedIn: false };
        }
    };

    // Initialize Spotify Web Player
    const initializePlayer = async (token) => {
        if (!token || player) return;

        // Load Spotify Web Playback SDK script
        if (!document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]')) {
            const script = document.createElement("script");
            script.src = "https://sdk.scdn.co/spotify-player.js";
            script.async = true;
            document.body.appendChild(script);
        }

        // Wait for SDK to be ready
        if (window.Spotify) {
            createPlayer(token);
        } else {
            window.onSpotifyWebPlaybackSDKReady = () => {
                createPlayer(token);
            };
        }
    };

    const createPlayer = (token) => {
        const spotifyPlayer = new window.Spotify.Player({
            name: 'Web Playback SDK',
            getOAuthToken: cb => { cb(token); },
            volume: 0.5
        });

        spotifyPlayer.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            setDeviceId(device_id);
        });

        spotifyPlayer.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });

        spotifyPlayer.connect();
        setPlayer(spotifyPlayer);
    };

    // Check session on mount and initialize player if logged in
    useEffect(() => {
        const initialize = async () => {
            const sessionData = await checkSession();
            if (sessionData.loggedIn && sessionData.accessToken) {
                await initializePlayer(sessionData.accessToken);
            }
        };
        initialize();
    }, []);

    return (
        <authContext.Provider value={{
            loggedIn,
            setLoggedIn,
            sessionLoading,
            checkSession,
            player,
            accessToken,
            deviceId
        }}>
            {children}
        </authContext.Provider>
    );
};

// Custom hook to access the context
export const useAuth = () => {
    return useContext(authContext);
};

