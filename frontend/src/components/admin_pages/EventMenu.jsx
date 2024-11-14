import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditEventModal from './EditEventModal';

const options = [
  'View Event',
  'Update Event',
  'Delete Event',
];

export default function EventMenu({ event, onView, onUpdate, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (action) => {
    console.group(event.eventId);
    switch (action) {
      case 'View Event':
        onView(event.eventId);
        break;
      case 'Update Event':
        onUpdate(event.eventId);
        break;
      case 'Delete Event':
        onDelete(event.eventId);
        break;
      default:
        break;
    }
    handleClose();
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            onClick={() => handleMenuItemClick(option)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
