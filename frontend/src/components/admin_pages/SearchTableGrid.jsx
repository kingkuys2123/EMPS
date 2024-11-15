
import React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

function SearchableDataGrid({ rows, columns, height = 400 }) {
    return (
        <Box sx={{ height: height, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                    toolbar: {
                        showQuickFilter: true, 
                    },
                }}
            />
        </Box>
    );
}

export default SearchableDataGrid;
