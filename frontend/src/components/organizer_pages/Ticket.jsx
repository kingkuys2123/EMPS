import React, { useState, useEffect } from "react";
import OrganizerSidebar from "./OrganizerSidebar.jsx";
import TemplateComponent from "../TemplateComponent.jsx";
import TicketService from "../../services/TicketService.jsx";
import { Button, Modal, Box, TextField, Checkbox, FormControlLabel, Select, MenuItem, FormControl, InputLabel } from "@mui/material";


function Tickets() {
    const [rows, setRows] = useState([]);
    const [activeTab, setActiveTab] = useState("All");
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [newTicket, setNewTicket] = useState({ name: '', description: '', type: '', quantity: 0, isAvailable: false, price: 0 });
    const [editingTicket, setEditingTicket] = useState(null);
    const [checker, checked] = useState(true);

    const modalBoxStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        justifyContent: 'space-between',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        height: 350,
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
        width: '100%',
        borderRadius: 5,
        boxShadow: 24,
        marginBottom: '25px'
    };

    const columns = [
        { field: 'ticketId', headerName: 'ID' },
        { field: 'name', headerName: 'Name', display: 'flex', flex: .5 },
        { field: 'description', headerName: 'Description', display: 'flex', flex: 1.5 },
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
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            display: 'flex', flex: .5,
            renderCell: (params) => (
                <>
                    <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(params.row)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        style={{ marginLeft: 8 }}
                        onClick={() => handleDelete(params.row.ticketId)}
                    >
                        Delete
                    </Button>
                </>
            )
        },
    ];

    useEffect(() => {
        const fetchTickets = async () => {
            const data = await TicketService.getAllTickets();
            setRows(data);
        };
        fetchTickets();
    }, [newTicket, checker]);

    const handleCreate = async () => {
        await TicketService.createTicket(newTicket);
        const data = await TicketService.getAllTickets();
        setRows(data);
        setOpenCreateModal(false);
        setNewTicket({ name: '', description: '', type: '', quantity: 0, isAvailable: false, price: 0 });
    };

    const handleEdit = (ticket) => {
        setEditingTicket(ticket);
        setNewTicket(ticket);
        setOpenEditModal(true);
    };

    const handleUpdate = async () => {
        await TicketService.updateTicket(editingTicket.ticketId, newTicket);
        const data = await TicketService.getAllTickets();
        setRows(data);
        setOpenEditModal(false);
        setEditingTicket(null);
        setNewTicket({ name: '', description: '', type: '', quantity: 0, isAvailable: false, price: 0 });
    };

    const handleDelete = async (id) => {
        await TicketService.deleteTicket(id);
        const data = await TicketService.getAllTickets();
        setRows(data);
        checked((prevChecker) => !prevChecker);
    };

    return (
        <>
            {/* TemplateComponent wrapping the table and content */}
            <TemplateComponent
                SidebarComponent={OrganizerSidebar}
                title="Tickets"
                fetchRows={rows}
                columns={columns}
                checkBoxTemplate={false}
                newButton={true}
                setActiveTab={setActiveTab}
                onCreateNewTicketClick={() => setOpenCreateModal(true)}
                searchLabel={"Search tickets by name..."}
            />
            <Button variant="contained" color="primary" onClick={() => setOpenCreateModal(true)}>
                Create New Ticket
            </Button>
            {/* Modal for Creating New Ticket */}
            <Modal open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
                <Box component="form" sx={modalBoxStyle} onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
                    <h1>Create New Ticket</h1>
                    <div style={{ height: '275px' }}>
                        <div style={modalContentStyle}>
                            <TextField
                                sx={{ display: 'flex', flex: 1 }}
                                label="Name"
                                value={newTicket.name}
                                onChange={(e) => setNewTicket({ ...newTicket, name: e.target.value })}
                                required
                            />
                            <TextField
                                sx={{ display: 'flex', flex: 1 }}
                                label="Description"
                                value={newTicket.description}
                                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                                required
                            />
                        </div>
                        <div style={modalContentStyle}>
                            <FormControl sx={{ display: 'flex', flex: 1 }}>
                                <InputLabel id="ticket-type-label">Type</InputLabel>
                                <Select
                                    labelId="ticket-type-label"
                                    id="ticket-type"
                                    value={newTicket.type}
                                    onChange={(e) => setNewTicket({ ...newTicket, type: e.target.value })}
                                    required
                                >
                                    <MenuItem value="Premium">Premium</MenuItem>
                                    <MenuItem value="Regular">Regular</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                sx={{ display: 'flex', flex: 1 }}
                                label="Quantity"
                                type="number"
                                value={newTicket.quantity}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (value >= 0) {
                                        setNewTicket({ ...newTicket, quantity: value });
                                    }
                                }}
                                required
                            />
                        </div>
                        <div style={modalContentStyle}  >
                            <TextField
                                sx={{ display: 'flex', flex: 1 }}
                                label="Price"
                                type="number"
                                value={newTicket.price}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (value >= 0) {
                                        setNewTicket({ ...newTicket, price: value });
                                    }
                                }}
                                required
                            />
                            <FormControlLabel
                                sx={{ display: 'flex', flex: 1 }}
                                control={<Checkbox checked={newTicket.isAvailable} onChange={(e) => setNewTicket({ ...newTicket, isAvailable: e.target.checked })} />}
                                label="Available"
                            />
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
                            <TextField
                                sx={{ display: 'flex', flex: 1 }}
                                label="Name"
                                value={newTicket.name}
                                onChange={(e) => setNewTicket({ ...newTicket, name: e.target.value })}
                                required
                            />
                            <TextField
                                sx={{ display: 'flex', flex: 1 }}
                                label="Description"
                                value={newTicket.description}
                                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                                required
                            />
                        </div>

                        <div style={modalContentStyle}>
                            <TextField
                                sx={{ display: 'flex', flex: 1 }}
                                label="Type"
                                value={newTicket.type}
                                onChange={(e) => setNewTicket({ ...newTicket, type: e.target.value })}
                                required
                            />
                            <TextField
                                sx={{ display: 'flex', flex: 1 }}
                                label="Quantity"
                                type="number"
                                value={newTicket.quantity}
                                onChange={(e) => setNewTicket({ ...newTicket, quantity: parseInt(e.target.value) })}
                                required
                            />
                        </div>

                        <div style={modalContentStyle}>
                            <TextField
                                sx={{ display: 'flex', flex: 1 }}
                                label="Price"
                                type="number"
                                value={newTicket.price}
                                onChange={(e) => setNewTicket({ ...newTicket, price: parseInt(e.target.value) })}
                                required
                            />
                            <FormControlLabel
                                sx={{ display: 'flex', flex: 1 }}
                                control={<Checkbox checked={newTicket.isAvailable} onChange={(e) => setNewTicket({ ...newTicket, isAvailable: e.target.checked })} />}
                                label="Available"
                            />
                        </div>
                    </div>
                    <Button variant="contained" color="primary" type="submit">Update</Button>
                </Box>
            </Modal>
        </>
    );
}

export default Tickets;
