package com.appdev.wue.service;

import com.appdev.wue.entity.BookingEntity;
import com.appdev.wue.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.naming.NameNotFoundException;
import java.util.List;

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
        return bRepo.findById(id).orElse(null);
    }

    // Update Booking By ID
    public BookingEntity updateBooking(int id, BookingEntity newBookingrDetails) {
        BookingEntity booking = new BookingEntity();
        try {
            booking = bRepo.findById(id).get();

            booking.setDateTimeBooked(newBookingrDetails.getDateTimeBooked());
            booking.setTicketQuantity(newBookingrDetails.getTicketQuantity());
            booking.setTotalPrice(newBookingrDetails.getTotalPrice());
            booking.setStatus(newBookingrDetails.getStatus());
            booking.setIsPaid(newBookingrDetails.getIsPaid());
            booking.setDateTimePaid(newBookingrDetails.getDateTimePaid());
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
