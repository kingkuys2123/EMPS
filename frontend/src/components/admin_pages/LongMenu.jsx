import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function LongMenu({ onView, onEdit, onDelete, onConfirmEvent }) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            {/* Replacing the button with an IconButton (ellipsis button) */}
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={Boolean(anchorEl) ? 'long-menu' : undefined}
                aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>

            {/* Menu with action items */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={onView}>View Event</MenuItem>
                <MenuItem onClick={onEdit}>Edit Event</MenuItem>
                <MenuItem onClick={onDelete}>Delete Event</MenuItem>
                {onConfirmEvent && (
                    <MenuItem onClick={onConfirmEvent}>Confirm Event</MenuItem>
                )}
            </Menu>
        </>
    );
}

export default LongMenu;
