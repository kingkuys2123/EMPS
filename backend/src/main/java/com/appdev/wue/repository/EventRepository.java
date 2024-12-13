package com.appdev.wue.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.appdev.wue.entity.EventEntity;

@Repository
public interface EventRepository extends JpaRepository<EventEntity, Integer >{
	
	@Query("SELECT e FROM EventEntity e WHERE e.confirmation_status = :status")
	List<EventEntity> findByStatus(@Param("status") String status);
	
	 @Query("SELECT e FROM EventEntity e WHERE e.organizer.organizer_id = :organizer_id")
	 List<EventEntity> findByOrganizerId(@Param("organizer_id") int organizer_id);
}
