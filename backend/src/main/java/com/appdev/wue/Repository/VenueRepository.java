package com.appdev.wue.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.wue.Entity.VenueEntity;

@Repository
public interface VenueRepository extends JpaRepository<VenueEntity, Integer>{

}
