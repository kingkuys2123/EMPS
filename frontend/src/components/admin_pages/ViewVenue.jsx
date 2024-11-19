import React, { useState, useEffect } from 'react';
import { Table,TableHead, TableRow, TableCell,TableBody } from "@mui/material";
import VenueService from '../../services/VenueService.jsx';
import VenueOptions from "../admin_pages/VenueOptions.jsx";

function ViewVenue() {
    const [venue, setVenue] = useState({ name: '', location: '', capacity: '' });
    const [venues, setVenues] = useState([]);

    const loadVenues = async () => {
        try {
            const data = await VenueService.getAllVenue();
            setVenues(data);
        } catch (error) {
        }
    };

    useEffect(() => {

        loadVenues();
    }, []);

   const refreshData = loadVenues;

    const rows = venues.map((v) => ({
        id: v.venueId,
        name: v.name,
        address: v.address,
        capacity: v.capacity,
        description: v.description,
        option: <VenueOptions venue={v} refreshData={refreshData}/>
    }));

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 130 },
        { field: 'address', headerName: 'Address', width: 150 },
        {field: 'capacity',headerName: 'Capacity',type: 'number',width: 90,},
        {field: 'description',headerName: 'Description',sortable: false,width: 200,},
        { field: 'option', headerName: '', width: 70 },
    ];
  
  return (
    <div>
      <Table>
        <TableHead>
            <TableRow>
                {columns.map((column) => (
                    <TableCell
                        key={column.field}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                    >
                    {column.headerName}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
        <TableBody>
            {rows.map((row) => (
                <TableRow key={row.id}>
                    {columns.map((column) => (
                    <TableCell key={column.field} align="left">
                        {row[column.field]}
                    </TableCell>
                    ))}
                </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ViewVenue;
