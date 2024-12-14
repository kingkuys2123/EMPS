package com.appdev.wue.repository;

import com.appdev.wue.entity.EventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<EventEntity, Integer> {

    @Query(value = "SELECT e FROM EventEntity e LEFT JOIN e.tickets t LEFT JOIN t.bookings b WHERE LOWER(e.confirmation_status) = LOWER('confirmed') GROUP BY e ORDER BY COUNT(b) DESC LIMIT 2")
    List<EventEntity> findTop4EventsOrderByBookingsDesc();

    @Query(value = "SELECT e FROM EventEntity e WHERE e.event_status = 'Upcoming' AND LOWER(e.confirmation_status) = LOWER('confirmed') ORDER BY RAND() LIMIT 3")
    List<EventEntity> getRandomUpcomingEvents();

    @Query("SELECT e FROM EventEntity e JOIN e.organizer o WHERE o.organizer_id = :organizerId")
    List<EventEntity> findAllByOrganizerId(@Param("organizerId") int organizerId);

    @Query("SELECT e FROM EventEntity e WHERE LOWER(e.confirmation_status) = LOWER('confirmed')")
    List<EventEntity> findAllByConfirmationStatusConfirmed();

    @Query("SELECT e FROM EventEntity e JOIN e.organizer o JOIN o.user u WHERE LOWER(e.confirmation_status) = 'pending'")
    List<EventEntity> findAllByConfirmationStatusPending();

}