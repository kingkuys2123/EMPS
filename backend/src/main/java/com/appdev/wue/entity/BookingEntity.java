package com.appdev.wue.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "booking")
public class BookingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int booking_id;

    @Column(name = "date_time_booked")
    private LocalDateTime date_time_booked;

    @Column(name = "ticket_quantity")
    private int ticket_quantity;

    @Column(name = "total_price")
    private float total_price;

    @Column(name = "status")
    private String status;

    @Column(name = "is_paid")
    private boolean is_paid;

    @Column(name = "datetime_paid")
    private LocalDateTime datetime_paid;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private UserEntity user;

    public int getBookingID() {
        return booking_id;
    }

    public void setBookingID(int booking_id) {
        this.booking_id = booking_id;
    }

    public LocalDateTime getDateTimeBooked() {
        return date_time_booked;
    }

    public void setDateTimeBooked(LocalDateTime date_time_booked) {
        this.date_time_booked = date_time_booked;
    }

    public int getTicketQuantity() {
        return ticket_quantity;
    }

    public void setTicketQuantity(int tickets_quantity) {
        this.ticket_quantity = tickets_quantity;
    }

    public float getTotalPrice() {
        return total_price;
    }

    public void setTotalPrice(float total_price) {
        this.total_price = total_price;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean getIsPaid() {
        return is_paid;
    }

    public void setIsPaid(boolean is_paid) {
        this.is_paid = is_paid;
    }

    public LocalDateTime getDateTimePaid() {
        return datetime_paid;
    }

    public void setDateTimePaid(LocalDateTime datetime_paid) {
        this.datetime_paid = datetime_paid;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }
}
