package com.appdev.wue.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "venue")
public class   VenueEntity {
    
	 @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private int venue_id;

     @Column(name = "name")
     private String name;

    @Column(name = "description")
    private String description;

     @Column(name = "address")
     private String address;

     @Column(name = "capacity")
     private int capacity;
     
     @Column(name = "status")
     private String status;

     @OneToOne(mappedBy = "venue")
     @JsonIgnore
     private EventEntity event;

    public int getVenueId() {
        return venue_id;
    }

    public void setVenueId(int venue_id) {
        this.venue_id = venue_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public EventEntity getEvent() {
        return event;
    }

    public void setEvent(EventEntity event) {
        this.event = event;
    }
}
