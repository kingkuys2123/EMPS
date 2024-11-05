import { useState, useEffect } from "react";
import FeedbackService from "../services/FeedbackServices";
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Button from '@mui/material/Button';
import FeedbackModal from "./FeedbackModal";

export default function Feedback() {
    const [feedbackList, setFeedbackList] = useState([]);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const response = await FeedbackService.getAllFeedback();
            setFeedbackList(response.data);
        } catch (error) {
            setError('Failed to fetch feedbacks.');
        }
    };

    const handleAddFeedback = () => {
        setSelectedFeedback(null); 
        setIsModalOpen(true); 
    };

    const handleMenuOpen = (event, feedback) => {
        console.log('Feedback:',feedback);
        setAnchorEl(event.currentTarget);
        setSelectedFeedback(feedback);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedFeedback(null);
    };

    const handleEdit = async (updatedFeedback) => {
        try {
            if (selectedFeedback) {
                await FeedbackService.updateFeedback(selectedFeedback.feedback_id, {
                    comment: updatedFeedback.comment,
                    rating: updatedFeedback.rating,
                    datetime_created: selectedFeedback.datetime_created,
                });
                console.log("Edit Successfully");
                fetchFeedbacks(); 
            }
        } catch (error) {
            console.error("Error updating feedback:", error);
        } finally {
            setIsModalOpen(false); 
            handleMenuClose();
        }
    };

    const handleDelete = async () => {
        try {
            await FeedbackService.deleteFeedback(selectedFeedback.feedback_id);
            console.log('Delete Successfully!');
            setFeedbackList(feedbackList.filter(item => item.feedback_id !== selectedFeedback.feedback_id));
        } catch (error) {
            console.error('Error deleting feedback:', error);
        } finally {
            handleMenuClose();
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedFeedback(null);
    };

    const handleModalSubmit = async (newFeedback) => {
        if (selectedFeedback) {
            await handleEdit(newFeedback);
        } else {
            try {
                const feedbackToCreate = {
                    ...newFeedback,
                    datetime_created: new Date().toISOString(), 
                                };
                await FeedbackService.createFeedback(feedbackToCreate);
                fetchFeedbacks(); 
            } catch (error) {
                console.error("Error adding feedback:", error);
            }
        }
        setIsModalOpen(false);
    };

    return (
        <div id="wrapper">
            {error ? (
                <Typography variant="body1" sx={{ textAlign: 'center', mt: 2, color: 'red' }}>
                    {error}
                </Typography>
            ) : feedbackList.length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
                    No feedbacks available.
                </Typography>
            ) : (
                <List sx={{ width: '100%', maxWidth: '100vw', height: '370px', bgcolor: 'background.paper', padding: '20px', overflowY: 'auto', overflowX: 'hidden' }}>
                    {feedbackList.map((item, index) => (
                        <React.Fragment key={item.feedback_id}>
                            <ListItem alignItems="flex-start" secondaryAction={
                                <div>
                                    <IconButton edge="end" onClick={(event) => handleMenuOpen(event, item)}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl && selectedFeedback?.feedback_id === item.feedback_id)}
                                        onClose={handleMenuClose}
                                    >
                                        <MenuItem onClick={() => setIsModalOpen(true)}>Edit</MenuItem>
                                        <MenuItem onClick={handleDelete}>Delete</MenuItem>
                                    </Menu>
                                </div>
                            }>
                                <ListItemAvatar>
                                    <Avatar alt={item.user || "Anonymous"} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={item.user || "Anonymous"}
                                    primaryTypographyProps={{ sx: { fontSize: '1.5rem', fontWeight: 'bold', color: '#000000' } }}
                                    secondary={
                                        <Box>
                                            <Rating name="rating" value={item.rating} readOnly size="large" />
                                            <Typography component="span" variant="body2" sx={{ color: 'text.primary', display: 'block', fontSize: '1.4em' }}>
                                                {item.comment}
                                            </Typography>
                                            <Typography component="span" variant="body2" sx={{ color: '#736565', display: 'block' }}>
                                                {item.datetime_created}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>
                            {index < feedbackList.length - 1 && <Divider variant="inset" component="li" />}
                        </React.Fragment>
                    ))}
                </List>
            )}
            <FeedbackModal
                open={isModalOpen}
                feedback={selectedFeedback}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit} 
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddFeedback}
                sx={{ mb: 2, backgroundColor: '#C63F47' }}
            >
                Add Feedback
            </Button>
        </div>
    );
}
