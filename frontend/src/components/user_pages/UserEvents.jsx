import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import UserSidebar from "./UserSidebar.jsx";
import CustomAppBar from "../CustomAppBar.jsx";
import EventService from "../../services/EventService.jsx";
import "../styles/FontStyle.css";

function UserEvents() {
    const [featuredEvents, setFeaturedEvents] = useState([]);

    return (
        <div className="home">
            <Box sx={{ display: "flex" }}>
                <UserSidebar />
                <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#F3F3F3", width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
                    <CustomAppBar title={"Events"} />
                    <Box sx={{ flexGrow: 1, padding: "25px", backgroundColor: "#F3F3F3" }}>
                        TEST
                    </Box>
                </Box>
            </Box>
        </div>
    );
}

export default UserEvents;