import React from "react";
import { Typography, Box } from "@mui/material";
import "./styles/FontStyle.css";
import UserSideBar from "./UserSideBar.jsx";
import PageAppBar from "./PageAppBar.jsx";

function TemplatePage() {
    return (
        <div className="template-page">
            <Box sx={{ display: "flex" }}>

                {/*  ilisa ni into either <UserSideBar>, <OrganizerSideBar> or <AdminSideBar>   */}
                <UserSideBar />

                <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#F3F3F3", width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>

                    {/* HEADER SA IMONG PAGE */}
                    <PageAppBar title={"Page Name"}/>

                    {/* BODY SA IMONG PAGE, INSIDE SA BOX */}
                    <Box sx={{ flexGrow: 1, padding: "25px", backgroundColor: "#F3F3F3" }}>
                        <Typography variant="body1">
                            <span>Template Page Body</span>
                        </Typography>
                    </Box>

                </Box>
            </Box>
        </div>
    );
}

export default TemplatePage;
