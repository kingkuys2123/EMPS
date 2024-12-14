import React, { useState, useEffect } from "react";
import OrganizerSidebar from "./OrganizerSidebar.jsx";
import TemplateComponent from "../TemplateComponent.jsx";
import TicketService from "../../services/TicketService.jsx";
import EventService from "../../services/EventService.jsx";
import { Button, Modal, Box, TextField, Checkbox, FormControlLabel, Typography, IconButton, Autocomplete } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ConfirmDialog from "../ConfirmDialog.jsx";
import CustomSnackbar from "../CustomSnackbar.jsx";
import { getAuth } from "../../utils/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function Tickets() {
    const nav = useNavigate();
    const { currentUser, setCurrentUser, toggleOrganizer } = getAuth();

    const [rows, setRows] = useState([]);
    const [activeTab, setActiveTab] = useState("All");

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const [selectedTicket, setSelectedTicket] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);

    const [ticketForm, setTicketForm] = useState({ name: '', description: '', type: '', quantity: 0, isAvailable: false, price: 0, event: null });
    const [editingTicketId, setEditingTicketId] = useState(null);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [eventOptions, setEventOptions] = useState([]);

    const modalBoxStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        padding: 4,
        backgroundColor: '#fff',
        borderRadius: 2.5,
        boxShadow: 24,
    };

    const modalContentStyle = {
        display: 'flex',
        gap: 20,
        justifyContent: 'space-between',
        marginBottom: 25,
    };

    const columns = [
        { field: 'ticketId', headerName: 'ID' },
        { field: 'name', headerName: 'Name', flex: 0.5 },
        { field: 'description', headerName: 'Description', flex: 1.5 },
        { field: 'type', headerName: 'Type', minWidth: 120 },
        {
            field: 'event',
            headerName: 'Event',
            minWidth: 150,
            renderCell: (params) => (
                <a href={`/organizer/events/view/${params.row.event.eventId}`} style={{ textDecoration: 'none', color: 'blue' }}>
                    {params.row.event ? params.row.event.name : 'N/A'}
                </a>
            )
        },
        { field: 'quantity', headerName: 'Quantity', type: 'number', align: 'left', headerAlign: 'left' },
        { field: 'price', headerName: 'Price', type: 'number', align: 'left', headerAlign: 'left' },
        {
            field: 'isAvailable',
            headerName: 'Status',
            minWidth: 100,
            renderCell: (params) => (
                <span style={{ color: params.value ? "green" : "red" }}>
                    {params.value ? "Available" : "Unavailable"}
                </span>
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 0.5,
            renderCell: (params) => (
                <>
                    <Button variant="outlined" size="small" color="primary" onClick={() => handleEdit(params.row)}>
                        Edit
                    </Button>
                    <Button variant="outlined" size="small" color="error" style={{ marginLeft: 8 }} onClick={() => handleDeleteModalOpen(params.row)}>
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    useEffect(() => {
        if (!currentUser) {
            nav('/');
        } else if (currentUser.accountType === "user") {
            nav("/home");
        } else if (currentUser.accountType === "admin") {
            nav("/admin/dashboard");
        } else if (currentUser.accountType === "organizer") {
            if (!toggleOrganizer) {
                nav('/home');
            }
        }
    }, []);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const data = await TicketService.getAllTicketsFromOrganizer(currentUser.userID);
                setRows(data);
            } catch (error) {
                console.error("Error fetching tickets:", error);
            }
        };
        fetchTickets();
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await EventService.getEventsByOrganizer(currentUser.userID);
                setEventOptions(response.data);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };
        fetchEvents();
    }, []);

    const resetForm = () => setTicketForm({ name: '', description: '', type: '', quantity: 0, isAvailable: false, price: 0, event: null });

    const handleCreate = async () => {
        try {
            const tempEventId = parseInt(ticketForm.eventId);
            const { eventId, ...ticketDataWithoutEventId } = ticketForm;
            await TicketService.createTicketWithEvent(tempEventId, ticketDataWithoutEventId);
            const data = await TicketService.getAllTicketsFromOrganizer(currentUser.userID);
            setRows(data);
            setOpenCreateModal(false);
            resetForm();
            setSnackbarMessage('Ticket created successfully!');
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Error creating ticket:", error);
            setSnackbarMessage('Error creating ticket.');
            setSnackbarOpen(true);
        }
    };

    const handleEdit = (ticket) => {
        setEditingTicketId(ticket.ticketId);
        setTicketForm(ticket);
        setOpenEditModal(true);
    };

    const handleUpdate = async () => {
        try {
            await TicketService.updateTicket(editingTicketId, ticketForm);
            const data = await TicketService.getAllTicketsFromOrganizer(currentUser.userID);
            setRows(data);
            setOpenEditModal(false);
            resetForm();
            setSnackbarMessage('Ticket updated successfully!');
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Error updating ticket:", error);
            setSnackbarMessage('Error updating ticket.');
            setSnackbarOpen(true);
        }
    };

    const handleDeleteModalOpen = (ticket) => {
        setSelectedTicket(ticket);
        setOpenConfirmDialog(true);
    };

    const handleDeleteConfirm = async (confirm) => {
        if (confirm && selectedTicket) {
            try {
                await TicketService.deleteTicket(selectedTicket.ticketId);
                setRows((prevRows) => prevRows.filter((row) => row.ticketId !== selectedTicket.ticketId));
                setSnackbarMessage('Ticket deleted successfully!');
                setSnackbarOpen(true);
            } catch (error) {
                console.error("Error deleting ticket:", error);
                setSnackbarMessage('Error deleting ticket.');
                setSnackbarOpen(true);
            }
        }
        setOpenConfirmDialog(false);
        setSelectedTicket(null);
    };

    const handleFormChange = (key, value) => {
        setTicketForm((prevForm) => ({ ...prevForm, [key]: value }));
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
            <TemplateComponent
                SidebarComponent={OrganizerSidebar}
                title="Tickets"
                fetchRows={rows}
                columns={columns}
                newButton
                setActiveTab={setActiveTab}
                onCreateNewTicketClick={() => setOpenCreateModal(true)}
                searchLabel="Search tickets by event name..."
            />

            <Modal open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
                <Box component="form" sx={{ ...modalBoxStyle, backgroundColor: "#F3F3F3" }} onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenCreateModal(false)}
                        sx={{ position: 'absolute', right: 8, top: 8, color: "#C63f47" }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <h2 style={{ height: '40px' }}>Create New Ticket</h2>
                    <div>
                        <div style={modalContentStyle}>
                            <Autocomplete
                                options={eventOptions}
                                getOptionLabel={(option) => option.name}
                                value={eventOptions.find(option => option.eventId === ticketForm.eventId) || null}
                                onChange={(event, newValue) => handleFormChange('eventId', newValue ? newValue.eventId : null)}
                                renderInput={(params) => <TextField {...params} label="Event" required />}
                                noOptionsText="No Events Found"
                                style={{ display: 'flex', flex: 1 }}
                            />
                        </div>
                        <div style={modalContentStyle}>
                            <TextField style={{ display: 'flex', flex: 1 }} label="Name" value={ticketForm.name}
                                       onChange={(e) => handleFormChange('name', e.target.value)} required />
                            <TextField style={{ display: 'flex', flex: 1 }} label="Description"
                                       value={ticketForm.description}
                                       onChange={(e) => handleFormChange('description', e.target.value)} required />
                        </div>
                        <div style={modalContentStyle}>
                            <TextField style={{ display: 'flex', flex: 1 }} label="Type" value={ticketForm.type}
                                       onChange={(e) => handleFormChange('type', e.target.value)} required />
                            <TextField style={{ display: 'flex', flex: 1 }} label="Quantity" type="number"
                                       value={ticketForm.quantity}
                                       onChange={(e) => handleFormChange('quantity', parseInt(e.target.value))}
                                       required />
                        </div>
                        <div style={modalContentStyle}>
                            <TextField style={{ display: 'flex', flex: 1 }} label="Price" type="number"
                                       value={ticketForm.price}
                                       onChange={(e) => handleFormChange('price', parseInt(e.target.value))} required />
                            <FormControlLabel style={{ display: 'flex', flex: 1 }}
                                              control={<Checkbox checked={ticketForm.isAvailable}
                                                                 onChange={(e) => handleFormChange('isAvailable', e.target.checked)} />}
                                              label="Available" />
                        </div>
                    </div>
                    <Button variant="contained" color="primary" type="submit"
                            sx={{ backgroundColor: "#C63f47" }}>Create</Button>
                </Box>
            </Modal>

            <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
                <Box component="form" sx={{ ...modalBoxStyle, backgroundColor: "#F3F3F3" }} onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdate();
                }}>
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenEditModal(false)}
                        sx={{ position: 'absolute', right: 8, top: 8, color: "#C63f47" }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <h2 style={{ height: '40px' }}>Update Ticket</h2>
                    <div>
                        <div style={modalContentStyle}>
                            <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
                                <Typography variant="subtitle1" style={{ marginRight: '10px' }}>
                                    <strong>
                                        Event:
                                    </strong>
                                </Typography>
                                <Typography variant="body1">{ticketForm.event?.name || 'N/A'}</Typography>
                            </div>
                        </div>
                        <div style={modalContentStyle}>
                            <TextField style={{ display: 'flex', flex: 1 }} label="Name" value={ticketForm.name}
                                       onChange={(e) => handleFormChange('name', e.target.value)} required />
                            <TextField style={{ display: 'flex', flex: 1 }} label="Description"
                                       value={ticketForm.description}
                                       onChange={(e) => handleFormChange('description', e.target.value)} required />
                        </div>
                        <div style={modalContentStyle}>
                            <TextField style={{ display: 'flex', flex: 1 }} label="Type" value={ticketForm.type}
                                       onChange={(e) => handleFormChange('type', e.target.value)} required />
                            <TextField style={{ display: 'flex', flex: 1 }} label="Quantity" type="number"
                                       value={ticketForm.quantity}
                                       onChange={(e) => handleFormChange('quantity', parseInt(e.target.value))}
                                       required />
                        </div>
                        <div style={modalContentStyle}>
                            <TextField style={{ display: 'flex', flex: 1 }} label="Price" type="number"
                                       value={ticketForm.price}
                                       onChange={(e) => handleFormChange('price', parseInt(e.target.value))} required />
                            <FormControlLabel style={{ display: 'flex', flex: 1 }}
                                              control={<Checkbox checked={ticketForm.isAvailable}
                                                                 onChange={(e) => handleFormChange('isAvailable', e.target.checked)} />}
                                              label="Available" />
                        </div>
                    </div>
                    <Button variant="contained" color="primary" type="submit"
                            sx={{ backgroundColor: "#C63f47" }}>Update</Button>
                </Box>
            </Modal>
            <ConfirmDialog
                openDialog={openConfirmDialog}
                setOpenDialog={setOpenConfirmDialog}
                onClose={handleDeleteConfirm}
                message="Are you sure you want to delete this ticket?"
                title="Delete Ticket"
            />
            <CustomSnackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbarMessage}
            />
        </>
    );
}

export default Tickets;