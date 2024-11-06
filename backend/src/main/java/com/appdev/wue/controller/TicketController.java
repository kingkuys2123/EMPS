package com.appdev.wue.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.wue.entity.TicketEntity;
import com.appdev.wue.service.TicketService;


@RestController
@RequestMapping("/api/tickets")
public class TicketController {
    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }
    
    @GetMapping("/getAll")
    public List<TicketEntity> getAllTickets() {
        return ticketService.getAllTickets();
    }

    @GetMapping("/getById/{id}")
    public TicketEntity getTicketById(@PathVariable int id) {
        return ticketService.getTicketById(id);
    }

    @PostMapping("/create")
    public TicketEntity createTicket(@RequestBody TicketEntity ticket) {
        return ticketService.saveTicket(ticket);
    }

    @PutMapping("/update/{id}")
    public TicketEntity updateTicket(@PathVariable int id, @RequestBody TicketEntity newTicket) {
        return ticketService.updateTicket(id, newTicket);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteTicket(@PathVariable int id) {
       return ticketService.deleteTicket(id);       
    }
}
    
