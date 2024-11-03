import React from 'react';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import "./styles/FontStyle.css";

function CustomSnackbar({ open, message, onClose }) {
    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open={open}
            autoHideDuration={6000}
            onClose={onClose}
            message={message}
            sx={{ position: 'fixed', bottom: 0 }}
            action={
                <IconButton size="small" aria-label="close" color="inherit" onClick={onClose}>
                    <span>X</span>
                </IconButton>
            }
        />
    );
}

export default CustomSnackbar;
