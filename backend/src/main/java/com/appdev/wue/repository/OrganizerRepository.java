package com.appdev.wue.repository;

//import java.awt.print.Pageable;
import java.util.List;


import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.appdev.wue.entity.OrganizerEntity;

import org.springframework.stereotype.Repository;

@Repository
public interface OrganizerRepository extends JpaRepository<OrganizerEntity, Integer> {
	@Query("SELECT o FROM OrganizerEntity o " +
	           "JOIN o.events e " +
	           "JOIN e.tickets t " +
	           "GROUP BY o.id " +
	           "ORDER BY SUM(t.quantity) DESC")
	List<OrganizerEntity> findTopOrganizersByTicketCount(Pageable pageable);

}
