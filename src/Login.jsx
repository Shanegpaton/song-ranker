import React, { useEffect, useState } from "react"
import { Container, Spinner, Alert } from "react-bootstrap"
import axios from "axios"
import { useAuth } from "./context/AuthContext"

const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=61da338eac6f4bcd9642daeed0378eb4&response_type=code&redirect_uri=http://localhost:5173&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { loggedIn, setLoggedIn, sessionLoading } = useAuth();

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get("code");
        if (code) {
            setLoading(true);
            axios.post("http://localhost:3000/auth/sessions", { code }, { withCredentials: true })
                .then(res => {
                    setLoggedIn(true);
                    setLoading(false);
                    window.history.replaceState({}, document.title, "/");
                })
                .catch(() => {
                    setError("Failed to log in with Spotify. Try again.");
                    setLoading(false);
                });
        }
    }, [setLoggedIn]);

    if (loading || sessionLoading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <Spinner animation="border" variant="success" />
            </Container>
        );
    }

    if (loggedIn) {
        return (
            null
        );
    }

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "75vh",
            }}
        >
            <a
                href={AUTH_URL}
                style={{
                    backgroundColor: "hsl(141, 73%, 42%)",
                    color: "black",
                    fontSize: "2rem",
                    padding: "1.5rem 3rem",
                    textDecoration: "none",
                    borderRadius: "8px",
                    fontWeight: "bold",
                }}
            >
                Login With Spotify
            </a>
        </div>
    )
}