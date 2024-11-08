import React from "react";
import { Box } from "@mui/material";

import UserSidebar from "./UserSidebar.jsx";
import CustomAppBar from "../CustomAppBar.jsx";

import "../styles/FontStyle.css";

function UserHome() {
    return (
        <div className="home">
            <Box sx={{ display: "flex" }}>

                <UserSidebar />

                <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#F3F3F3", width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>

                    <CustomAppBar title={"Home"}/>

                    <Box sx={{ flexGrow: 1, padding: "25px", backgroundColor: "#F3F3F3" }}>
                        <Box>
                            TEST NI
                        </Box>
                    </Box>

                </Box>
            </Box>
        </div>
    );
}

export default UserHome;
