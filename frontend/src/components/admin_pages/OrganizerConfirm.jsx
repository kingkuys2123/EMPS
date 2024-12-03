import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { useEffect, useState } from "react";
import OrganizerService from "../../services/OrganizerService";

function OrganizerConfirm({ open, onClose, selectedUser, onConfirm, onRefuse, user }) {
    const [organizerId, setOrganizerId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validate and set organizerId
    useEffect(() => {
        if (selectedUser) {
            const id = selectedUser.organizerId || selectedUser.id; // Default to organizerId, fallback to id
            console.log("Selected User:", selectedUser); // Debugging log
            console.log("Setting organizerId:", id); // Debugging log
            setOrganizerId(id);
        }
    }, [selectedUser]);

    const handleApprove = async () => {
        if (!organizerId) {
            console.error("Cannot approve: organizerId is undefined");
            return;
        }
        setIsSubmitting(true);
        try {
            const updatedOrganizer = {
                ...selectedUser,
                approvalStatus: "Approved",
            };
            console.log("Sending update request for:", organizerId, updatedOrganizer); // Debugging log
            const response = await OrganizerService.updateOrganizer(organizerId, updatedOrganizer);
            onConfirm(response?.data || updatedOrganizer);
            onClose();
        } catch (error) {
            console.error("Error approving organizer:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRefuse = async () => {
        if (!selectedUser || !selectedUser.id) {
            console.error("Cannot refuse: selectedUser.id is undefined");
            return;
        }
        setIsSubmitting(true);
        try {
            await onRefuse(selectedUser.id);
            onClose();
        } catch (error) {
            console.error("Error refusing organizer:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Approve Organizer</DialogTitle>
            <DialogContent>
                {selectedUser?.user?.firstName
                    ? `Are you sure you want to approve ${selectedUser.user.firstName} as an organizer?`
                    : "Are you sure you want to approve this user as an organizer?"}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleRefuse} sx={{
                    backgroundColor: "#D32F2F",
                    color: "#FFFFFF",
                    "&:hover": { backgroundColor: "#B71C1C" },
                }} disabled={isSubmitting}>
                    Refuse
                </Button>
                <Button onClick={handleApprove} sx={{
                    backgroundColor: "#D32F2F",
                    color: "#FFFFFF",
                    "&:hover": { backgroundColor: "#B71C1C" },
                }} disabled={isSubmitting}>
                    Approve
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default OrganizerConfirm;
