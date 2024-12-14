import React, { useState, useEffect, useCallback } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from "@mui/material";
import VenueOptions from "../admin_pages/VenueOptions.jsx";

function ViewVenue({ refreshData, searchTerm }) {
    const [venues, setVenues] = useState([]);
    const [filteredVenues, setFilteredVenues] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const loadVenues = useCallback(async () => {
        try {
            if (refreshData) {
                const data = await refreshData();
                setVenues(data);
            }
        } catch (error) {
            console.error("Error loading venues:", error);
        }
    }, [refreshData]);

    useEffect(() => {
        loadVenues();
    }, [loadVenues]);

    useEffect(() => {
        const filteredData = searchTerm
            ? venues.filter((venue) =>
                venue.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : venues;
        setFilteredVenues(filteredData);
    }, [venues, searchTerm]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const rows = filteredVenues.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((v) => ({
        id: v.venueId,
        name: v.name,
        address: v.address,
        description: v.description,
        option: <VenueOptions venue={v} refreshData={refreshData} />
    }));

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 130 },
        { field: 'address', headerName: 'Address', width: 150 },
        { field: 'description', headerName: 'Description', sortable: false, width: 200 },
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
                                align="left"
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
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredVenues.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
}

export default ViewVenue;