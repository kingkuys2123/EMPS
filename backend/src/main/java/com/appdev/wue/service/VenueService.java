package com.appdev.wue.service;

import java.util.List;
import java.util.NoSuchElementException;

import javax.naming.NameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.wue.entity.VenueEntity;
import com.appdev.wue.repository.VenueRepository;

@Service
public class VenueService {

    @Autowired
    private VenueRepository venueRepo;

	// Create Venue
    public VenueEntity createVenue(VenueEntity venue) {
        return venueRepo.save(venue);
    }

	// Get All Venues
    public List<VenueEntity> getAllVenues() {
        return venueRepo.findAll();
    }

	// Get Venue by Id
	public VenueEntity getVenue(int id) {
		return venueRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Venue with ID " + id + " not found!"));
	}

	// Delete Venue by Id
	public String deleteVenue(int id) {
		String msg = "";
		try {
			if (venueRepo.findById(id).isPresent()) {
				venueRepo.deleteById(id);
				msg = "Venue Record successfully deleted!";
			} else {
				msg = "Venue with ID " + id + " not found!";
			}
		} catch (Exception e) {
			msg = "An error occurred while trying to delete the venue: " + e.getMessage();
		}
		return msg;
	}

	// Update Venue by Id
	@SuppressWarnings("finally")
	public VenueEntity updateVenue(int id, VenueEntity updatedVenue) {
		VenueEntity venue = new VenueEntity();
		try {
			venue = venueRepo.findById(id).get();
			
			venue.setName(updatedVenue.getName());
			venue.setDescription(updatedVenue.getDescription());
			venue.setAddress(updatedVenue.getAddress());
			venue.setStatus(updatedVenue.getStatus());
			venue.setCapacity(updatedVenue.getCapacity());
			
		} catch(NoSuchElementException nex) {
			throw new NameNotFoundException ("Venue "+ id +" not found");
		}finally {
			return venueRepo.save(venue);
		}
		
	}
}
