import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, Divider, Rating, TextField } from '@mui/material';

import '../styles/FontStyle.css';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

export default function UserAddFeedbackModal({ open, feedback, onClose, onSubmit }) {
    const [ratingValue, setRatingValue] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (feedback) {
            setRatingValue(feedback.rating || 0);
            setComment(feedback.comment || '');
        } else {
            setRatingValue(0);
            setComment('');
        }
    }, [feedback]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedFeedback = {
            comment,
            rating: ratingValue,
        };
        await onSubmit(updatedFeedback);
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}
                >
                    EVENT FEEDBACK
                </Typography>
                <Divider />
                <Typography sx={{ mt: 2, fontSize: '.9em', textAlign: 'center' }}>
                    WE WOULD LIKE TO HEAR HOW WAS YOUR EXPERIENCE AT OUR EVENT
                </Typography>
                <Typography sx={{ mt: 2, fontSize: '.8em', textAlign: 'center' }}>
                    HOW WAS YOUR EXPERIENCE:
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Rating
                        name="rating"
                        size="large"
                        value={ratingValue}
                        sx={{ fontSize: '3rem' }}
                        onChange={(event, newValue) => setRatingValue(newValue)}
                    />
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography sx={{ fontSize: '.8em' }}>
                    ANY THOUGHTS YOU WOULD LIKE TO SHARE? (OPTIONAL)
                </Typography>
                <Box sx={{ width: '100%', mt: 1 }}>
                    <TextField
                        id="fullWidth"
                        placeholder="Share your thoughts..."
                        multiline
                        minRows={4}
                        fullWidth
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            },
                            '& .MuiInputBase-root': {
                                padding: '8px',
                            },
                        }}
                    />
                </Box>
                <Button
                    variant="contained"
                    sx={{ backgroundColor: "#C63F47", color: "#FFFFFF", mt: 2 }}
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </Box>
        </Modal>
    );
}
