package com.mediatracker.repository;

import com.mediatracker.entity.MediaItem;
import com.mediatracker.entity.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MediaItemRepository extends JpaRepository<MediaItem, Long> {
    Page<MediaItem> findByOwnerId(Long ownerId, Pageable pageable);
    List<MediaItem> findAllByOwnerId(Long ownerId);
    Page<MediaItem> findByOwnerIdAndStatus(Long ownerId, Status status, Pageable pageable);
    Page<MediaItem> findByOwnerIdAndWishlistTrue(Long ownerId, Pageable pageable);
    long countByOwnerIdAndStatus(Long ownerId, Status status);
    List<MediaItem> findAllByIdInAndOwnerId(List<Long> ids, Long ownerId);
}
