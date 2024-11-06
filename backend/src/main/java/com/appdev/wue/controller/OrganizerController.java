package com.appdev.wue.controller;

import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.wue.entity.OrganizerEntity;
import com.appdev.wue.service.OrganizerService;

@RestController
@RequestMapping("/api/organizers")
public class OrganizerController {
    private final OrganizerService organizerService;

    public OrganizerController(OrganizerService organizerService) {
        this.organizerService = organizerService;
    }

    @GetMapping("/getAll")
    public List<OrganizerEntity> getAllOrganizers() {
        return organizerService.getAllOrganizers();
    }

    @GetMapping("/getById/{id}")
    public OrganizerEntity getOrganizerById(@PathVariable int id) {
        return organizerService.getOrganizerById(id);
    }

    @PostMapping("/create")
    public OrganizerEntity createOrganizer(@RequestBody OrganizerEntity organizer) {
        return organizerService.saveOrganizer(organizer);
    }

    @PutMapping("/update/{id}")
    public OrganizerEntity updateOrganizer(@PathVariable int id, @RequestBody OrganizerEntity organizer) {
        return organizerService.updateOrganizer(id, organizer);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteOrganizer(@PathVariable int id) {
        return organizerService.deleteOrganizer(id);    
    }
}

