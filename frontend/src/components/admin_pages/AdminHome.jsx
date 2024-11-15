import React from "react";
import { Typography, Box } from "@mui/material";

import AdminSidebar from "./AdminSidebar.jsx"
import CustomAppBar from "../CustomAppBar.jsx";

import "../styles/FontStyle.css";


export default function AdminDashboard() {
    return (
        <div className="template-page">
            <Box sx={{ display: "flex", width: "100%" }}>

                <AdminSidebar />

                <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#F3F3F3", width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>

                    <CustomAppBar title={"Dashboard"}/>

                    <Box sx={{ flexGrow: 1, padding: "25px", backgroundColor: "#F3F3F3" }}>
                        <Typography variant="body1">
                            
                        </Typography>
                    </Box>

                </Box>
            </Box>
        </div>
    );
}
