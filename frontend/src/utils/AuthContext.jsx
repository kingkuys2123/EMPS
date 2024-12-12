// src/utils/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(undefined);

export function getAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(() => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    });

    const [toggleOrganizer, setToggleOrganizer] = useState(() => {
        const storedToggle = localStorage.getItem('toggleOrganizer');
        return storedToggle ? JSON.parse(storedToggle) : false;
    });

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            setCurrentUser(parsedUser);
            if (parsedUser.accountType === "organizer") {
                const storedToggle = localStorage.getItem('toggleOrganizer');
                setToggleOrganizer(storedToggle ? JSON.parse(storedToggle) : true);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('toggleOrganizer', JSON.stringify(toggleOrganizer));
    }, [toggleOrganizer]);

    const value = { currentUser, setCurrentUser, toggleOrganizer, setToggleOrganizer };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}