package com.appdev.wue.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.wue.entity.TicketEntity;
import com.appdev.wue.repository.TicketRepository;

@Service
public class TicketService {

    @Autowired
    private TicketRepository tRepo;

    public TicketService(TicketRepository ticketRepository) {
        this.tRepo = ticketRepository;
    }

    public List<TicketEntity> getAllTickets() {
        return tRepo.findAll();
    }

    public TicketEntity getTicket(int id) {
        return tRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Ticket with ID " + id + " not found!"));
    }

    public TicketEntity createTicket(TicketEntity ticket) {
        return tRepo.save(ticket);
    }

    public TicketEntity updateTicket(int id, TicketEntity updatedTicket) {
        TicketEntity ticket;
        try {
            ticket = tRepo.findById(id).get();

            ticket.setName(updatedTicket.getName());
            ticket.setDescription(updatedTicket.getDescription());
            ticket.setType(updatedTicket.getType());
            ticket.setQuantity(updatedTicket.getQuantity());
            ticket.setIsAvailable(updatedTicket.getIsAvailable());
            ticket.setPrice(updatedTicket.getPrice());

            return tRepo.save(ticket);
        } catch (Exception e) {
            throw new RuntimeException("Error updating ticket with ID " + id + ": " + e.getMessage(), e);
        }
    }

    public String deleteTicket(int id) {
        String msg = "Ticket Invalid";
        if(tRepo.findById(id) != null){
            tRepo.deleteById(id);
            msg = "Ticket with id " + id + " is deleted successfully";
        }
        return msg;
    }
}

