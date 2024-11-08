package com.appdev.wue.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.appdev.wue.entity.VenueEntity;
import com.appdev.wue.service.VenueService;

@RestController
@RequestMapping(method = RequestMethod.GET, path = "/api/venue")
public class VenueController {

    @Autowired
    private VenueService venueServ;

    // Create Venue
    @PostMapping("/createVenue")
    public VenueEntity createVenue(@RequestBody VenueEntity venue) {
        return venueServ.createVenue(venue);
    }

    // Get All Venues
    @GetMapping("/getAllVenues")
    public List<VenueEntity> getAllVenues() {
        return venueServ.getAllVenues();
    }

    // Get Venue by ID
    @GetMapping("/getVenue/{id}")
    public VenueEntity getVenue(@PathVariable int id) {
        return venueServ.getVenue(id);
    }

    // Update Venue by Id
    @PutMapping("/updateVenue")
    public VenueEntity updateVenue(@RequestParam int id, @RequestBody VenueEntity updatedVenue) {
        return venueServ.updateVenue(id, updatedVenue);
    }

    // Delete Venue
    @DeleteMapping("/deleteVenue/{id}")
    public String deleteVenue(@PathVariable int id) {
    	return venueServ.deleteVenue(id);
    }
}
