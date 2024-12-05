import React, { useState, useEffect } from "react";
import { Typography, Box, Button} from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import Grid from '@mui/material/Grid2';
import AdminSidebar from "./AdminSidebar.jsx"
import CustomAppBar from "../CustomAppBar.jsx";
import './styles/Dashboard.css';
import "../styles/FontStyle.css";
import OrganizerService from "../../services/OrganizerService.jsx";



export default function AdminDashboard() {
    const [topOrganizers, setTopOrganizers] = useState([]);
    const [pendingEvents, setPendingEvents] = useState([
        { name: 'Event A', date: '2024-12-10', organizer: 'John Doe' },
        { name: 'Event B', date: '2024-12-12', organizer: 'Jane Smith' }
    ]);
    const [badFeedback, setBadFeedback] = useState([
        { name: 'John Doe', rating: 0, comment: 'Needs improvement.' },
        { name: 'Jane Smith', rating: 1, comment: 'Very disappointing experience.' }
    ]);
    const formatter = (data) => data?.map(datum => ({
        ...datum,
        averageTicketsSold: datum?.events?.reduce((sum, event) => sum + event.attendees, 0) / datum?.events?.length / 100,
        
    }));

    const valueFormatter = (value) => {
        if (value === null || value === undefined) return '-';

        if (value <= 5) return value.toFixed(1);

        return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
    };

    useEffect(() => {
        OrganizerService.getTopOrganizers()
            .then(data => setTopOrganizers(formatter(data)))
            .catch(error => console.error("Error fetching top organizers:", error));
    }, []);

    const chartSetting = {
        yAxis: [
            {
              label: 'Value',  
            },
          ],
          width: 1450,         
          height: 700,       
          sx: {
            [`.${axisClasses.left} .${axisClasses.label}`]: {
              transform: 'translate(-20px, 0)',
            },
          },
          layout: {
            paddingLeft: 50,  
            paddingRight: 50
          }
        };

     const handleConfirmEvent = (eventName) => {
       
        console.log(`Event Confirmed: ${eventName}`);
    };

    const handleFeedbackClick = (feedbackName) => {
       
        console.log(`Feedback clicked for: ${feedbackName}`);
    };

      

    return (
        <div className="template-page">
            <Box sx={{ display: "flex", width: "100%" }}>

                <AdminSidebar />

                <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#F3F3F3", width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>

                    <CustomAppBar title={"Dashboard"}/>

                    <Box sx={{ flexGrow: 1, padding: "25px", backgroundColor: "#F3F3F3" }}>
                        <Typography component="div" variant="body1">
                            <Grid container spacing={2} className="cont1">
                                <Grid  className="inside">
                                    
                                        <span>Top Organizers</span>
                                        <BarChart
                                        className="chart"
                                        dataset={topOrganizers} 
                                        xAxis={[{ 
                                            scaleType: 'band', 
                                            dataKey: 'organizerName', 
                                            categoryGapRatio: 0.3,                                            barGapRatio: 0.1
                                        }]}
                                        series={[
                                            { dataKey: 'eventCount', label: 'Events', valueFormatter },
                                            { dataKey: 'averageTicketsSold', label: 'Sales', valueFormatter },
                                            { dataKey: 'rating', label: 'Rating', valueFormatter }, 
                                        ]}
                                        {...chartSetting}
                                        legend={{ hidden: false }}  
                                        />
                                </Grid>
                                <Grid  className="inside">
                                   
                                        <span>Pending Event Upcoming</span>
                                        <ul>
                                        {pendingEvents.map((event, index) => (
                                            <li key={index} className="pending-event" onClick={() => handleConfirmEvent(event.name)} style={{ cursor: "pointer"}} >
                                                {event.name} - {event.date} (Organized by {event.organizer})
                                            </li>
                                        ))}
                                    </ul>
                                </Grid>
                            </Grid>
                            <Grid container space={2} className="cont2">
                                <Grid  className="inside">
                                <span>Bad Feedback</span>
                                <ul>
                                        {badFeedback.map((feedback, index) => (
                                            <li key={index} className="bad-feedback" style={{ cursor: "pointer", color: "red" }} onClick={() => handleFeedbackClick(feedback.name)}>
                                                {feedback.name} - Rating: {feedback.rating} - {feedback.comment}
                                            </li>
                                        ))}
                                    </ul>
                                </Grid>
                            </Grid>
                        </Typography>
                    </Box>

                </Box>
            </Box>
        </div>
    );
}
