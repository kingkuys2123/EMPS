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

}