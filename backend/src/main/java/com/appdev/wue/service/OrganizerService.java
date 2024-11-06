package com.appdev.wue.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.appdev.wue.entity.OrganizerEntity;
import com.appdev.wue.repository.OrganizerRepository;

@Service
public class OrganizerService {
    private final OrganizerRepository organizerRepository;

    public OrganizerService(OrganizerRepository organizerRepository) {
        this.organizerRepository = organizerRepository;
    }

    public List<OrganizerEntity> getAllOrganizers() {
        return organizerRepository.findAll();
    }

    public OrganizerEntity getOrganizerById(int id) {
        return organizerRepository.findById(id).get();
    }

    public OrganizerEntity saveOrganizer(OrganizerEntity organizer) {
        return organizerRepository.save(organizer);
    }

    public OrganizerEntity updateOrganizer(int id, OrganizerEntity newOrganizer) {
        return organizerRepository.findById(id)
                .map(organizer -> {
                    organizer.setIsApproved(newOrganizer.isIsApproved());
                    organizer.setDatetimeApproved(newOrganizer.getDatetimeApproved());
                    return organizerRepository.save(organizer);
                })
                .orElseThrow(() -> new RuntimeException("Organizer not found with id " + id));
    }

    public String deleteOrganizer(int id) {
        String msg = "Id not found.";
        if(organizerRepository.findById(id) != null){
            organizerRepository.deleteById(id);
            msg = "Organizer deleted successfully";
        }
        return msg;
    }
}

