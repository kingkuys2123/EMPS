import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { getAuth } from "../../utils/AuthContext.jsx";
import OrganizerService from "../../services/OrganizerService.jsx";
import ConfirmDialog from '../ConfirmDialog.jsx';

function OrganizerApplicationModal({ open, handleClose }) {
    const { currentUser } = getAuth();
    const [organizer, setOrganizer] = useState(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openCancelDialog, setOpenCancelDialog] = useState(false);

    const handleApply = () => {
        setOpenConfirmDialog(true);
    };

    const handleCancel = () => {
        setOpenCancelDialog(true)
    }

    const handleConfirmApply = async (confirm) => {
        setOpenConfirmDialog(false);
        if (confirm) {
            try {
                await OrganizerService.applyForOrganizer({}, currentUser.userID);
                setOrganizer({ approvalStatus: "pending" });
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleCancelApplication = async (confirm) => {
        setOpenCancelDialog(false);
        if(confirm){
            try{
                await OrganizerService.deleteOrganizer(organizer.organizerId);
                setOrganizer(null);
            } catch (e) {
                console.error(e);
            }
        }
    }

    useEffect(() => {
        const fetchOrganizer = async () => {
            if (currentUser && currentUser.userID) {
                try {
                    const organizerResponse = await OrganizerService.getOrganizerWithUser(currentUser.userID);
                    setOrganizer(organizerResponse);
                } catch (e) {
                    console.error(e);
                }
            }
        };

        fetchOrganizer();
    }, [currentUser]);

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 600,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4
            }}>
                <Typography variant="h4" component="h2">
                    Become an Organizer
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    {organizer ? (
                        <>
                            {organizer.approvalStatus.toLowerCase() === "pending" ? (
                                <>
                                    Pending approval to become an organizer. Wait for an admin to approve your application.
                                </>
                            ) : (
                                <>

                                </>
                            )}
                        </>
                    ) : (
                        "Please click the apply button to become an organizer. As an organizer, you will be able to create and manage events, engage with participants, and more."
                    )}
                    <br />
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={handleClose} variant="contained" sx={{ backgroundColor: "gray", borderRadius: 0 }}>
                        Close
                    </Button>
                    {organizer ? (
                        <>
                            {organizer.approvalStatus.toLowerCase() === "pending" ? (
                                <>
                                    <Button onClick={handleCancel} variant="contained" sx={{ backgroundColor: "#C63f47", borderRadius: 0 }}>
                                        Cancel Application
                                    </Button>
                                </>
                            ) : (
                                <></>
                            )}
                        </>
                    ) : (
                        <>
                            <Button onClick={handleApply} variant="contained" sx={{ backgroundColor: "#C63f47", borderRadius: 0 }}>
                                Apply
                            </Button>
                        </>
                    )}
                </Box>
                <ConfirmDialog
                    openDialog={openConfirmDialog}
                    setOpenDialog={setOpenConfirmDialog}
                    onClose={handleConfirmApply}
                    message="Are you sure you want to apply to become an organizer?"
                    title="Confirm Application"
                />
                <ConfirmDialog
                    openDialog={openCancelDialog}
                    setOpenDialog={setOpenCancelDialog}
                    onClose={handleCancelApplication}
                    message="Are you sure you want to cancel your application to become an organizer?"
                    title="Cancel Application"
                />
            </Box>
        </Modal>
    );
}

export default OrganizerApplicationModal;