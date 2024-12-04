import React, {createContext, useContext, useEffect, useState} from "react";
import UserService from "../services/UserService.jsx";

const AuthContext = createContext();

export function getAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(() => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    });

    const [profilePicture, setProfilePicture] = useState(null);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setCurrentUser(JSON.parse(user));
        }

    }, []);

    useEffect(() => {
        const getProfilePicture = async () => {
            try {
                const blobUrl = await UserService.getProfilePicture("2_profile_picture.jpg");
                setProfilePicture(blobUrl);
            } catch (error) {
                console.error("Error fetching profile picture:", error);
            }
        };

        getProfilePicture();

        return () => {
            // Cleanup the blob URL when the component unmounts
            if (profilePicture) {
                URL.revokeObjectURL(profilePicture);
            }
        };
    }, []);

    const value = { currentUser, setCurrentUser, profilePicture, setProfilePicture };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
