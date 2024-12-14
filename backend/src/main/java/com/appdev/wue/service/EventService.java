package com.appdev.wue.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

import com.appdev.wue.entity.OrganizerEntity;
import com.appdev.wue.entity.UserEntity;
import com.appdev.wue.repository.OrganizerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import com.appdev.wue.entity.EventEntity;
import com.appdev.wue.entity.VenueEntity;
import com.appdev.wue.repository.EventRepository;
import org.springframework.web.multipart.MultipartFile;

import javax.naming.NameNotFoundException;

@Service
public class EventService {

    @Autowired
    private EventRepository eRepo;

    @Autowired
    private VenueService venueService;

    @Value("${upload.dir}/event_cover_photos/")
    private String uploadDir;

    @Autowired
    private OrganizerRepository oRepo;

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

    public List<EventEntity> getEventsByOrganizerId(int organizerId) {
        return eRepo.findAllByOrganizerId(organizerId);
    }

    public List<EventEntity> getAllByConfirmationStatusConfirmed() {
        return eRepo.findAllByConfirmationStatusConfirmed();
    }

    // Upload Cover Photo
    public EventEntity uploadCoverPhoto(int id, MultipartFile file) throws IOException {
        EventEntity event = eRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Event with ID " + id + " not found!"));

        String originalFileName = file.getOriginalFilename();
        assert originalFileName != null;
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String fileName = id + "_cover_photo" + fileExtension;

        Path filePath = Paths.get(uploadDir + fileName);
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, file.getBytes());

        event.setCoverPhoto(fileName);
        return eRepo.save(event);
    }

    // Get Cover Photo
    public Resource getCoverPhoto(String filename) throws IOException {
        Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists()) {
            return resource;
        } else {
            throw new NoSuchElementException("Cover photo not found");
        }
    }

    // Delete Cover Photo
    public String deleteCoverPhoto(int id) throws IOException {
        EventEntity event = eRepo.findById(id).orElseThrow(() -> new NoSuchElementException("User with ID " + id + " not found!"));

        String coverPhoto = event.getCoverPhoto();
        if (coverPhoto == null) {
            throw new NoSuchElementException("Cover Photo not found for event with ID " + id);
        }

        Path filePath = Paths.get(uploadDir).resolve(coverPhoto).normalize();
        Files.deleteIfExists(filePath);

        event.setCoverPhoto(null);
        eRepo.save(event);

        return "Cover Photo  deleted successfully!";
    }

    // Create Even with Organizer ID
    public EventEntity createEventWithOrganizer(int organizerId, EventEntity event) {
        OrganizerEntity organizer = oRepo.findById(organizerId).orElseThrow(() -> new NoSuchElementException("Organizer with ID " + organizerId + " not found!"));
        event.setOrganizer(organizer);
        event.setDateCreated(LocalDateTime.now());
        return eRepo.save(event);
    }
}
