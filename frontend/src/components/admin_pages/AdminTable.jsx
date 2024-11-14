import React from 'react';
import { Box, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

const AdminTable = ({ rows, columns, onEditClick, onDeleteClick }) => {
    // Ensure rows have unique ids if not already present
    const rowsWithIds = rows.map((row, index) => ({
        id: row.id || index,  // Use `userID` if available, otherwise fall back to `index`
        ...row,  // Spread other row properties
    }));

    const handleEdit = (params) => {
        if (onEditClick) onEditClick(params.row);
    };

    const handleDelete = (userID) => {
        if (onDeleteClick) onDeleteClick(userID);
    };

    return (
        <Box sx={{ padding: "0px" }}>
            <Paper sx={{ height: '550px', width: '100%' }}>
                <DataGrid
                    rows={rowsWithIds} // Pass rows with unique id
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10]}
                    checkboxSelection
                    sx={{ border: 0 }}
                    components={{
                        Toolbar: null,
                    }}
                    disableColumnResize
                    getRowId={(row) => row.id}  // Use id field as the unique identifier
                />
            </Paper>
        </Box>
    );
};

export default AdminTable;
