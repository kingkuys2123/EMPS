import React, { useState, useEffect } from "react";
import OrganizerSidebar from "./OrganizerSidebar.jsx";
import TemplateComponent from "../TemplateComponent.jsx";
import TicketService from "../../services/TicketService.jsx";
import { Button, Modal, Box, TextField, Checkbox, FormControlLabel, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";

function Tickets() {
    const [rows, setRows] = useState([]);
    const [activeTab, setActiveTab] = useState("All");
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [ticketForm, setTicketForm] = useState({ name: '', description: '', type: '', quantity: 0, isAvailable: false, price: 0 });
    const [editingTicketId, setEditingTicketId] = useState(null);

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
        borderRadius: 5,
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
        const fetchTickets = async () => {
            try {
                const data = await TicketService.getAllTickets();
                setRows(data);
            } catch (error) {
                console.error("Error fetching tickets:", error);
            }
        };
        fetchTickets();
    }, []);

    const resetForm = () => setTicketForm({ name: '', description: '', type: '', quantity: 0, isAvailable: false, price: 0 });

    const handleCreate = async () => {
        try {
            await TicketService.createTicket(ticketForm);
            const data = await TicketService.getAllTickets();
            setRows(data);
            setOpenCreateModal(false);
            resetForm();
        } catch (error) {
            console.error("Error creating ticket:", error);
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
            const data = await TicketService.getAllTickets();
            setRows(data);
            setOpenEditModal(false);
            resetForm();
        } catch (error) {
            console.error("Error updating ticket:", error);
        }
    };

    const handleDeleteModalOpen = (ticket) => {
        setSelectedRow(ticket);
        setDeleteModalOpen(true);
    };

    const handleDeleteModalClose = () => {
        setDeleteModalOpen(false);
        setSelectedRow(null);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedRow) return;
        try {
            await TicketService.deleteTicket(selectedRow.ticketId);
            setRows((prevRows) => prevRows.filter((row) => row.ticketId !== selectedRow.ticketId));
            handleDeleteModalClose();
        } catch (error) {
            console.error("Error deleting ticket:", error);
        }
    };

    const handleFormChange = (key, value) => {
        setTicketForm((prevForm) => ({ ...prevForm, [key]: value }));
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
                searchLabel="Search tickets by name..."
            />
            {/* Create Modal */}
            <Modal open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
                <Box component="form" sx={modalBoxStyle} onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
                    <h1>Create New Ticket</h1>
                    <div>
                        <div style={modalContentStyle}>
                            <TextField style={{display: 'flex', flex: 1}} label="Name" value={ticketForm.name} onChange={(e) => handleFormChange('name', e.target.value)} required />
                            <TextField style={{display: 'flex', flex: 1}} label="Description" value={ticketForm.description} onChange={(e) => handleFormChange('description', e.target.value)} required />
                        </div>
                        <div style={modalContentStyle}>
                            <FormControl style={{display: 'flex', flex: 1}}>
                                <InputLabel>Type</InputLabel>
                                <Select value={ticketForm.type} onChange={(e) => handleFormChange('type', e.target.value)} required>
                                    <MenuItem value="Premium">Premium</MenuItem>
                                    <MenuItem value="Regular">Regular</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField style={{display: 'flex', flex: 1}} label="Quantity" type="number" value={ticketForm.quantity} onChange={(e) => handleFormChange('quantity', parseInt(e.target.value))} required />
                        </div>
                        <div style={modalContentStyle}>
                            <TextField style={{display: 'flex', flex: 1}} label="Price" type="number" value={ticketForm.price} onChange={(e) => handleFormChange('price', parseInt(e.target.value))} required />
                            <FormControlLabel style={{display: 'flex', flex: 1}} control={<Checkbox checked={ticketForm.isAvailable} onChange={(e) => handleFormChange('isAvailable', e.target.checked)} />} label="Available" />
                        </div>
                    </div>
                    <Button variant="contained" color="primary" type="submit">Create</Button>
                </Box>
            </Modal>
            {/* Edit Modal */}
            <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
                <Box component="form" sx={modalBoxStyle} onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                    <h1>Update Ticket</h1>
                    <div style={{ height: '275px' }}>
                        <div style={modalContentStyle}>
                            <TextField style={{display: 'flex', flex: 1}} label="Name" value={ticketForm.name} onChange={(e) => handleFormChange('name', e.target.value)} required />
                            <TextField style={{display: 'flex', flex: 1}} label="Description" value={ticketForm.description} onChange={(e) => handleFormChange('description', e.target.value)} required />
                        </div>
                        <div style={modalContentStyle}>
                            <TextField style={{display: 'flex', flex: 1}} label="Type" value={ticketForm.type} onChange={(e) => handleFormChange('type', e.target.value)} required />
                            <TextField style={{display: 'flex', flex: 1}} label="Quantity" type="number" value={ticketForm.quantity} onChange={(e) => handleFormChange('quantity', parseInt(e.target.value))} required />
                        </div>
                        <div style={modalContentStyle}>
                            <TextField style={{display: 'flex', flex: 1}} label="Price" type="number" value={ticketForm.price} onChange={(e) => handleFormChange('price', parseInt(e.target.value))} required />
                            <FormControlLabel style={{display: 'flex', flex: 1}} control={<Checkbox checked={ticketForm.isAvailable} onChange={(e) => handleFormChange('isAvailable', e.target.checked)} />} label="Available" />
                        </div>
                    </div>
                    <Button variant="contained" color="primary" type="submit">Update</Button>
                </Box>
            </Modal>
            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteModalOpen} onClose={handleDeleteModalClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this ticket?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteModalClose} color="primary">Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default Tickets;
