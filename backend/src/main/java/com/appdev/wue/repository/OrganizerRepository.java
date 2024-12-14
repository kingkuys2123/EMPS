package com.appdev.wue.repository;

import com.appdev.wue.entity.OrganizerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrganizerRepository extends JpaRepository<OrganizerEntity, Integer> {

    @Query("SELECT o FROM OrganizerEntity o JOIN o.user u WHERE u.user_id = :id")
    OrganizerEntity findOrganizerWithUserByUserId(@Param("id") int id);

    @Query("SELECT o FROM OrganizerEntity o JOIN o.user u WHERE o.approval_status = 'Approved' AND u.account_type = 'organizer'")
    List<OrganizerEntity> findApprovedOrganizers();

}