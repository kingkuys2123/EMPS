import React, { useState, useEffect } from 'react';
import { Container, Box  } from "@mui/material";
import VenueService from '../../services/VenueService.jsx';
import './styles/venue.css';

function UpdateVenue({ venue, onClose, setShowAlert }) {
    const [updatedVenue, setUpdatedVenue] = useState(venue);
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedVenue((prevVenue) => ({ ...prevVenue, [name]: value }));
      };

      const handleCancel = () => {
        onClose(); 
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (updatedVenue.name && updatedVenue.address && updatedVenue.capacity) {
        try {
          const response = await VenueService.updateVenue(updatedVenue.venueId, updatedVenue);
          onClose();
          setShowAlert(true); 
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        } catch (error) {
            console.error('Error updating venue:', error);
        }
      }
    };

  return (
    <Container className="con" maxWidth="sm">
    <Box className="mainBox">
      <h2>Update {venue.name}</h2>
    <form className="venue-form" onSubmit={handleSubmit}>
      <div className='form-row'>
              <input
              className='name'
              type="text"
              name="name"
              value={updatedVenue.name}
              onChange={handleChange}
              />
              <input
              className='capacity'
              type="number"
              name="capacity"
              value={updatedVenue.capacity}
              onChange={handleChange}
              />
          
              <input
              className='address'
              type="text"
              name="address"
              id="address"
              value={updatedVenue.address}
              onChange={handleChange}
              />
          
              <textarea
              className="description"
              name="description"
              value={updatedVenue.description}
              onChange={handleChange}
              />
          </div>
          <div className='buttons'>
          <button onClick={handleCancel}>Cancel</button>
          <button className='btn' type="submit">Update</button>
          </div>
      </form>
    </Box>

  </Container>
  );
}

export default UpdateVenue;
