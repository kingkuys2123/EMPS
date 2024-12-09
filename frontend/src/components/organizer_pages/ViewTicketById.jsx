import React, { useEffect, useState } from 'react';
import DataTable from '../../components/DataTableComponent'; // Assuming DataTable component is in the same directory
import TicketService from '../../services/TicketService'; // Make sure this service is correct
import { getAuth } from '../../utils/AuthContext';
import { Button } from '@mui/material';

const ViewTicketById = () => {
    const { currentUser } = getAuth();
    const [rows, setRows] = useState([]);
    const [columns] = useState([
        { field: 'ticketId', headerName: 'ID', width: 40 },
        { field: 'name', headerName: 'Ticket Name', width: 200, display: 'flex', flex: 1 },
        { field: 'type', headerName: 'Type', width: 150, display: 'flex', flex: 1 },
        { field: 'quantity', headerName: 'Quantity', width: 150 },
        { field: 'price', headerName: 'Price', width: 150 },
        {
            field: 'status', 
            headerName: 'Status', 
            display: 'flex',
            flex: 1,
            width: 150, 
            renderCell: (params) => (
                <span>{params.row.isAvailable ? 'Open' : 'Closed'}</span>
            )
        }
    ]);

    const fetchTickets = async () => {
        try {
            const data = await TicketService.getTicketById(currentUser.userID);  // Replace 1 with actual ID if needed
            setRows(data);  // Assuming `data` is an array of ticket objects
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    useEffect(() => {
        console.log("Columns:", columns);
        console.log("Rows:", rows);
    }, [columns, rows]);
    
    useEffect(() => {
        fetchTickets();

    }, []);

    return (
        <div>
            <DataTable 
                rows={rows} 
                columns={columns} 
                boxPadding="20px" 
                checkBox={false}
            />
        </div>
    );
};

export default ViewTicketById;
