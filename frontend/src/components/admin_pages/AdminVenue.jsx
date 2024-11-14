import React, { useState, useEffect } from "react";
import { Typography,Tabs, Tab, Table,TableHead, TableRow, TableCell,TableBody, Box   } from "@mui/material";
import { TabContext, TabPanel } from '@mui/lab';

import AdminSidebar from "../admin_pages/AdminSidebar.jsx";
import CustomAppBar from "../CustomAppBar.jsx";
import VenueService from '../../services/VenueService.jsx';

import ViewVenue from "../admin_pages/ViewVenue.jsx";
import "../styles/FontStyle.css";

function AdminVenue() {
    const [value, setValue] = React.useState('one');
    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
      };
    
  
    return (
        <div className="template-page">
            <Box sx={{ display: "flex" }}>
                <AdminSidebar />

                <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#F3F3F3", width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
                    <CustomAppBar title={"Venue"}/>
                    <Box sx={{ flexGrow: 1, padding: "25px", backgroundColor: "#F3F3F3" }}>
                        <Typography variant="body1" component="div">
                        <TabContext value={value}>
                            <Tabs value={value}
                                onChange={handleChangeTab}>
                                <Tab value="one"
                                    label="View Venue"
                                    wrapped>
                                </Tab>
                                <Tab value="two"
                                    label="Pending Booking Request"
                                    wrapped>
                                </Tab>
                            </Tabs>
                            <TabPanel value="one">
                            <ViewVenue />
                            </TabPanel>
                            <TabPanel value="two">Pending Bookings</TabPanel>
                        </TabContext>
                        </Typography>

                    </Box>

                </Box>
            </Box>
        </div>
    );
}

export default AdminVenue;
