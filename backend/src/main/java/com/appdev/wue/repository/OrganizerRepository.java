package com.appdev.wue.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.appdev.wue.entity.OrganizerEntity;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizerRepository extends JpaRepository<OrganizerEntity, Integer> {
    
}
