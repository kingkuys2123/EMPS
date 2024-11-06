package com.appdev.wue.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.appdev.wue.entity.OrganizerEntity;

public interface OrganizerRepository extends JpaRepository<OrganizerEntity, Integer> {
    
}
