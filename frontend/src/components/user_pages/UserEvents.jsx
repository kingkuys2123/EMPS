import React, { useEffect, useState } from "react";
import { Box, TextField, Button, InputAdornment, Card, CardContent, Typography, Grid } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import UserSidebar from "./UserSidebar.jsx";
import CustomAppBar from "../CustomAppBar.jsx";
import UserEventsFilterModal from "./UserEventsFilterModal.jsx";
import EventService from "../../services/EventService.jsx";
import "../styles/FontStyle.css";
import { useNavigate } from "react-router-dom";
import { getAuth } from "../../utils/AuthContext.jsx";
import { format, isToday } from 'date-fns';
import { Link } from "react-router-dom";

function UserEvents() {
    const nav = useNavigate();
    const { currentUser, toggleOrganizer } = getAuth();

    const [openFilterModal, setOpenFilterModal] = useState(false);
    const [filters, setFilters] = useState({ status: '', type: '' });
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 12;

    useEffect(() => {
        if(currentUser){
            if(currentUser.accountType === "organizer"){
                if(toggleOrganizer) {
                    nav('/organizer/dashboard');
                }
            }
            else if(currentUser.accountType === "admin"){
                nav("/admin/dashboard");
            }
        }
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await EventService.getAllByConfirmationStatusConfirmed();
                const eventsWithPhotos = await Promise.all(response.data.map(async (event) => {
                    if (event.coverPhoto) {
                        const coverPhotoResponse = await EventService.getCoverPhoto(event.coverPhoto);
                        event.coverPhotoUrl = URL.createObjectURL(coverPhotoResponse.data);
                    }
                    return event;
                }));
                setEvents(eventsWithPhotos);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, []);

    const handleFilterClick = () => {
        setOpenFilterModal(true);
    };

    const handleFilterClose = () => {
        setOpenFilterModal(false);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset to page 1 upon typing
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filters.status ? event.eventStatus.toLowerCase() === filters.status.toLowerCase() : true;
        const matchesType = filters.type ? event.type.toLowerCase() === filters.type.toLowerCase() : true;
        return matchesSearch && matchesStatus && matchesType;
    });

    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

    const getFilterStatusText = () => {
        const statusText = filters.status ? `Status = ${filters.status}` : '';
        const typeText = filters.type ? `Type = ${filters.type}` : '';
        const filterText = [statusText, typeText].filter(Boolean).join(', ');
        return filterText ? `Filtered by: ${filterText}` : 'No filters applied';
    };

    return (
        <div className="home">
            <Box sx={{ display: "flex", height: "100vh" }}>
                <UserSidebar />
                <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#F3F3F3", display: "flex", flexDirection: "column" }}>
                    <CustomAppBar title={"Events"} />
                    <Box sx={{ flexGrow: 1, padding: "25px", backgroundColor: "#F3F3F3", overflow: "auto" }}>
                        <Box sx={{ backgroundColor: "white", height: "100%", display: "flex", flexDirection: "column" }}>
                            <Box sx={{ backgroundColor: "#F3F3F3", display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "15px" }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <TextField
                                        variant="outlined"
                                        placeholder="Search..."
                                        size="small"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        sx={{ marginRight: "8px" }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <Button variant="contained" color="primary" sx={{ marginLeft: "8px", backgroundColor: "#C63f47", borderRadius: 0 }}>
                                        Search
                                    </Button>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <Typography variant="body2" sx={{ padding: "10px", color: "gray" }}>
                                        {getFilterStatusText()}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<FilterListIcon />}
                                        onClick={handleFilterClick}
                                        sx={{ backgroundColor: "#C63f47", borderRadius: 0, marginLeft: "8px" }}
                                    >
                                        Filter
                                    </Button>
                                </Box>
                            </Box>
                            <Grid container spacing={2} sx={{ padding: "0px 10px 10px 10px", marginTop: "10px", overflow: "auto", flexGrow: 1 }}>
                                {currentEvents.map(event => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={event.eventId}>
                                        <Card sx={{ display: "flex", flexDirection: "column" }}>
                                            <Box sx={{flexShrink: 0, width: "100%", height: "auto"}}>
                                                <img
                                                    src={event.coverPhotoUrl || "/assets/placeholders/1280x720-image-placeholder.png"}
                                                    alt="Event"
                                                    style={{width: "100%", height: "250px", objectFit: "cover"}}
                                                />
                                            </Box>
                                            <CardContent sx={{flexGrow: 1, padding: 2}}>
                                                <Box sx={{height: "125px", display: "flex", flexDirection: "column" }}>
                                                    <Typography
                                                        sx={{ paddingBottom: "5px", textTransform: "uppercase", color: "text.secondary", fontSize: "12px", whiteSpace: "normal" }}
                                                    >
                                                        {isToday(new Date(event.startDatetime))
                                                            ? `Today | ${format(new Date(event.startDatetime), 'p')}`
                                                            : `${format(new Date(event.startDatetime), 'EEE, MMM 1, yyyy | p')}`}
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: "bold", whiteSpace: "normal" }}>
                                                        {event.name}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ fontSize: "12px", whiteSpace: "normal" }}>
                                                        {event.description.length > 30
                                                            ? `${event.description.substring(0, event.description[49] === ' ' ? 49 : 50)}...`
                                                            : event.description}
                                                    </Typography>

                                                    <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", flexGrow: 1 }}>
                                                        <Typography variant="body2" sx={{ cursor: "pointer", color: "gray" }}>
                                                            <Link to={`/events/view/${event.eventId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                                More Details
                                                            </Link>
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                            <Box sx={{ display: "flex", justifyContent: "center", padding: "20px", marginTop: "auto" }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    sx={{ marginRight: "10px", backgroundColor: "#C63f47", borderRadius: 0 }}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={indexOfLastEvent >= filteredEvents.length}
                                    sx={{ backgroundColor: "#C63f47", borderRadius: 0 }}
                                >
                                    Next
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <UserEventsFilterModal
                open={openFilterModal}
                onClose={handleFilterClose}
                filters={filters}
                setFilters={setFilters}
            />
        </div>
    );
}

export default UserEvents;