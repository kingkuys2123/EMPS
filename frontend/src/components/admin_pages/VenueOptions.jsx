import React, { useState } from "react";
import { Menu, MenuItem, IconButton, Modal, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import './styles/venue.css';
import UpdateVenue from "../admin_pages/UpdateVenue.jsx"



  


function VenueOptions({ venue,  refreshData}) {

    const options = ['Update', 'Delete'];
    const ITEM_HEIGHT = 48;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false); 

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleOpenModal = () => {
        setOpenModal(true);
        handleClose();
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        refreshData();
    };

    const handleOpenDeleteConfirm = () => {
        setOpenDeleteConfirm(true); 
        handleClose();
    };

    const handleCloseDeleteConfirm = () => {
        setOpenDeleteConfirm(false); 
    }

    const handleDelete = () => {
        
        console.log("Item deleted");
        setOpenDeleteConfirm(false);
        refreshData();
    };

    return (
        <div className="venue-option">
            <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '20ch',
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} onClick={option === 'Update' ? handleOpenModal : option === 'Delete' ? handleOpenDeleteConfirm : handleClose}>
            {option}
          </MenuItem>
        ))}
      </Menu>

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="Update-venue"
                className="mod"
            >
                <Box className="updateBox">
                    <UpdateVenue venue={venue} onClose={handleCloseModal} /> 
                </Box>
            </Modal>

            <Dialog
                open={openDeleteConfirm}
                onClose={handleCloseDeleteConfirm}
                aria-labelledby="delete-confirmation"
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this venue?
                </DialogContent>
                <DialogActions>
                    <button onClick={handleCloseDeleteConfirm} color="primary">
                        Cancel
                    </button>
                    <button className="btn" onClick={handleDelete} color="secondary">
                        Delete
                    </button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default VenueOptions;
