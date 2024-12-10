package com.appdev.wue.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.appdev.wue.entity.FeedbackEntity;

@Repository
public interface FeedbackRepository extends JpaRepository<FeedbackEntity, Integer>{

	@Query("SELECT f FROM FeedbackEntity f WHERE f.rating BETWEEN :minRating AND :maxRating")
    List<FeedbackEntity> getBadFeedback(@Param("minRating") double minRating, @Param("maxRating") double maxRating);
}
