package com.appdev.wue.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.appdev.wue.entity.TicketEntity;
import com.appdev.wue.service.TicketService;

@RestController
@RequestMapping(method = RequestMethod.GET, path = "/api/ticket")
public class TicketController {

    @Autowired
    private TicketService tServ;

    // Get All Tickets
    @GetMapping("/getAllTickets")
    public List<TicketEntity> getAllTickets() {
        return tServ.getAllTickets();
    }

    // Get Ticket By Id
    @GetMapping("/getTicket/{id}")
    public TicketEntity getTicket(@PathVariable int id) {
        return tServ.getTicket(id);
    }
    @GetMapping("/getAllTicketsFromOrganizer/{id}")
    public List<TicketEntity> getAllTicketsFromOrganizer(@PathVariable int id) {
        return tServ.getAllTicketsFromOrganizer(id);
    }
    // Create Ticket
    @PostMapping("/createTicket")
    public TicketEntity createTicket(@RequestBody TicketEntity ticket) {
        return tServ.createTicket(ticket);
    }

    // Update Ticket
    @PutMapping("/updateTicket")
    public TicketEntity updateTicket(@RequestParam int id, @RequestBody TicketEntity updatedTicket) {
        return tServ.updateTicket(id, updatedTicket);
    }
    // Dalete Ticket
    @DeleteMapping("/deleteTicket/{id}")
    public TicketEntity deleteTicket(@PathVariable int id) {
        return tServ.deleteTicket(id);
    }

    // Get all Tickets from Organizer
    @GetMapping("/getAllTicketsFromOrganizer/{id}")
    public List<TicketEntity> getAllTicketsFromOrganizer(@PathVariable int id) {
        return tServ.getAllTicketsFromOrganizer(id);
    }

    // Get Tickets By Event Id
    @GetMapping("/getTicketsByEventId/{id}")
    public ResponseEntity<List<TicketEntity>> getTicketsByEventId(@PathVariable int id) {
        try {
            List<TicketEntity> tickets = tServ.getTicketByEventId(id);
            return new ResponseEntity<>(tickets, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // Get Remaining Ticket Quantity
    @GetMapping("/getRemainingTicketQuantity/{id}")
    public ResponseEntity<Map<String, Integer>> getRemainingTicketQuantity(@PathVariable int id) {
        try {
            int remainingQuantity = tServ.getRemainingTicketQuantity(id);
            Map<String, Integer> response = new HashMap<>();
            response.put("remainingQuantity", remainingQuantity);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

}
