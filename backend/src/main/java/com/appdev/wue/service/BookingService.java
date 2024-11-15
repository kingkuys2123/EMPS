package com.appdev.wue.service;

import com.appdev.wue.entity.BookingEntity;
import com.appdev.wue.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.naming.NameNotFoundException;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bRepo;

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

    // Delete Booking By ID
    public String deleteBooking(int id) {
        String msg;
        if (bRepo.existsById(id)) {
            bRepo.deleteById(id);
            msg = "Booking with ID " + id + " deleted successfully!";
        } else {
            msg = "Booking with ID " + id + " not found!";
        }
        return msg;
    }
}
