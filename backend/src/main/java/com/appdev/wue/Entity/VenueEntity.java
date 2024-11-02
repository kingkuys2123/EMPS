package com.appdev.wue.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class VenueEntity {
    
	 @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private int venue_id;

     @Column(name = "name")
     private String name;

     @Column(name = "location")
     private String location;

     @Column(name = "capacity")
     private int capacity;
     
     @Column(name = "availability")
     private boolean availability = true;
     

     public VenueEntity() {}

     public VenueEntity(String name, String location, int capacity) {
         this.name = name;
         this.location = location;
         this.capacity = capacity;
     }


     public int getId() {
         return venue_id;
     }

     public String getName() {
         return name;
     }

     public void setName(String name) {
         this.name = name;
     }

     public String getLocation() {
         return location;
     }

     public void setLocation(String location) {
         this.location = location;
     }
     
     public int getCapacity() {
         return capacity;
     }

     public void setCapacity(int capacity) {
         this.capacity = capacity;
     }
     
     public boolean getAvailability() {
         return availability;
     }

     public void setAvailability(boolean availability) {
         this.availability = availability;
     }
     
}
