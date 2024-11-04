import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function NotFoundPage() {
    return (
        <div className="not-found-page">
            <Box sx={{ backgroundColor: '#CFCFC4', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Container sx={{ textAlign: 'center', backgroundColor: '#F3F3F3', height: '750px', width: '750px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
                    <Box>
                        <img src="/assets/images/page-404-not-found.png" alt="Not Found" style={{ maxWidth: '100%', maxHeight: '100%', marginBottom: '20px' }}/>
                    </Box>
                    <Typography variant="h6" sx={{ marginBottom: '20px', color: '#000000' }}>
                        <span>Page does not exist...</span>
                    </Typography>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Button variant="contained" sx={{ borderRadius: '4px', backgroundColor: '#C63f47', color: '#FFFFFF', '&:hover': { backgroundColor: '#B0353F' }}}>
                            <span>Return</span>
                        </Button>
                    </Link>
                </Container>
            </Box>
        </div>
    );
}

export default NotFoundPage;
