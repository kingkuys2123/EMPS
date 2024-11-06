package com.appdev.wue.controller;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.appdev.wue.entity.EventEntity;
import com.appdev.wue.service.EventService;

@RestController
@RequestMapping("/api/events")
public class EventController {
    @Autowired
    private EventService eventService;

    @PostMapping("/postEvents")
    public ResponseEntity<EventEntity> createEvent(@RequestBody EventEntity event) {
        EventEntity createdEvent = eventService.createEvent(event);
        return ResponseEntity.created(URI.create("/api/events/" + createdEvent.getEventId())).body(createdEvent);
    }

    @PutMapping("/putEvents/{eventId}")
    public ResponseEntity<EventEntity> updateEvent(@PathVariable Long eventId, @RequestBody EventEntity updatedEvent) {
        EventEntity updatedEvents = eventService.updateEvent(eventId, updatedEvent);
        return ResponseEntity.ok(updatedEvents);
    }

    @GetMapping("/getAllEvents")
    public ResponseEntity<List<EventEntity>> getAllEvents() {
        List<EventEntity> event = eventService.getAllEvents();
        return ResponseEntity.ok(event);
    }

    @GetMapping("/getEvents/{eventId}")
    public ResponseEntity<EventEntity> viewEvent(@PathVariable Long eventId) {
        EventEntity event = eventService.viewEvent(eventId);
        return ResponseEntity.ok(event);
    }

    @DeleteMapping("/deleteEvents/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
        eventService.deleteEvent(eventId);
        return ResponseEntity.noContent().build();
    }
}
