package com.appdev.wue.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
    public String deleteTicket(@PathVariable int id) {
       return tServ.deleteTicket(id);
    }
}
    
