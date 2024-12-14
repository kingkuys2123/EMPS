import React, { useState, useEffect } from "react";
import { Container, Box } from "@mui/material";

import VenueService from '../../services/VenueService.jsx';
import "../styles/FontStyle.css";

function AddVenue({ onClose, refreshData }) {
    const [venue, setVenue] = useState({ name: '', address: '', description: '' });
    const [error, setError] = useState("");
    const [touched, setTouched] = useState({
        name: false,
        address: false,
        description: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVenue({ ...venue, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setTouched({
            name: true,
            address: true,
            description: true,
        });

        if (!venue.name || !venue.address || !venue.description) {
            setError("All fields are required.");
            console.error("Validation error: Missing fields", venue);
            return;
        }

        try {
            const response = await VenueService.createVenue(venue);

            setVenue({ name: "", address: "", description: "" });
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

    const getInputStyle = (fieldName) => {
        if (touched[fieldName] && !venue[fieldName]) {
            return { borderColor: "red" };
        }
        return {};
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
                            style={getInputStyle("name")}
                        />
                        <input
                            className='address'
                            placeholder='Address'
                            type="text"
                            name="address"
                            id="address"
                            onChange={handleChange}
                            style={getInputStyle("address")}
                        />
                        <textarea
                            className="description"
                            placeholder="Description"
                            name="description"
                            onChange={handleChange}
                            style={getInputStyle("description")}
                        />
                    </div>
                    <div className='buttons'>
                        <button onClick={handleCancel}>Cancel</button>
                        <button className='btn' type="submit">Add</button>
                    </div>
                </form>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </Box>
        </Container>
    );
}

export default AddVenue;