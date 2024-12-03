import React, { useEffect, useState } from 'react';
import { getAuth } from '../../utils/AuthContext';
import TicketService from '../../services/TicketService';
import { Box, TextField, Checkbox, Button, FormControlLabel, Modal } from '@mui/material';

const Ticket = () => {
    const {currentUser, setCurrentUser} = getAuth();
    const [tickets, setTickets] = useState([]);
    const [newTicket, setNewTicket] = useState({ name: '', description: '', type: '', quantity: '', isAvailable: false, price: ''});
    const [editingTicket, setEditingTicket] = useState(null);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const modalBox = {
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        width: 600,
        height: '300px', 
        borderRadius: '10px',
        backgroundColor: '#F3F3F3', 
        boxShadow: 24, 
        padding: 4 
    };
    
    

    useEffect(() => {
        const fetchTickets = async () => {
            const data = await TicketService.getAllTickets();
            setTickets(data);
        };

        fetchTickets();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();

        const response = await TicketService.createTicket(newTicket);
        console.log("RESPONSE:" + response)
        setNewTicket({ name: '', description: '', type: '', quantity: 0, isAvailable: false, price: 0 }); // Reset form
        const data = await TicketService.getAllTickets(); // Refresh ticket list

        setTickets(data);
    };

    const handleEdit = (ticket) => {
        setEditingTicket(ticket);
        setNewTicket(ticket);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        await TicketService.updateTicket(editingTicket.ticketId, newTicket);
        setEditingTicket(null);
        setNewTicket({ name: '', description: '', type: '', quantity: 0, isAvailable: false, price: 0 }); // Reset form
        const data = await TicketService.getAllTickets(); // Refresh ticket list
        setTickets(data);
    };

    const handleDelete = async (id) => {
        await TicketService.deleteTicket(id);
        const data = await TicketService.getAllTickets(); // Refresh ticket list
        setTickets(data);
    };

    return (
        <div className="ticketMainDiv">
            <Button onClick={handleOpen}>Open modal</Button>
            <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >

                <Box 
                component="form" 
                sx={modalBox} 
                onSubmit={editingTicket ? handleUpdate : handleCreate}
                >
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                        sx={{ width: '300px' }}
                        label="Name"
                        variant="outlined"
                        value={newTicket.name}
                        onChange={(e) => setNewTicket({ ...newTicket, name: e.target.value })}
                        required
                        />
                        <TextField
                        sx={{ width: '300px' }}
                        label="Description"
                        variant="outlined"
                        value={newTicket.description}
                        onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                        required
                        />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                        sx={{ width: '300px' }}
                        label="Type"
                        variant="outlined"
                        value={newTicket.type}
                        onChange={(e) => setNewTicket({ ...newTicket, type: e.target.value })}
                        required
                        />
                        <TextField
                        sx={{ width: '300px' }}
                        label="Quantity"
                        variant="outlined"
                        type="number"
                        value={newTicket.quantity}
                        onChange={(e) => setNewTicket({ ...newTicket, quantity: parseInt(e.target.value) })}
                        required
                        />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                        sx={{ width: '300px' }}
                        label="Price"
                        variant="outlined"
                        type="number"
                        value={newTicket.price}
                        onChange={(e) => setNewTicket({ ...newTicket, price: parseInt(e.target.value) })}
                        required
                        />
                        <FormControlLabel
                        sx={{ width: '300px' }}
                        control={
                            <Checkbox
                            checked={newTicket.isAvailable}
                            onChange={(e) => setNewTicket({ ...newTicket, isAvailable: e.target.checked })}
                            />
                        }
                        label="Status?"
                        />
                    </Box>

                    <Button variant="contained" color="primary" type="submit">
                        {editingTicket ? 'Update Ticket' : 'Create Ticket'}
                    </Button>
                </Box>

            </Modal>

            {/* OLD CODE BELOW */}
            {/* 
            <div className='mainTicketDisplay'>
                <div className='ticketLabels'>
                    <p className='ticketId'>ID</p>
                    <p className='ticketName'>NAME</p>
                    <p className='ticketType'>TYPE</p>
                    <p className='ticketQuantity'>QUANTITY</p>
                    <p className='ticketPrice'>PRICE</p>
                    <p className='ticketAvailablility'>STATUS</p>
                    <p className='edit'></p>
                    <p className='delete'></p>
                </div>
                
                    {tickets.map(ticket => (
                        <li className='ticketDisplay' key={ticket.ticketId}>
                            <p className='ticketId'>{ticket.ticketId}</p>
                            <p className='ticketName'>{ticket.name}</p>
                            <p className='ticketType'>{ticket.type}</p>
                            <p className='tickerQuantity'>{ticket.quantity}</p>
                            <p className='ticketPrice'>{ticket.price}</p>
                            <p className={`ticketAvailability ${ticket.isAvailable ? 'available' : 'not-available'}`}>
                                {ticket.isAvailable ? 'open' : 'closed'}
                            </p>
                            <button className='edit' onClick={() => handleEdit(ticket)}>Edit</button>
                            <button className='delete' onClick={() => handleDelete(ticket.ticketId)}>Delete</button>
                        </li>
                    ))} 
            </div> */}

        </div>
    );
};

export default Ticket;
