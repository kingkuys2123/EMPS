package com.appdev.wue.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.appdev.wue.entity.TicketEntity;
import com.appdev.wue.repository.TicketRepository;

@Service
public class TicketService {
    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public List<TicketEntity> getAllTickets() {
        return ticketRepository.findAll();
    }

    public TicketEntity getTicketById(int id) {
        return ticketRepository.findById(id).get();
    }

    public TicketEntity saveTicket(TicketEntity ticket) {
        return ticketRepository.save(ticket);
    }

    public TicketEntity updateTicket(int id, TicketEntity newTicket) {
        return ticketRepository.findById(id)
                .map(ticket -> {
                    ticket.setName(newTicket.getName());
                    ticket.setDescription(newTicket.getDescription());
                    ticket.setType(newTicket.getType());
                    ticket.setQuantity(newTicket.getQuantity());
                    ticket.setIsAvailable(newTicket.getIsAvailable());
                    ticket.setPrice(newTicket.getPrice());
                    return ticketRepository.save(ticket);
                })
                .orElseThrow(() -> new RuntimeException("Ticket not found with id " + id));
    }

    public String deleteTicket(int id) {
        String msg = "Ticket Invalid";
        if(ticketRepository.findById(id) != null){
            ticketRepository.deleteById(id);
            msg = "Ticket with id " + id + " is deleted successfully";
        }
        return msg;
    }
}

