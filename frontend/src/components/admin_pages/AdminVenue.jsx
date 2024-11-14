import React, { useState, useEffect } from "react";
import { Typography,Tabs, Tab, Table,TableHead, TableRow, TableCell,TableBody, Box   } from "@mui/material";
import { TabContext, TabPanel } from '@mui/lab';

import AdminSidebar from "../admin_pages/AdminSidebar.jsx";
import CustomAppBar from "../CustomAppBar.jsx";
import VenueService from '../../services/VenueService.jsx';
import './styles/venue.css';
import ViewVenue from "../admin_pages/ViewVenue.jsx";


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
                                onChange={handleChangeTab}
                                >
                                <Tab value="one"
                                    label="View Venue"
                                    wrapped
                                    sx={{
                                        backgroundColor: value === "one" ? "#fff" : "#f4f4f4",
                                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", 
                                        borderTopLeftRadius: "10px", 
                                        borderTopRightRadius: "10px",
                                    }}>
                                </Tab>
                                <Tab value="two"
                                    label="Pending Booking Request"
                                    wrapped
                                   sx={{
                                    backgroundColor: value === "two" ? "#fff" : "#f4f4f4", 
                                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", 
                                    borderTopLeftRadius: "10px", 
                                    borderTopRightRadius: "10px",
                                }}>
                                </Tab>
                            </Tabs>
                            <TabPanel value="one" sx={{
                                backgroundColor: "#fff", 
                                borderRadius: "15px",     
                                padding: "20px",          
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                borderTopLeftRadius: "0px",  
                            }}>
                            <ViewVenue />
                            </TabPanel>
                            <TabPanel value="two" sx={{
                                backgroundColor: "#fff", 
                                borderRadius: "15px",     
                                padding: "20px",          
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                borderTopLeftRadius: "0px",  
                            }}>
                                Pending Bookings
                            </TabPanel>
                        </TabContext>
                        </Typography>

                    </Box>

                </Box>
            </Box>
        </div>
    );
}

export default AdminVenue;
