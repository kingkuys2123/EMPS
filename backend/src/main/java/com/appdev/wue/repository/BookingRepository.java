package com.appdev.wue.repository;

import com.appdev.wue.entity.BookingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<BookingEntity, Integer> {

    @Query("SELECT b FROM BookingEntity b WHERE b.is_paid = true AND b.isDeleted = 0 AND b.user.user_id = :id")
    List<BookingEntity> findAllTransactionHistory(@Param("id") int id);

    @Query("SELECT b FROM BookingEntity b " +
            "JOIN b.ticket t " +
            "JOIN t.event e " +
            "WHERE b.user.user_id = :userId")
    List<BookingEntity> findAllBookingsByUserIdJoinedByTicketAndEvent(@Param("userId") int userId);
}