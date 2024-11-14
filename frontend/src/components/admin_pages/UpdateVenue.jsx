import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  
import { Container, Box } from "@mui/material";
import VenueService from '../../services/VenueService.jsx';
import './styles/venue.css';

function UpdateVenue({ venue, onClose }) {
    const [updatedVenue, setUpdatedVenue] = useState(venue);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedVenue((prevVenue) => ({ ...prevVenue, [name]: value }));
      };

      const handleCancel = () => {
        onClose(); 
    };

  return (
    <Container className="con" maxWidth="sm">
    <Box className="mainBox">
      <h2>Update {updatedVenue.name}</h2>
    <form className="venue-form">
      <div className='form-row'>
              <input
              className='name'
              placeholder='Name'
              type="text"
              name="name"
              value={updatedVenue.name}
            //   onChange={handleChange}
              />
              <input
              className='capacity'
              placeholder='Capacity'
              type="number"
              name="capacity"
              value={updatedVenue.capacity}
            //   onChange={handleChange}
              />
          
              <input
              className='address'
              placeholder='Address'
              type="text"
              name="address"
              id="address"
              value={updatedVenue.address}
            //   onChange={handleChange}
              />
          
              <textarea
              className="description"
              placeholder="Description"
              name="description"
              value={updatedVenue.description}
            //   onChange={handleChange}
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
