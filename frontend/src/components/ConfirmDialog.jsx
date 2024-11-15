import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';

const ConfirmDialog = ({ openDialog, setOpenDialog, onClose, message, title }) => {
    return (
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography>{message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => onClose(false)}
                    variant="contained"
                    sx={{ backgroundColor: '#7F7F7F', '&:hover': { backgroundColor: '#6d6d6d' } }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={() => onClose(true)}
                    variant="contained"
                    sx={{ backgroundColor: '#C63F47', '&:hover': { backgroundColor: '#a32d34' } }}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
