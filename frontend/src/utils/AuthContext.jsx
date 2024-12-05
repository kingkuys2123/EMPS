import React, { createContext, useContext, useEffect, useState } from "react";
import UserService from "../services/UserService.jsx";

const AuthContext = createContext(undefined);

export function getAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(() => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    });

    const [profilePicture, setProfilePicture] = useState(() => {
        return localStorage.getItem('profilePicture') || null;
    });

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setCurrentUser(JSON.parse(user));
        }
    }, []);

    useEffect(() => {
        getProfilePicture().then(r => r);
    }, [currentUser]);

    const getProfilePicture = async () => {
        if (currentUser && currentUser.profilePicture) {
            try {
                const blobUrl = await UserService.getProfilePicture(currentUser.profilePicture);
                setProfilePicture(blobUrl);
                localStorage.setItem('profilePicture', blobUrl); // Save to local storage
            } catch (error) {
                console.error("Error fetching profile picture:", error);
            }
        }
    };

    const displayPicture = profilePicture ?? '/assets/placeholders/avatar-photo-placeholder.png';

    const value = { currentUser, setCurrentUser, profilePicture, setProfilePicture, displayPicture };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}