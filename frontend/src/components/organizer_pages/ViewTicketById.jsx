import React, { useEffect, useState } from 'react';
import { getAuth } from '../../utils/AuthContext';
import TicketService from '../../services/TicketService';
import './styles/ViewTicket.css';

const ViewTicketById = () => {
    const { currentUser, setCurrentUser } = getAuth();
    const [ticket, setTicket] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const ticketId = 1; // Replace with the desired ID
                const data = await TicketService.getTicketById(ticketId);
                setTicket(data);
            } catch (err) {
                console.error("Failed to fetch ticket:", err);
                setError(err);
            }
        };

        fetchTicket();
    }, []);

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    if (!ticket) {
        return <div className="loading">Loading ticket...</div>;
    }

    return (
        <div className="mainTicketDisplay">
            <div className="ticketLabels">
                <p className="ticketId">ID</p>
                <p className="ticketName">NAME</p>
                <p className="ticketType">TYPE</p>
                <p className="ticketQuantity">QUANTITY</p>
                <p className="ticketPrice">PRICE</p>
                <p className="ticketAvailability">STATUS</p>
            </div>

            <li className="ticketDisplay" key={ticket.ticketId}>
                <p className="ticketId">{ticket.ticketId}</p>
                <p className="ticketName">{ticket.name}</p>
                <p className="ticketType">{ticket.type}</p>
                <p className="ticketQuantity">{ticket.quantity}</p>
                <p className="ticketPrice">{ticket.price}</p>
                <p
                    className={`ticketAvailability ${
                        ticket.isAvailable ? 'available' : 'not-available'
                    }`}
                >
                    {ticket.isAvailable ? 'open' : 'closed'}
                </p>
            </li>
        </div>
    );
};

export default ViewTicketById;
