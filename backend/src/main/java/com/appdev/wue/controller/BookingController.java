package com.appdev.wue.controller;

import com.appdev.wue.entity.BookingEntity;
import com.appdev.wue.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public BookingEntity deleteUser(@PathVariable int id) {
        return bServ.deleteBooking(id);
    }

}
