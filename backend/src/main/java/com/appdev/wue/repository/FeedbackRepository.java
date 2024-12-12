package com.appdev.wue.repository;

import com.appdev.wue.entity.FeedbackEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<FeedbackEntity, Integer> {
    @Query("SELECT f FROM FeedbackEntity f WHERE f.user.user_id = :userId AND f.event.event_id = :eventId")
    List<FeedbackEntity> findByUserIdAndEventId(@Param("userId") int userId, @Param("eventId") int eventId);

    @Query("SELECT f FROM FeedbackEntity f JOIN f.user u WHERE f.event.event_id = :id")
    List<FeedbackEntity> findFeedbacksByEventIdWithUser(@Param("id") int id);
}