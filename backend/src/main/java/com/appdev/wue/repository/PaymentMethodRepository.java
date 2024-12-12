package com.appdev.wue.repository;

import com.appdev.wue.entity.PaymentMethodEntity;
import com.appdev.wue.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethodEntity, Integer> {
    Optional<PaymentMethodEntity> findByUser(UserEntity user);
}