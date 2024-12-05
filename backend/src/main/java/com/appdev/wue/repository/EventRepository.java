package com.appdev.wue.repository;

import com.appdev.wue.entity.EventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<EventEntity, Integer> {

    @Query(value = "SELECT e FROM EventEntity e LEFT JOIN e.tickets t LEFT JOIN t.bookings b GROUP BY e ORDER BY COUNT(b) DESC LIMIT 2")
    List<EventEntity> findTop4EventsOrderByBookingsDesc();

    @Query(value = "SELECT e FROM EventEntity e WHERE e.event_status = 'Upcoming' ORDER BY RAND() LIMIT 3")
    List<EventEntity> findTop3UpcomingEventsInRandomOrder();


}