package com.appdev.wue.controller;

import com.appdev.wue.entity.BookingEntity;
import com.appdev.wue.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(method = RequestMethod.GET, path = "api/booking")
public class BookingController {
    @Autowired
    BookingService bServ;
    
    // Create Booking
    @PostMapping("/createBooking")
    public BookingEntity createUser(@RequestBody BookingEntity booking) {
        return bServ.createBooking(booking);
    }

    // Get All Booking
    @GetMapping("/getAllBookings")
    public List<BookingEntity> getAllUsers() {
        return bServ.getAllBookings();
    }

    // Get Booking By ID
    @GetMapping("/getBooking/{id}")
    public BookingEntity getUser(@PathVariable int id) {
        return bServ.getBooking(id);
    }

    // Update Booking By ID
    @PutMapping("/updateBooking")
    public BookingEntity updateUser(@RequestParam int id, @RequestBody BookingEntity updatedBooking) {
        return bServ.updateBooking(id, updatedBooking);
    }

    @PutMapping("/updateTicketQuantity/{id}")
    public BookingEntity updateTicketQuantity(@PathVariable int id) {
        return bServ.updateTicketQuantity(id);
    }

    @PutMapping("/updateStatus/{id}")
    public BookingEntity updateStatus(@PathVariable int id) {
        return bServ.acceptBookingStatus(id);
    }

    // Delete Booking By ID
    @DeleteMapping("/deleteBooking/{id}")
    public BookingEntity deleteBooking(@PathVariable int id) {
        return bServ.deleteBooking(id);
    }

    // get Paid Bookings by User ID
    @GetMapping("/getTransactionHistory/{id}")
    public List<BookingEntity> getTransactionHistory(@PathVariable int id) {
        return bServ.getTransactionHistory(id);
    }

    // Create Booking with userId and ticketId
    @PostMapping("/createBookingByUserAndTicket")
    public ResponseEntity<?> createBookingByUserAndTicket(@RequestParam int user_id, @RequestParam int ticket_id, @RequestBody BookingEntity booking) {
        try {
            BookingEntity createdBooking = bServ.createBookingByUserAndTicket(user_id, ticket_id, booking);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdBooking);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Get All User Bookings
    @GetMapping("/getAllUserBookings/{user_id}")
    public ResponseEntity<?> getAllUserBookings(@PathVariable int user_id) {
        try {
            List<BookingEntity> bookings = bServ.getAllUserBookings(user_id);
            return new ResponseEntity<>(bookings, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Pay Booking
    @PutMapping("/payBooking/{id}")
    public ResponseEntity<?> payBooking(@PathVariable int id) {
        try {
            BookingEntity paidBooking = bServ.payBooking(id);
            return ResponseEntity.ok(paidBooking);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/getTotalPaidPriceSumByEvent/{eventId}")
    public ResponseEntity<Double> getTotalPaidPriceSumByEvent(@PathVariable int eventId) {
        try {
            Double totalPaidPriceSum = bServ.getTotalPaidPriceSumByEvent(eventId);
            return new ResponseEntity<>(totalPaidPriceSum, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getTotalPaidTicketQuantitySumByEvent/{eventId}")
    public ResponseEntity<Integer> getTotalPaidTicketQuantitySumByEvent(@PathVariable int eventId) {
        try {
            Integer totalPaidTicketQuantitySum = bServ.getTotalPaidTicketQuantitySumByEvent(eventId);
            return new ResponseEntity<>(totalPaidTicketQuantitySum, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

}
