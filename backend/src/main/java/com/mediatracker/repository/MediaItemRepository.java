package com.mediatracker.repository;

import com.mediatracker.entity.MediaItem;
import com.mediatracker.entity.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MediaItemRepository extends JpaRepository<MediaItem, Long> {
    Page<MediaItem> findByOwnerId(Long ownerId, Pageable pageable);
    Page<MediaItem> findByOwnerIdAndStatus(Long ownerId, Status status, Pageable pageable);
    long countByOwnerIdAndStatus(Long ownerId, Status status);
}
