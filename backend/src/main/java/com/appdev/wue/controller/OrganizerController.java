package com.appdev.wue.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.wue.entity.OrganizerEntity;
import com.appdev.wue.entity.UserEntity;
import com.appdev.wue.service.OrganizerService;
import com.appdev.wue.service.UserService;


@RestController
@RequestMapping("/api/organizer")
public class OrganizerController {

    @Autowired
    private OrganizerService oServ;
    private final UserService uServ;

    public OrganizerController(UserService uServ) {
        this.uServ = uServ;
    }


    // Get All Organizers
    @GetMapping("/getAllOrganizers")
    public List<OrganizerEntity> getAllOrganizers() {
        return oServ.getAllOrganizers();
    }

    // Get Organizer By Id
    @GetMapping("/getOrganizer/{id}")
    public ResponseEntity<OrganizerEntity> getOrganizer(@PathVariable int id) {
        OrganizerEntity organizer = oServ.getOrganizer(id);
        return new ResponseEntity<>(organizer, HttpStatus.OK);
    }

    // Create Organizer
    @PostMapping("/createOrganizer")
    public ResponseEntity<OrganizerEntity> createOrganizer(@RequestBody OrganizerEntity organizer) {
    	UserEntity user = uServ.getUser(organizer.getUser().getUserID());
    	organizer.setUser(user);
    	OrganizerEntity createdOrganizer = oServ.createOrganizer(organizer);
        return new ResponseEntity<>(createdOrganizer, HttpStatus.CREATED);
    }

    // Create Organizer with user id
    @PostMapping("/createOrganizerWithUser")
    public ResponseEntity<OrganizerEntity> createOrganizerWithUser(@RequestBody OrganizerEntity organizer, @RequestParam int userId) {
        OrganizerEntity createdOrganizer = oServ.createOrganizerWithUserId(organizer,userId);
        return new ResponseEntity<>(createdOrganizer, HttpStatus.CREATED);
    }

    // Update Organizer by Id
    @PutMapping("/updateOrganizer")
    public ResponseEntity<OrganizerEntity> updateOrganizer(@RequestParam int id, @RequestBody OrganizerEntity organizer) {
        OrganizerEntity updatedOrganizer = oServ.updateOrganizer(id, organizer);
        return new ResponseEntity<>(updatedOrganizer, HttpStatus.OK);
    }

    // Delete Organizer by Id
    @DeleteMapping("/deleteOrganizer/{id}")
    public ResponseEntity<String> deleteOrganizer(@PathVariable int id) {
        String result = oServ.deleteOrganizer(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    //AddOrganizer
    @PostMapping("/addOrganizer")
    public ResponseEntity<?> addOrganizer(@RequestBody OrganizerEntity organizer){
        try{
            OrganizerEntity newOrganizer = oServ.addOrganizer(organizer);

            return ResponseEntity.ok(newOrganizer);
        }
        catch(RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

   @GetMapping("/getDummyData")
   public ResponseEntity<List<Map<String, Object>>> getDummyData() {
       List<Map<String, Object>> dummyOrganizers = new ArrayList<>();

       // Create first dummy organizer
       Map<String, Object> organizer1 = new HashMap<>();
       organizer1.put("organizerId", 1);
       organizer1.put("organizerName", "John Doe");
       organizer1.put("rating", 4.8);
       organizer1.put("eventCount", 2);
       organizer1.put("events", Arrays.asList(
           Map.of("eventId", 1, "eventName", "Summer Festival 2024", "attendees", 500),
           Map.of("eventId", 2, "eventName", "Tech Conference 2024", "attendees", 300)
       ));
       dummyOrganizers.add(organizer1);

       // Create second dummy organizer
       Map<String, Object> organizer2 = new HashMap<>();
       organizer2.put("organizerId", 2);
       organizer2.put("organizerName", "Jane Smith");
       organizer2.put("rating", 4.9);
       organizer2.put("eventCount", 2);
       organizer2.put("events", Arrays.asList(
           Map.of("eventId", 3, "eventName", "Music Festival 2024", "attendees", 1000),
           Map.of("eventId", 4, "eventName", "Food & Wine Expo", "attendees", 750)
       ));
       dummyOrganizers.add(organizer2);

       return ResponseEntity.ok(dummyOrganizers);
   }

    @GetMapping("/getOrganizerWithUser/{id}")
    public ResponseEntity<OrganizerEntity> getOrganizerWithUser(@PathVariable int id) {
        try {
            OrganizerEntity organizer = oServ.getOrganizerWithUser(id);
            return new ResponseEntity<>(organizer, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/applyForOrganizer")
    public ResponseEntity<?> applyForOrganizer(@RequestBody OrganizerEntity organizer, @RequestParam int userId) {
        try {
            OrganizerEntity newOrganizer = oServ.applyForOrganizer(organizer, userId);
            return ResponseEntity.ok(newOrganizer);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/approvedOrganizers")
    public ResponseEntity<List<OrganizerEntity>> getApprovedOrganizers() {
        List<OrganizerEntity> approvedOrganizers = oServ.findApprovedOrganizers();
        return new ResponseEntity<>(approvedOrganizers, HttpStatus.OK);
    }

}
