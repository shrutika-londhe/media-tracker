package com.mediatracker.service;

import com.mediatracker.repository.MediaItemSpecifications;
import org.springframework.data.jpa.domain.Specification;
import com.mediatracker.dto.MediaItemDto;
import com.mediatracker.entity.MediaItem;
import com.mediatracker.entity.Status;
import com.mediatracker.entity.User;
import com.mediatracker.exception.ResourceNotFoundException;
import com.mediatracker.repository.MediaItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import com.mediatracker.entity.Category;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MediaItemService {

    private final MediaItemRepository mediaItemRepository;
    public Page<MediaItemDto> listForUser(User user, Status status, Boolean wishlistOnly, Pageable pageable) {
        return search(user, status, null, wishlistOnly, null, null, null, pageable);
    }

    public Page<MediaItemDto> search(User user, Status status, Category category, Boolean wishlist,
                                      Boolean favorite, String genre, String q, Pageable pageable) {
        Specification<MediaItem> spec = Specification.where(MediaItemSpecifications.ownedBy(user.getId()))
                .and(MediaItemSpecifications.hasStatus(status))
                .and(MediaItemSpecifications.hasCategory(category))
                .and(MediaItemSpecifications.isWishlist(wishlist))
                .and(MediaItemSpecifications.isFavorite(favorite))
                .and(MediaItemSpecifications.hasGenre(genre))
                .and(MediaItemSpecifications.titleContains(q));

        return mediaItemRepository.findAll(spec, pageable).map(this::toDto);
    }

    public List<MediaItemDto> exportAllForUser(User user) {
        return mediaItemRepository.findAllByOwnerId(user.getId()).stream()
                .map(this::toDto)
                .collect(java.util.stream.Collectors.toList());
    }
    
    public MediaItemDto getOneForUser(Long id, User user) {
        MediaItem item = findOwned(id, user);
        return toDto(item);
    }

    public MediaItemDto create(MediaItemDto dto, User user) {
        MediaItem item = new MediaItem();
        applyDto(item, dto);
        item.setOwner(user);
        return toDto(mediaItemRepository.save(item));
    }

    public MediaItemDto update(Long id, MediaItemDto dto, User user) {
        MediaItem item = findOwned(id, user);
        applyDto(item, dto);
        return toDto(mediaItemRepository.save(item));
    }

    public void delete(Long id, User user) {
        MediaItem item = findOwned(id, user);
        mediaItemRepository.delete(item);
    }

    private MediaItem findOwned(Long id, User user) {
        MediaItem item = mediaItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Media item " + id + " not found"));
        if (!item.getOwner().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Media item " + id + " not found");
        }
        return item;
    }

    private void applyDto(MediaItem item, MediaItemDto dto) {
        item.setTitle(dto.getTitle());
        item.setAlternativeTitle(dto.getAlternativeTitle());
        item.setCoverImageUrl(dto.getCoverImageUrl());
        item.setAuthor(dto.getAuthor());
        item.setArtist(dto.getArtist());
        item.setDirector(dto.getDirector());
        item.setStudio(dto.getStudio());
        item.setPublisher(dto.getPublisher());
        item.setPlatform(dto.getPlatform());
        item.setCategory(dto.getCategory());
        item.setStatus(dto.getStatus() != null ? dto.getStatus() : Status.PLANNED);
        item.setGenres(dto.getGenres() != null ? dto.getGenres() : new ArrayList<>());
        item.setTags(dto.getTags() != null ? dto.getTags() : new ArrayList<>());
        item.setLanguage(dto.getLanguage());
        item.setCountry(dto.getCountry());
        item.setReleaseYear(dto.getReleaseYear());
        item.setRating(dto.getRating());
        item.setPersonalRating(dto.getPersonalRating());
        item.setReview(dto.getReview());
        item.setNotes(dto.getNotes());
        item.setFavorite(dto.getFavorite() != null ? dto.getFavorite() : false);
        item.setWishlist(dto.getWishlist() != null ? dto.getWishlist() : false);
        item.setRepeatCount(dto.getRepeatCount() != null ? dto.getRepeatCount() : 0);
        item.setRecommendationScore(dto.getRecommendationScore());
        item.setCurrentProgress(dto.getCurrentProgress());
        item.setTotalProgress(dto.getTotalProgress());
        item.setCurrentSeason(dto.getCurrentSeason());
    }

    public MediaItemDto toDto(MediaItem item) {
        MediaItemDto dto = new MediaItemDto();
        dto.setId(item.getId());
        dto.setTitle(item.getTitle());
        dto.setAlternativeTitle(item.getAlternativeTitle());
        dto.setCoverImageUrl(item.getCoverImageUrl());
        dto.setAuthor(item.getAuthor());
        dto.setArtist(item.getArtist());
        dto.setDirector(item.getDirector());
        dto.setStudio(item.getStudio());
        dto.setPublisher(item.getPublisher());
        dto.setPlatform(item.getPlatform());
        dto.setCategory(item.getCategory());
        dto.setStatus(item.getStatus());
        dto.setGenres(item.getGenres());
        dto.setTags(item.getTags());
        dto.setLanguage(item.getLanguage());
        dto.setCountry(item.getCountry());
        dto.setReleaseYear(item.getReleaseYear());
        dto.setRating(item.getRating());
        dto.setPersonalRating(item.getPersonalRating());
        dto.setReview(item.getReview());
        dto.setNotes(item.getNotes());
        dto.setFavorite(item.getFavorite());
        dto.setWishlist(item.getWishlist());
        dto.setRepeatCount(item.getRepeatCount());
        dto.setRecommendationScore(item.getRecommendationScore());
        dto.setCurrentProgress(item.getCurrentProgress());
        dto.setTotalProgress(item.getTotalProgress());
        dto.setCurrentSeason(item.getCurrentSeason());
        return dto;
    }
}
