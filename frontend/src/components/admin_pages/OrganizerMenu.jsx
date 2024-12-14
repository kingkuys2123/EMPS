import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function OrganizerMenu({ onRefuse, onEdit, onDelete, onApprove, activeTab }) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            {/* Ellipsis Icon Button */}
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

            {/* Dynamic Menu Items */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {activeTab === 2 ? (  // Check if we're on the "Pending" tab
                    // Wrap the items in a <div> instead of a Fragment
                    <div>
                        <MenuItem onClick={() => { onApprove(); handleClose(); }}>
                            Approve
                        </MenuItem>
                        <MenuItem onClick={() => { onRefuse(); handleClose(); }}>
                            Refuse
                        </MenuItem>
                    </div>
                ) : (
                    // Show Edit and Delete for other tabs
                    <div>
                        <MenuItem onClick={() => { onDelete(); handleClose(); }}>
                            Delete Organizer
                        </MenuItem>
                    </div>
                )}
            </Menu>
        </>
    );
}

export default OrganizerMenu;  // Make sure to export the component as default
