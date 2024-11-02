package com.appdev.wue.Service;

import java.util.List;
import java.util.NoSuchElementException;

import javax.naming.NameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.wue.Entity.VenueEntity;
import com.appdev.wue.Repository.VenueRepository;

@Service
public class VenueService {

    @Autowired
    private VenueRepository venueRepo;


    public VenueEntity saveVenue(VenueEntity venue) {
        return venueRepo.save(venue);
    }


    public List<VenueEntity> getAllVenue() {
        return venueRepo.findAll();
    }
    
    public String deleteVenue(int id) {
    	String msg = "";
    	if (venueRepo.findById(id).isPresent()) {    
    		venueRepo.deleteById(id);
    		return msg = "Venue Record successfully deleted!";
    	}else {
    		msg = id + "NOT found!";
    	return msg;
    	}
    	
    }


	@SuppressWarnings("finally")
	public VenueEntity putVenueDetails(int id, VenueEntity newVenueDetails) {
		VenueEntity venue = new VenueEntity();
		try {
			venue = venueRepo.findById(id).get();
			
			venue.setName(newVenueDetails.getName());
			venue.setLocation(newVenueDetails.getLocation());
			venue.setAvailability(newVenueDetails.getAvailability());
			venue.setCapacity(newVenueDetails.getCapacity());
			
		} catch(NoSuchElementException nex) {
			throw new NameNotFoundException ("Venue "+ id +" not found");
		}finally {
			return venueRepo.save(venue);
		}
		
	}
}
