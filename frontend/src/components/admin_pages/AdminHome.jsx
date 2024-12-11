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

    // const valueFormatter = (value) => {
    //     if (value === null || value === undefined) return '-';

    //     if (value <= 5) return value.toFixed(1);

    //     return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
    // };

    useEffect(() => {
        // Fetch and process the organizers data
        const fetchOrganizers = async () => {
          try {
            const organizers = await OrganizerService.getAllOrganizers();
    
            // Calculate the total ticket quantity and other metrics
            const formattedOrganizers = organizers.map(organizer => {
                const events = organizer.events || []; // Fallback to an empty array if events is undefined
                const totalQuantity = events.reduce((sum, event) => sum + (event.ticket?.quantity || 0), 0); // Safe chaining and default
                const eventCount = events.length;
          
                const totalRating = events.reduce((ratingSum, event) => {
                  const feedbacks = event.feedbacks || []; // Fallback to an empty array if feedbacks is undefined
                  const eventRatings = feedbacks.map(feedback => feedback.rating || 0); // Default rating to 0 if undefined
                  const averageEventRating = eventRatings.length > 0 
                    ? eventRatings.reduce((a, b) => a + b, 0) / eventRatings.length 
                    : 0;
                  return ratingSum + averageEventRating;
                }, 0);

              return {
                organizerName: organizer.user.username,
                eventCount: eventCount,
                averageTicketsSold: totalQuantity,
                rating: totalRating/ eventCount,
              };
            });
    
            // Sort organizers by total ticket quantity in descending order and get top 5
            const sortedOrganizers = formattedOrganizers.sort((a, b) => b.averageTicketsSold - a.averageTicketsSold);
            const top5 = sortedOrganizers.slice(0, 5);
    
            setTopOrganizers(top5);
          } catch (error) {
            console.error('Error fetching organizers:', error);
          }
        };
        fetchOrganizers();
    }, []);

    const calculatedHeight = topOrganizers.length *150; // Example logic for height based on items
    const safeHeight = isNaN(calculatedHeight) ? 0 : calculatedHeight;
    const styles = { height: `${safeHeight}px` };

    const chartSetting = {
        yAxis: [
            {
              label: 'Value',  
            },
          ],
          width: 1450,         
          height: calculatedHeight,       
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
                                            categoryGapRatio: 0.3,                                           
                                            barGapRatio: 0.1
                                        }]}
                                        series={[
                                            { dataKey: 'eventCount', label: 'Events',  },
                                            { dataKey: 'averageTicketsSold', label: 'Sales',  },
                                            { dataKey: 'rating', label: 'Rating',  }, 
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
