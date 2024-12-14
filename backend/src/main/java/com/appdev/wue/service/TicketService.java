package com.appdev.wue.service;

import java.util.List;
import java.util.NoSuchElementException;

import com.appdev.wue.entity.EventEntity;
import com.appdev.wue.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.wue.entity.TicketEntity;
import com.appdev.wue.repository.TicketRepository;

@Service
public class TicketService {

    @Autowired
    private TicketRepository tRepo;

    @Autowired
    private EventRepository eRepo;

    public TicketService(TicketRepository ticketRepository) {
        this.tRepo = ticketRepository;
    }

    public List<TicketEntity> getAllTickets() {
        return tRepo.findAll();
    }

    public List<TicketEntity> getAllTicketsFromOrganizer(int id) {
        return tRepo.getAllTicketsFromOrganizer(id);
    }

    public List<TicketEntity> getAllTicketsFromOrganizerAndEvent(int organizerId, int eventId) {
        return tRepo.getAllTicketsFromOrganizerAndEvent(organizerId, eventId);
    }

    public TicketEntity getTicket(int id) {
        return tRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Ticket with ID " + id + " not found!"));
    }

    public TicketEntity createTicket(TicketEntity ticket) {
        if (ticket.getQuantity() <= 0) {
            ticket.setQuantity(1);
        }
        return tRepo.save(ticket);
    }

    public TicketEntity createTicketWithEvent(int eventId, TicketEntity ticket) {
        EventEntity event = eRepo.findById(eventId)
                .orElseThrow(() -> new NoSuchElementException("Event with ID " + eventId + " not found!"));
        ticket.setEvent(event);
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
        String msg;
        try {
            if (tRepo.existsById(id)) {
                tRepo.deleteById(id);
                msg = "Payment Details deleted successfully!";
            } else {
                msg = "Payment Details not found!";
            }
        } catch (Exception e) {
            msg = "Error occurred while deleting the payment details with ID " + id + ": " + e.getMessage();
        }
        return msg;
    }

    public List<TicketEntity> getTicketByEventId(int eventId) {
        try {
            return tRepo.findTicketsByEventId(eventId);
        } catch (Exception e) {
            throw new RuntimeException("Error finding tickets with event ID " + eventId + ": " + e.getMessage(), e);
        }
    }

    public int getRemainingTicketQuantity(int id) {
        try {
            return tRepo.getRemainingTicketQuantity(id);
        } catch (Exception e) {
            throw new RuntimeException("Error calculating remaining ticket quantity for ticket ID " + id + ": " + e.getMessage(), e);
        }
    }

}
