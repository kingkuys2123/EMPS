import React, { useEffect, useState } from 'react';
import DataTable from '../../components/DataTableComponent';
import TicketService from '../../services/TicketService';
import EventService from '../../services/EventService';
import { getAuth } from '../../utils/AuthContext';
import { Button, Modal, Box, TextField, Checkbox, FormControlLabel, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ConfirmDialog from '../ConfirmDialog';
import CustomSnackbar from '../CustomSnackbar';

const ViewTicketById = ({ eventId }) => {
    const { currentUser } = getAuth();
    const [rows, setRows] = useState([]);
    const [columns] = useState([
        { field: 'ticketId', headerName: 'ID', flex: 0 },
        { field: 'name', headerName: 'Ticket Name', flex: 0 },
        { field: 'description', headerName: 'Description', flex: 2 },
        { field: 'type', headerName: 'Type', flex: 0 },
        { field: 'quantity', headerName: 'Quantity', flex: 0 },
        { field: 'price', headerName: 'Price', flex: 0 },
        {
            field: 'status',
            headerName: 'Status',
            flex: 0,
            renderCell: (params) => (
                <span>{params.row.isAvailable ? 'Available' : 'Unavailable'}</span>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
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
    ]);

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [createTicketForm, setCreateTicketForm] = useState({ name: '', description: '', type: '', quantity: 0, isAvailable: false, price: 0, event: null });
    const [editTicketForm, setEditTicketForm] = useState({ name: '', description: '', type: '', quantity: 0, isAvailable: false, price: 0, event: null });
    const [editingTicketId, setEditingTicketId] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

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

    const fetchTickets = async () => {
        try {
            const data = await TicketService.getTicketsByEventId(eventId);
            setRows(data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const resetCreateForm = () => setCreateTicketForm({ name: '', description: '', type: '', quantity: 0, isAvailable: false, price: 0, event: null });
    const resetEditForm = () => setEditTicketForm({ name: '', description: '', type: '', quantity: 0, isAvailable: false, price: 0, event: null });

    const handleCreate = async () => {
        try {
            await TicketService.createTicketWithEvent(eventId, createTicketForm);
            fetchTickets();
            setOpenCreateModal(false);
            resetCreateForm();
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
        setEditTicketForm(ticket);
        setOpenEditModal(true);
    };

    const handleUpdate = async () => {
        try {
            await TicketService.updateTicket(editingTicketId, editTicketForm);
            fetchTickets();
            setOpenEditModal(false);
            resetEditForm();
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

    const handleCreateFormChange = (key, value) => {
        setCreateTicketForm((prevForm) => ({ ...prevForm, [key]: value }));
    };

    const handleEditFormChange = (key, value) => {
        setEditTicketForm((prevForm) => ({ ...prevForm, [key]: value }));
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const filteredRows = rows.filter(row => row.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 2 }}>
                    <TextField
                        label="Search tickets by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        variant="outlined"
                        size="small"
                    />
                    <Button variant="contained" sx={{ backgroundColor: "#C63f47" }} onClick={() => setOpenCreateModal(true)}>
                        Add Ticket
                    </Button>
                </Box>
                <div style={{ width: '100%', overflowX: 'auto' }}>
                    <DataTable
                        rows={filteredRows}
                        columns={columns}
                        boxPadding="20px"
                        checkBox={false}
                        autoHeight
                    />
                </div>
            </Box>
            <Modal open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
                <Box component="form" sx={{...modalBoxStyle, backgroundColor: "#F3F3F3"}} onSubmit={(e) => {
                    e.preventDefault();
                    handleCreate();
                }}>
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenCreateModal(false)}
                        sx={{position: 'absolute', right: 8, top: 8, color: "#C63f47"}}
                    >
                        <CloseIcon/>
                    </IconButton>
                    <h2 style={{height: '40px'}}>Create New Ticket</h2>
                    <div>
                        <div style={modalContentStyle}>
                            <TextField style={{display: 'flex', flex: 1}} label="Name" value={createTicketForm.name}
                                       onChange={(e) => handleCreateFormChange('name', e.target.value)} required/>
                            <TextField style={{display: 'flex', flex: 1}} label="Description"
                                       value={createTicketForm.description}
                                       onChange={(e) => handleCreateFormChange('description', e.target.value)}
                                       required/>
                        </div>
                        <div style={modalContentStyle}>
                            <TextField style={{display: 'flex', flex: 1}} label="Type" value={createTicketForm.type}
                                       onChange={(e) => handleCreateFormChange('type', e.target.value)} required/>
                            <TextField style={{display: 'flex', flex: 1}} label="Quantity" type="number"
                                       value={createTicketForm.quantity}
                                       onChange={(e) => handleCreateFormChange('quantity', parseInt(e.target.value))}
                                       required/>
                        </div>
                        <div style={modalContentStyle}>
                            <TextField style={{display: 'flex', flex: 1}} label="Price" type="number"
                                       value={createTicketForm.price}
                                       onChange={(e) => handleCreateFormChange('price', parseInt(e.target.value))}
                                       required/>
                            <FormControlLabel style={{display: 'flex', flex: 1}}
                                              control={<Checkbox checked={createTicketForm.isAvailable}
                                                                 onChange={(e) => handleCreateFormChange('isAvailable', e.target.checked)}/>}
                                              label="Available"/>
                        </div>
                    </div>
                    <Button variant="contained" color="primary" type="submit"
                            sx={{backgroundColor: "#C63f47"}}>Create</Button>
                </Box>
            </Modal>
            <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
                <Box component="form" sx={{...modalBoxStyle, backgroundColor: "#F3F3F3"}} onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdate();
                }}>
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenEditModal(false)}
                        sx={{position: 'absolute', right: 8, top: 8, color: "#C63f47"}}
                    >
                        <CloseIcon/>
                    </IconButton>
                    <h2 style={{height: '40px'}}>Update Ticket</h2>
                    <div>
                        <div style={modalContentStyle}>
                            <TextField style={{display: 'flex', flex: 1}} label="Name" value={editTicketForm.name}
                                       onChange={(e) => handleEditFormChange('name', e.target.value)} required/>
                            <TextField style={{display: 'flex', flex: 1}} label="Description"
                                       value={editTicketForm.description}
                                       onChange={(e) => handleEditFormChange('description', e.target.value)} required/>
                        </div>
                        <div style={modalContentStyle}>
                            <TextField style={{display: 'flex', flex: 1}} label="Type" value={editTicketForm.type}
                                       onChange={(e) => handleEditFormChange('type', e.target.value)} required/>
                            <TextField style={{display: 'flex', flex: 1}} label="Quantity" type="number"
                                       value={editTicketForm.quantity}
                                       onChange={(e) => handleEditFormChange('quantity', parseInt(e.target.value))}
                                       required/>
                        </div>
                        <div style={modalContentStyle}>
                            <TextField style={{display: 'flex', flex: 1}} label="Price" type="number"
                                       value={editTicketForm.price}
                                       onChange={(e) => handleEditFormChange('price', parseInt(e.target.value))}
                                       required/>
                            <FormControlLabel style={{display: 'flex', flex: 1}}
                                              control={<Checkbox checked={editTicketForm.isAvailable}
                                                                 onChange={(e) => handleEditFormChange('isAvailable', e.target.checked)}/>}
                                              label="Available"/>
                        </div>
                    </div>
                    <Button variant="contained" color="primary" type="submit"
                            sx={{backgroundColor: "#C63f47"}}>Update</Button>
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
        </div>
    );
};

export default ViewTicketById;