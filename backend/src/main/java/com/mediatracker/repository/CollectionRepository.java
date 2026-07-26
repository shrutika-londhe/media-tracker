package com.mediatracker.repository;

import com.mediatracker.entity.Collection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CollectionRepository extends JpaRepository<Collection, Long> {
    List<Collection> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);
}
