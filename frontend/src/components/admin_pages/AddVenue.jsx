import React, { useState, useEffect } from "react";
import { Container, Box   } from "@mui/material";

import VenueService from '../../services/VenueService.jsx';
import "../styles/FontStyle.css";

function AddVenue({ onClose, refreshData }) {
    const [venue, setVenue] = useState({ name: '', address: '', capacity: '', description: '' });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVenue({ ...venue, [name]: value });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
    

        if (!venue.name || !venue.address || !venue.capacity) {
          setError("All fields are required.");
          console.error("Validation error: Missing fields", venue);
          return;
        }
    
        try {
            console.log("Submitting venue:", venue);
        const response = await VenueService.createVenue(venue);
            
          setVenue({ name: "", capacity: "", address: "", description: "" });
          refreshData(); 
          onClose();
        } catch (error) {
          console.error("Error submitting venue:", error);
          setError("Failed to add venue. Please try again.");
        }
      };

    const handleCancel = () => {
        onClose(); 
    };
    
  
    return (
        
            <Container className="con" maxWidth="sm">
                <Box className="mainBox">
                <h2>Add New Venue</h2>
                <form className="venue-form" onSubmit={handleSubmit}>
                <div className='form-row'>
                        <input
                        className='name'
                        placeholder='Name'
                        type="text"
                        name="name"
                          onChange={handleChange}
                        />
                        <input
                        className='capacity'
                        placeholder='Capacity'
                        type="number"
                        name="capacity"
                          onChange={handleChange}
                        />
                    
                        <input
                        className='address'
                        placeholder='Address'
                        type="text"
                        name="address"
                        id="address"
                          onChange={handleChange}
                        />
                    
                        <textarea
                        className="description"
                        placeholder="Description"
                        name="description"
                          onChange={handleChange}
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
