package com.appdev.wue.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.wue.entity.VenueEntity;

@Repository
public interface VenueRepository extends JpaRepository<VenueEntity, Integer>{

}
