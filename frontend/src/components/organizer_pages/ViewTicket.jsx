import React, { useEffect, useState } from 'react';
import { getAuth } from '../../utils/AuthContext';
import TicketService from '../../services/TicketService';
import './styles/ViewTicket.css';

const ViewTicket = () => {
    const { currentUser, setCurrentUser } = getAuth();
    const [tickets, setTickets] = useState([]);
    useEffect(() => {
        const fetchTickets = async () => {
            const data = await TicketService.getAllTickets();
            setTickets(data);
        };

        fetchTickets();
    }, []);
    return (
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
                </li>
            ))}
        </div>
    )
}

export default ViewTicket;