package com.appdev.wue.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.appdev.wue.entity.OrganizerEntity;
import com.appdev.wue.service.OrganizerService;

@RestController
@RequestMapping(method = RequestMethod.GET, path = "/api/organizer")
public class OrganizerController {

    @Autowired
    private OrganizerService oServ;

    // Get ALl Organizers
    @GetMapping("/getAllOrganizers")
    public List<OrganizerEntity> getAllOrganizers() {
        return oServ.getAllOrganizers();
    }

    // Get Organizer By Id
    @GetMapping("/getOrganizer/{id}")
    public OrganizerEntity getOrganizer(@PathVariable int id) {
        return oServ.getOrganizer(id);
    }

    // Create Organizer
    @PostMapping("/createOrganizer")
    public OrganizerEntity createOrganizer(@RequestBody OrganizerEntity organizer) {
        return oServ.createOrganizer(organizer);
    }

    // Update Organizer by Id
    @PutMapping("/updateOrganizer")
    public OrganizerEntity updateOrganizer(@RequestParam int id, @RequestBody OrganizerEntity organizer) {
        return oServ.updateOrganizer(id, organizer);
    }

    // Delete Organizer by Id
    @DeleteMapping("/deleteOrganizer/{id}")
    public String deleteOrganizer(@PathVariable int id) {
        return oServ.deleteOrganizer(id);
    }
}

