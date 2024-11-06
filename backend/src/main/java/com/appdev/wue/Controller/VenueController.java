package com.appdev.wue.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.wue.Entity.VenueEntity;
import com.appdev.wue.Service.VenueService;

@RestController
@RequestMapping("/api/venue")
@CrossOrigin(origins = "http://localhost:3000")
public class VenueController {
    @Autowired
    private VenueService venueServ;


    @PostMapping("/postVenue")
    public VenueEntity postVenue(@RequestBody VenueEntity venue) {
        return venueServ.saveVenue(venue);
    }

  
    @GetMapping("/getAllVenue")
    public List<VenueEntity> getAllVenue() {
        return venueServ.getAllVenue();
    }
    
    @PutMapping("/putVenueDetails")
    public VenueEntity putVenueDetails(@RequestParam int id, 
    										@RequestBody VenueEntity newVenueDetails) {
        return venueServ.putVenueDetails(id, newVenueDetails);
    }
    
    @DeleteMapping("/deleteVenueDetails/{id}")
    public String deleteVenue(@PathVariable int id) {
    	return venueServ.deleteVenue(id);
    }
}
