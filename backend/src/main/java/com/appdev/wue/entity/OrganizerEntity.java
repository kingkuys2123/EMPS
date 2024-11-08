package com.appdev.wue.entity;

import java.util.Date;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "organizer")
public class OrganizerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int organizer_id;

    @Column(name = "approval_status")
    private String approval_status;

    @Column(name = "datetime_approved")
    private Date datetime_approved;

    @OneToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "organizer", cascade = CascadeType.ALL)
    private List<EventEntity> events;

    // Getters and setters

    public int getOrganizerId() {
        return organizer_id;
    }

    public void setOrganizerId(int organizer_id) {
        this.organizer_id = organizer_id;
    }

    public String getApprovalStatus() {
        return approval_status;
    }

    public void setApprovalStatus(String approval_status) {
        this.approval_status = approval_status;
    }

    public Date getDateTimeApproved() {
        return datetime_approved;
    }

    public void setDateTimeApproved(Date datetime_approved) {
        this.datetime_approved = datetime_approved;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public List<EventEntity> getEvents() {
        return events;
    }

    public void setEvents(List<EventEntity> events) {
        this.events = events;
    }
}

