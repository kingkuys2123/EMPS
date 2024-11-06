package com.appdev.wue.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.appdev.wue.entity.EventEntity;
import com.appdev.wue.repository.EventRepo;

@Service
public class EventService {
    @Autowired
    private EventRepo eventRepository;

    public EventEntity createEvent(EventEntity event) {
        return eventRepository.save(event);
    }

    public EventEntity updateEvent(Long eventId, EventEntity updatedEvent) {
        EventEntity existingEvent = eventRepository.findById(eventId).orElseThrow();
        existingEvent.setName(updatedEvent.getName());
        existingEvent.setType(updatedEvent.getType());
        existingEvent.setDescription(updatedEvent.getDescription());
        existingEvent.setStartDateTime(updatedEvent.getStartDateTime());
        existingEvent.setEndDateTime(updatedEvent.getEndDateTime());
        existingEvent.setDateCreated(updatedEvent.getDateCreated());
        existingEvent.setEventStatus(updatedEvent.getEventStatus());
        existingEvent.setConfirmation(updatedEvent.getConfirmation());
        return eventRepository.save(existingEvent);
    }

    public EventEntity viewEvent(Long eventId) {
        return eventRepository.findById(eventId).orElseThrow();
    }

    public List<EventEntity> getAllEvents() {
        return eventRepository.findAll();
    }

    public void deleteEvent(Long eventId) {
        eventRepository.deleteById(eventId);
    }
}
