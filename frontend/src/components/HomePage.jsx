import React from "react";
import {Box} from "@mui/material";
import "./styles/FontStyle.css";
import UserSideBar from "./UserSideBar.jsx";
import PageAppBar from "./PageAppBar.jsx";

function HomePage() {
    return (
        <div className="home">
            <Box sx={{ display: "flex" }}>

                <UserSideBar />

                <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#F3F3F3", width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>

                    <PageAppBar title={"Home"}/>

                    <Box sx={{ flexGrow: 1, padding: "25px" }}>
                        <Box>
                            TEST NI
                        </Box>
                    </Box>

                </Box>
            </Box>
        </div>
    );
}

export default HomePage;
