import React, { useState } from "react";
import { Menu, MenuItem, IconButton, Modal, Box, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckIcon from '@mui/icons-material/Check';
import './styles/venue.css';
import VenueService from '../../services/VenueService.jsx';
import UpdateVenue from "../admin_pages/UpdateVenue.jsx"



  


function VenueOptions({ venue,  refreshData}) {

    const options = ['Update', 'Delete'];
    const ITEM_HEIGHT = 48;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false); 
    const [showAlert, setShowAlert] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

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

    const handleDelete = async (e) => {
        
      try {
        const response = await VenueService.deleteVenue(venue.venueId);
          setOpenDeleteConfirm(false); 
          refreshData();
          setShowDeleteAlert(true);
          console.log("Venue deleted successfully, showing delete alert.");
          setTimeout(() => {
            setShowDeleteAlert(false);
          }, 3000);
      } catch (error) {
          console.error('Error deleting venue:', error);
      }
        
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
                    <UpdateVenue venue={venue} onClose={handleCloseModal} setShowAlert={setShowAlert} /> 
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

            {showAlert && (
              <Alert
                icon={<CheckIcon fontSize="inherit" />}
                severity="success"
                sx={{
                  position: "fixed",
                  top: 20,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80%",
                  maxWidth: "400px",
                }}
              >
                Update complete
              </Alert>
            )}

            {showDeleteAlert && (
              <Alert
                icon={<CheckIcon fontSize="inherit" />}
                severity="success"
                sx={{
                  position: "fixed",
                  top: 20,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80%",
                  maxWidth: "400px",
                  zIndex: 9999, 
                }}
              >
                Venue deleted successfully
              </Alert>
            )}
        </div>
    );
}

export default VenueOptions;
