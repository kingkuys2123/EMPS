import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  
import { Row, Col, Button } from 'antd';
import 'styles/venue.css';

function Update() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [venue, setVenue] = useState({ name: '', location: '', capacity: '' });
  const [venues, setVenues] = useState([]);
  const [selectedVenueId, setSelectedVenueId] = useState(null);
  
  const fetchVenues = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/venue/getAllVenue');
      const data = await response.json();
      setVenues(data);
    } catch (error) {
      console.error('Error fetching venues:', error);
    }
  };

  useEffect(() => {

    fetchVenues();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVenue({ ...venue, [name]: value });
  };

  const handleSelectVenue = (v) => {
    setSelectedVenueId(v.id); // Assuming the venue object has an 'id' property
    setVenue({ name: v.name, location: v.location, capacity: v.capacity });
  };

  const handleDelete = async (venueId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/venue/deleteVenueDetails/${venueId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Venue deleted successfully');
        setVenues(venues.filter(v => v.id !== venueId)); 
      } else {
        console.error('Failed to delete venue');
      }
    } catch (error) {
      console.error('Error deleting venue:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("Updated");
    console.log("Selected Venue ID:", selectedVenueId); 
    console.log("Venue Data:", venue); 
  
    if (venue.name && venue.location && venue.capacity) {
      try {
        const response = await fetch(`http://localhost:8080/api/venue/putVenueDetails?id=${selectedVenueId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(venue),
        });
  
        if (response.ok) {
          console.log('Venue updated successfully');
          await fetchVenues();
          navigate('/'); 
        } else {
          console.error('Failed to update venue');
        }
      } catch (error) {
        console.error('Error updating venue:', error);
      }
    } else {
      console.log('All fields are required');
    }
  };

  return (
    <div>
      <div className="sep">
      <form onSubmit={handleSubmit} className="venue-form">
          <div className="form-row">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={venue.name}
              onChange={handleChange}
            />
            <label>Capacity:</label>
            <input
              type="number"
              name="capacity"
              value={venue.capacity}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label>Location:</label>
            <input
              type="text"
              name="location"
              id="location"
              value={venue.location}
              onChange={handleChange}
            />
          </div>
          <button type="submit" disabled={!selectedVenueId}>Update Venue</button>
        </form>
      </div>

      <div className="sep">
        <h2>Venue List</h2>
        <div className="venue-list">
          <Row gutter={[20, 16]}>
            <Col span={4}>Select</Col>
            <Col span={6}>Name</Col>
            <Col span={6}>Location</Col>
            <Col span={4}>Capacity</Col>
            <Col span={4}>Actions</Col>
          </Row>
          
          {venues.map((v) => (
          <Row gutter={[20, 16]} key={v.id}>
          <Col span={4}>
            <input 
              type="radio" 
              checked={selectedVenueId === v.id} 
              onChange={() => handleSelectVenue(v)} 
            />
          </Col>
          <Col span={6}>{v.name}</Col>
          <Col span={6}>{v.location}</Col>
          <Col span={4}>{v.capacity}</Col>
          <Col span={4}><Button onClick={() => handleDelete(v.id)}>Delete</Button></Col>
        </Row>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Update;
