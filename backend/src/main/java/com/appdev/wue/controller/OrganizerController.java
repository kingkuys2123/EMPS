package com.appdev.wue.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.appdev.wue.entity.OrganizerEntity;
import com.appdev.wue.service.OrganizerService;

import java.util.List;

@RestController
@RequestMapping("/api/organizer")
public class OrganizerController {

    @Autowired
    private OrganizerService oServ;

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
        OrganizerEntity createdOrganizer = oServ.createOrganizer(organizer);
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
}
