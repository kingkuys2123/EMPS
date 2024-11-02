import React, { useState, useEffect } from 'react';
import 'styles/venue.css';
import { Row, Col } from 'antd';

function Add() {
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
              const response = await fetch('http://localhost:8080/api/venue/postVenue', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(venue),
              });

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

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/venue/getAllVenue');
                const data = await response.json();
                setVenues(data);
            } catch (error) {
                console.error('Error fetching venues:', error);
            }
        };

        fetchVenues();
    }, []);

    return (
       <div className = "container">
        <div>
           <div className = "sep">
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
                id = "location"
                value={venue.location}
                onChange={handleChange}
            />
            </div>
            <button type="submit">Add Venue</button>
            </form>
            </div>

      <div className = "sep">
      <h2>Venue List</h2>
      <div className="venue-list">
        
          <Row gutter ={[24,16]}>
            <Col span = {8}>Name</Col>
            <Col span = {8}>Location</Col>
            <Col span = {8}>Capacity</Col>
          </Row>
       
        
          {venues.map((v, index) => (
              <Row gutter={[24, 16]} key={index}>
                 <Col span={8}>{v.name}</Col>
                 <Col span={8}>{v.location}</Col>
                <Col span={8}>{v.capacity}</Col>
              </Row>
          ))}
      </div>

      </div>
      </div>
      </div>
    );
}

export default Add;