package com.appdev.wue.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "event")
public class EventEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int event_id;

    @Column(name = "name")
    private String name;

    @Column(name = "type")
    private String type;

    @Column(name = "description")
    private String description;

    @Column(name = "start_datetime")
    @JsonProperty("startDateTime")
    private LocalDateTime start_datetime;

    @Column(name = "end_datetime")
    @JsonProperty("endDateTime")
    private LocalDateTime end_datetime;

    @Column(name = "date_created")
    private LocalDateTime date_created;

    @Column(name = "event_status")
    @JsonProperty("eventStatus")
    private String event_status;

    @Column(name = "cover_photo")
    private String cover_photo;

    @Column(name = "confirmation_status")
    @JsonProperty("confirmationStatus")
    private String confirmation_status;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "event", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<TicketEntity> tickets;

    @ManyToOne
    @JoinColumn(name = "organizer_id")
    private OrganizerEntity organizer;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "event", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<FeedbackEntity> feedbacks;

    @ManyToOne
    @JoinColumn(name = "venue_id")
    private VenueEntity venue;

    public int getEventId() {
        return event_id;
    }

    public void setEventId(int eventId) {
        this.event_id = eventId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getStartDatetime() {
        return start_datetime;
    }

    public void setStartDatetime(LocalDateTime startDateTime) {
        this.start_datetime = startDateTime;
    }

    public LocalDateTime getEndDatetime() {
        return end_datetime;
    }

    public void setEndDatetime(LocalDateTime endDateTime) {
        this.end_datetime = endDateTime;
    }

    public LocalDateTime getDateCreated() {
        return date_created;
    }

    public void setDateCreated(LocalDateTime dateCreated) {
        this.date_created = dateCreated;
    }

    public String getEventStatus() {
        return event_status;
    }

    public void setEventStatus(String eventStatus) {
        this.event_status = eventStatus;
    }

    public String getConfirmationStatus() {
        return confirmation_status;
    }

    public void setConfirmationStatus(String confirmation) {
        this.confirmation_status = confirmation;
    }

    public List<TicketEntity> getTickets() {
        return tickets;
    }

    public void setTickets(List<TicketEntity> tickets) {
        this.tickets = tickets;
    }

    public OrganizerEntity getOrganizer() {
        return organizer;
    }

    public void setOrganizer(OrganizerEntity organizer) {
        this.organizer = organizer;
    }

    public List<FeedbackEntity> getFeedbacks() {
        return feedbacks;
    }

    public void setFeedbacks(List<FeedbackEntity> feedbacks) {
        this.feedbacks = feedbacks;
    }

    public VenueEntity getVenue() {
        return venue;
    }

    public void setVenue(VenueEntity venue) {
        this.venue = venue;
    }

    public String getCoverPhoto() {
        return cover_photo;
    }

    public void setCoverPhoto(String cover_photo) {
        this.cover_photo = cover_photo;
    }
}