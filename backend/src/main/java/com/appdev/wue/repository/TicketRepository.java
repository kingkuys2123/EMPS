package com.appdev.wue.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.appdev.wue.entity.TicketEntity;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<TicketEntity, Integer> {
    @Query("SELECT t FROM TicketEntity t JOIN t.event e JOIN e.organizer o WHERE o.organizer_id = :id")
    List<TicketEntity> getAllTicketsFromOrganizer(@Param("id") int id);

    @Query("SELECT t FROM TicketEntity t JOIN t.event e JOIN e.organizer o WHERE o.organizer_id = :id")
    List<TicketEntity> getAllTicketsFromOrganizer(@Param("id") int id);

    @Query("SELECT t FROM TicketEntity t WHERE t.event.event_id = :id")
    List<TicketEntity> findTicketsByEventId(@Param("id") int id);

    @Query("SELECT t.quantity - COALESCE(SUM(b.ticket_quantity), 0) AS remainingQuantity " +
            "FROM TicketEntity t LEFT JOIN BookingEntity b ON t.ticketId = b.ticket.ticketId " +
            "WHERE t.ticketId = :id")
    Integer getRemainingTicketQuantity(@Param("id") int id);
}