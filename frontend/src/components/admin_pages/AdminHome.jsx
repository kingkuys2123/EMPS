import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Button} from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import Grid from '@mui/material/Grid2';
import AdminSidebar from "./AdminSidebar.jsx"
import CustomAppBar from "../CustomAppBar.jsx";
import './styles/Dashboard.css';
import "../styles/FontStyle.css";
import OrganizerService from "../../services/OrganizerService.jsx";
import FeedbackServices from "../../services/FeedbackServices";
import EventService from "../../services/EventService.jsx";


export default function AdminDashboard() {
    const [topOrganizers, setTopOrganizers] = useState([]);
    const [badFeedback, setBadFeedback] = useState([]);
    const [pendingEvent, setPendingEvents] = useState([]);

    const formatter = (data) => data?.map(datum => ({
        ...datum,
        averageTicketsSold: datum?.events?.reduce((sum, event) => sum + event.attendees, 0) / datum?.events?.length / 100,
        
    }));

    useEffect(() => {
        const fetchBadFeedback = async () => {
          try {
            const feedbackData = await FeedbackServices.getBadFeedback();
            
              setBadFeedback(feedbackData); 
            } catch (error) {
              console.error("Error fetching bad feedback:", error);
            }
          };
        
          fetchBadFeedback();
      }, []);

      useEffect(() => {
        const fetchPendingEvent= async () => {
          try {
            const pendingEvent = await EventService.getPendingEvent();
            
              setPendingEvents(pendingEvent); 
            } catch (error) {
              console.error("Error fetching pending events:", error);
            }
          };
        
          fetchPendingEvent();
      }, []);
    

    const navigate = useNavigate();

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
       
        navigate(`/admin/organizers?tab=3`);
    };

    const handleFeedbackClick = (eventId) => {
        navigate(`/organizer/my_events/${eventId}?tab=3`);
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
                                        {pendingEvent.length > 0 ? (
                                        pendingEvent.map((event, index) => (
                                            <li key={index} className="pending-event" onClick={() => handleConfirmEvent(event.name)} style={{ cursor: "pointer"}} >
                                                {event.name} - {event.date} (Organized by {event.organizer.user.username})
                                            </li>
                                        ))) : (
                                            <li>No bad Pending event.</li>
                                            )}
                                        
                                    </ul>
                                </Grid>
                            </Grid>
                            <Grid container space={2} className="cont2">
                                <Grid  className="inside">
                                <span>Bad Feedback</span>
                                    <ul>
                                        {badFeedback.length > 0 ? (
                                        badFeedback.map((feedback, index) => (
                                            <li
                                            key={index}
                                            className="bad-feedback"
                                            style={{ cursor: "pointer", color: "red" }}
                                            onClick={() => handleFeedbackClick(feedback.event.eventId)}
                                            >
                                            {feedback.event.name} - Rating: {feedback.rating} - " {feedback.comment} "
                                            </li>
                                        ))
                                        ) : (
                                        <li>No bad feedback available.</li>
                                        )}
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
