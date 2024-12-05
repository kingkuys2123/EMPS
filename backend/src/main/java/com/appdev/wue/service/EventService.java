package com.appdev.wue.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.appdev.wue.entity.EventEntity;
import com.appdev.wue.entity.VenueEntity;
import com.appdev.wue.repository.EventRepository;

import javax.naming.NameNotFoundException;

@Service
public class EventService {

    @Autowired
    private EventRepository eRepo;

    @Autowired
    private VenueService venueService;

    // Get Featured Events
    public List<EventEntity> getFeaturedEvents() {
        return eRepo.findTop4EventsOrderByBookingsDesc();
    }

    // Get Top 4 Upcoming Events In Random Order
    public List<EventEntity> getRandomUpcomingEvents() {
        return eRepo.getRandomUpcomingEvents();
    }

    // Create Event
    public EventEntity createEvent(EventEntity event) {
        event.setDateCreated(LocalDateTime.now());
        return eRepo.save(event);
    }

    // Update Event (PUT)
    @SuppressWarnings("finally")
    public EventEntity updateEvent(int id, EventEntity updatedEvent) {
        EventEntity existingEvent = new EventEntity();
        try {
            existingEvent = eRepo.findById(id).get();

            existingEvent.setName(updatedEvent.getName());
            existingEvent.setType(updatedEvent.getType());
            existingEvent.setDescription(updatedEvent.getDescription());
            existingEvent.setStartDatetime(updatedEvent.getStartDatetime());
            existingEvent.setEndDatetime(updatedEvent.getEndDatetime());
            existingEvent.setDateCreated(updatedEvent.getDateCreated());
            existingEvent.setEventStatus(updatedEvent.getEventStatus());
            existingEvent.setConfirmationStatus(updatedEvent.getConfirmationStatus());

            if (updatedEvent.getVenue() != null && updatedEvent.getVenue().getVenueId() != 0) {
                VenueEntity venue = venueService.getVenue(updatedEvent.getVenue().getVenueId());
                existingEvent.setVenue(venue);
            }

        } catch (Exception e) {
            throw new NameNotFoundException("Event with ID " + id + " not found!");
        } finally {
            return eRepo.save(existingEvent);
        }
    }

    // Get Event By Id
    public EventEntity getEvent(int id) {
        return eRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Event with ID " + id + " not found!"));
    }

    // Get All Events
    public List<EventEntity> getAllEvents() {
        return eRepo.findAll();
    }

    // Delete Event by Id
    public String deleteEvent(int id) {
        String msg;
        try {
            if (eRepo.existsById(id)) {
                eRepo.deleteById(id);
                msg = "Event deleted successfully!";
            } else {
                msg = "Event not found!";
            }
        } catch (Exception e) {
            msg = "Error occurred while deleting the event with ID " + id + ": " + e.getMessage();
        }
        return msg;
    }

}
