package com.appdev.wue.controller;

import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.appdev.wue.entity.EventEntity;
import com.appdev.wue.service.EventService;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(method = RequestMethod.GET, path = "/api/event")
public class EventController {
    @Autowired
    private EventService eServ;

    // Get Featured Events
    @GetMapping("/getFeaturedEvents")
    public List<EventEntity> getFeaturedEvents() {
        return eServ.getFeaturedEvents();
    }

    // Get Top 4 Upcoming Events In Random Order
    @GetMapping("/getRandomUpcomingEvents")
    public List<EventEntity> getRandomUpcomingEvents() {
        return eServ.getRandomUpcomingEvents();
    }

    // Create Event
    @PostMapping("/createEvent")
    public EventEntity createEvent(@RequestBody EventEntity event) {
        return eServ.createEvent(event);
    }

    // Update Event (PUT)
    @PutMapping("/updateEvent/{id}")
    public EventEntity updateEvent(@PathVariable int id, @RequestBody EventEntity updatedEvent) {
        return eServ.updateEvent(id, updatedEvent);
    }

    // Get All Events
    @GetMapping("/getAllEvents")
    public List<EventEntity> getAllEvents() {
        return eServ.getAllEvents();
    }

    // Get Event By Id
    @GetMapping("/getEvent/{id}")
    public EventEntity getEvent(@PathVariable int id) {
        return eServ.getEvent(id);
    }

    // Delete Event by Id
    @DeleteMapping("/deleteEvent/{id}")
    public String deleteEvent(@PathVariable int id) {
        return eServ.deleteEvent(id);
    }

    @GetMapping("/getEventsByOrganizer/{organizerId}")
    public List<EventEntity> getEventsByOrganizerId(@PathVariable int organizerId) {
        return eServ.getEventsByOrganizerId(organizerId);
    }

    @GetMapping("/getAllByConfirmationStatusConfirmed")
    public List<EventEntity> getAllByConfirmationStatusConfirmed() {
        return eServ.getAllByConfirmationStatusConfirmed();
    }

    // Upload Cover Photo
    @PostMapping("/uploadCoverPhoto")
    public ResponseEntity<?> uploadCoverPhoto(@RequestParam int userId, @RequestParam("file") MultipartFile file) {
        try {
            EventEntity event = eServ.uploadCoverPhoto(userId, file);
            return ResponseEntity.ok(event);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading profile picture: " + e.getMessage());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Get Cover Photo
    @GetMapping("/getCoverPhoto/{filename}")
    public ResponseEntity<Resource> getCoverPhoto(@PathVariable String filename) {
        try {
            Resource resource = eServ.getCoverPhoto(filename);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Delete Cover Photo
    @DeleteMapping("/deleteCoverPhoto/{id}")
    public ResponseEntity<?> deleteProfilePicture(@PathVariable int id) {
        try {
            String message = eServ.deleteCoverPhoto(id);
            return ResponseEntity.ok(message);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting profile picture: " + e.getMessage());
        }
    }

    // Create Event With Organizer ID
    @PostMapping("/createEventWithOrganizer/{organizerId}")
    public EventEntity createEventWithOrganizer(@PathVariable int organizerId, @RequestBody EventEntity event) {
        return eServ.createEventWithOrganizer(organizerId, event);
    }
}
