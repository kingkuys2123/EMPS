package com.appdev.wue.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.appdev.wue.entity.EventEntity;
import com.appdev.wue.service.EventService;

@RestController
@RequestMapping(method = RequestMethod.GET, path = "/api/event")
public class EventController {
    @Autowired
    private EventService eServ;

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
    @GetMapping("/getEvent")
    public EventEntity getEvent(@RequestParam int id) {
        return eServ.getEvent(id);
    }

    // Delete Event by Id
    @DeleteMapping("/deleteEvent/{id}")
    public String deleteEvent(@PathVariable int id) {
        return eServ.deleteEvent(id);
    }
    
    @GetMapping("/getPendingEvents")
    public List<EventEntity> getPendingEvents() {
        return eServ.getPendingEvents();
    }
    
    @GetMapping("/getEventsByOrganizer")
    public List<EventEntity> getEventsByOrganizer(@RequestParam int id) {
    	return  eServ.getEventsByOrganizer(id);
    }

}
