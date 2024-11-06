package com.appdev.wue.entity;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "organizers")
public class OrganizerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int organizerId;

    private boolean isApproved;
    private Date datetimeApproved;

    // Getters and setters

    public int getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(int organizerId) {
        this.organizerId = organizerId;
    }

    public boolean isIsApproved() {
        return isApproved;
    }

    public void setIsApproved(boolean isApproved) {
        this.isApproved = isApproved;
    }

    public Date getDatetimeApproved() {
        return datetimeApproved;
    }

    public void setDatetimeApproved(Date datetimeApproved) {
        this.datetimeApproved = datetimeApproved;
    }
}

