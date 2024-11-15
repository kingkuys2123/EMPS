import React from "react";
import { Typography, Box } from "@mui/material";

import UserSidebar from "./user_pages/UserSidebar.jsx";
import CustomAppBar from "./CustomAppBar.jsx";

import "./styles/FontStyle.css";

// Template ra ni siya
// Copy this component nya e paste sa organizer_pages if na assigned ka sa organizer side, e paste sa admin_pages folder if na assigned ka sa admin side
// E rename ang component into a name nga imong implement na page.
// CODE NA

function TemplatePage() {
    return (
        <div className="template-page">
            <Box sx={{ display: "flex", width: "100%" }}>

                {/*  change ni into either <UserSidebar>, <OrganizerSideBar> or <AdminSideBar>, e
                 change siya depende sa imong page if imong page kay admin, user or
                 organizer side siya */}
                <UserSidebar />

                <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#F3F3F3", width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>

                    {/* HEADER SA IMONG PAGE, CHANGE THE TITLE TO UR ASSIGNED PAGE'S TITLE */}
                    <CustomAppBar title={"Page Name"}/>

                    {/* BODY SA IMONG PAGE, INSIDE SA BOX, HERE KA MAG IMPLEMENT NA SA IMONG PAGE */}
                    <Box sx={{ flexGrow: 1, padding: "25px", backgroundColor: "#F3F3F3" }}>
                            <span>Page Body</span>
                    </Box>

                </Box>
            </Box>
        </div>
    );
}

export default TemplatePage;
