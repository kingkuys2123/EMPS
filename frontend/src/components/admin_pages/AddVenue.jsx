import React, { useState, useEffect } from "react";
import { Container, Box   } from "@mui/material";

import VenueService from '../../services/VenueService.jsx';
import "../styles/FontStyle.css";

function AddVenue({ onClose }) {
    const [venue, setVenue] = useState({ name: '', location: '', capacity: '' });
    const [venues, setVenues] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVenue({ ...venue, [name]: value });
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (venue.name && venue.location && venue.capacity) {
            try {
                const response = VenueService.createVenue(venue);
  
                if (response.ok) {
                    const newVenue = await response.json();
                    setVenues([...venues, newVenue]); 
                    setVenue({ name: '', location: '', capacity: '' }); 
                } else {
                    console.error('Failed to add venue');
                }
            } catch (error) {
                console.error('Error submitting venue:', error);
            }
        }
    };

    const handleCancel = () => {
        onClose(); 
    };
    
  
    return (
        
            <Container className="con" maxWidth="sm">
                <Box className="mainBox">
                <h2>Add New Venue</h2>
                <form className="venue-form">
                <div className='form-row'>
                        <input
                        className='name'
                        placeholder='Name'
                        type="text"
                        name="name"
                        //   onChange={handleChange}
                        />
                        <input
                        className='capacity'
                        placeholder='Capacity'
                        type="number"
                        name="capacity"
                        //   onChange={handleChange}
                        />
                    
                        <input
                        className='address'
                        placeholder='Address'
                        type="text"
                        name="address"
                        id="address"
                        //   onChange={handleChange}
                        />
                    
                        <textarea
                        className="description"
                        placeholder="Description"
                        name="description"
                        //   onChange={handleChange}
                        />
                    </div>
                    <div className='buttons'>
                    <button onClick={handleCancel}>Cancel</button>
                    <button className='btn' type="submit">Add</button>
                    </div>
                </form>
                </Box>

            </Container>
      
    );
}

export default AddVenue;
