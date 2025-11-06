import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const authContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [sessionLoading, setSessionLoading] = useState(true);

    // Check session status
    const checkSession = async () => {
        try {
            const res = await fetch('http://localhost:3000/auth/sessions', {
                credentials: 'include',
            });
            const data = await res.json();
            setLoggedIn(data.loggedIn);
            setSessionLoading(false);
            return data.loggedIn;
        } catch (error) {
            console.error("Error checking session:", error);
            setLoggedIn(false);
            setSessionLoading(false);
            return false;
        }
    };

    // Check session on mount
    useEffect(() => {
        checkSession();
    }, []);

    return (
        <authContext.Provider value={{ loggedIn, setLoggedIn, sessionLoading, checkSession }}>
            {children}
        </authContext.Provider>
    );
};

// Custom hook to access the context
export const useAuth = () => {
    return useContext(authContext);
};

