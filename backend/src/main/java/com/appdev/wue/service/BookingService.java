package com.appdev.wue.service;

import com.appdev.wue.entity.BookingEntity;
import com.appdev.wue.entity.TicketEntity;
import com.appdev.wue.entity.UserEntity;
import com.appdev.wue.repository.BookingRepository;
import com.appdev.wue.repository.TicketRepository;

import com.appdev.wue.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.naming.NameNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bRepo;

    @Autowired
    private TicketRepository ticketRepo;

    @Autowired
    private UserRepository uRepo;

    @Autowired
    private TicketRepository tRepo;

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
        return bRepo.save(delete);
    }

    // get User Transaction History (Paid Bookings and not Deleted)
    public List<BookingEntity> getTransactionHistory(int id) {
        return bRepo.findAllTransactionHistory(id);
    }

    // Create Booking with userId and ticketId
    public BookingEntity createBookingByUserAndTicket(int user_id, int ticket_id, BookingEntity booking) {
        try {
            UserEntity user = uRepo.findById(user_id)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + user_id));
            TicketEntity ticket = tRepo.findById(ticket_id)
                    .orElseThrow(() -> new RuntimeException("Ticket not found with ID: " + ticket_id));

            booking.setUser(user);
            booking.setTicket(ticket);
            booking.setDateTimeBooked(LocalDateTime.now());
            booking.setIsPaid(false);
            booking.IsDeleted(0);
            booking.setStatus("Pending");
            return bRepo.save(booking);
        } catch (RuntimeException e) {
            throw new RuntimeException("Error creating booking: " + e.getMessage(), e);
        }
    }

    // Get All User Bookings
    public List<BookingEntity> getAllUserBookings(int user_id) {
        try {
            return bRepo.findAllBookingsByUserIdJoinedByTicketAndEvent(user_id);
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving bookings for user ID " + user_id + ": " + e.getMessage(), e);
        }
    }
    // Pay Booking
    public BookingEntity payBooking(int bookingId) {
        try {
            BookingEntity booking = bRepo.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

            booking.setIsPaid(true);
            booking.setDateTimePaid(LocalDateTime.now());
            booking.setStatus("Paid");

            return bRepo.save(booking);
        } catch (RuntimeException e) {
            throw new RuntimeException("Error processing payment for booking ID: " + bookingId, e);
        }
    }

}
