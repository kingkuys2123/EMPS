package com.appdev.wue.service;

import com.appdev.wue.entity.BookingEntity;
import com.appdev.wue.entity.TicketEntity;
import com.appdev.wue.repository.BookingRepository;
import com.appdev.wue.repository.TicketRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.naming.NameNotFoundException;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bRepo;
    @Autowired
    private TicketRepository ticketRepo;
    // Create Booking
    public BookingEntity createBooking(BookingEntity booking) {
        return bRepo.save(booking);
    }

    // Get All Bookings
    public List<BookingEntity> getAllBookings() {
        return bRepo.findAll();
    }

    // Get Booking By ID
    public BookingEntity getBooking(int id) {
        return bRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Booking with ID " + id + " not found!"));
    }

    // Update Booking By ID
    @SuppressWarnings("finally")
    public BookingEntity updateBooking(int id, BookingEntity updatedBooking) {
        BookingEntity booking = new BookingEntity();
        try {
            booking = bRepo.findById(id).get();

            booking.setDateTimeBooked(updatedBooking.getDateTimeBooked());
            booking.setTicketQuantity(updatedBooking.getTicketQuantity());
            booking.setTotalPrice(updatedBooking.getTotalPrice());
            booking.setStatus(updatedBooking.getStatus());
            booking.setIsPaid(updatedBooking.getIsPaid());
            booking.setDateTimePaid(updatedBooking.getDateTimePaid());
        } catch (Exception e) {
            throw new NameNotFoundException("Booking with ID " + id + " not found!");
        } finally {
            return bRepo.save(booking);
        }
    }
    public BookingEntity updateTicketQuantity(int bookingId) {
        BookingEntity booking = bRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));
        
        TicketEntity ticket = booking.getTicket();
        if (ticket == null) {
            throw new RuntimeException("Ticket not associated with this booking");
        }

        int currentQuantity = ticket.getQuantity();
        if (booking.getTicketQuantity() > currentQuantity) {
            throw new IllegalArgumentException("Not enough tickets available. Current stock: " + currentQuantity);
        }

        // Subtract ticket quantity from available quantity
        int updatedQuantity = currentQuantity - booking.getTicketQuantity();
        ticket.setQuantity(updatedQuantity);

        // Save the updated ticket entity
        ticketRepo.save(ticket);

        return booking;
    }
    public BookingEntity acceptBookingStatus(int bookingId) {
        BookingEntity booking = bRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));
        booking.setStatus("Confirmed");
        return bRepo.save(booking);
    }
    // Delete Booking By ID
    public BookingEntity deleteBooking(int id) {
        BookingEntity delete = bRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));
        delete.IsDeleted(1);
        delete.setStatus("Cancelled");
        return bRepo.save(delete);
    }
}
