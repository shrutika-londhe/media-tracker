package com.mediatracker.repository;


import com.mediatracker.entity.Category;
import com.mediatracker.entity.MediaItem;
import com.mediatracker.entity.Status;
import org.springframework.data.jpa.domain.Specification;

/**
 * Composable predicate builders for searching/filtering MediaItem.
 * Each returns null when the corresponding filter isn't provided, so
 * Specification.where(...).and(...) chains cleanly skip absent filters.
 */
public final class MediaItemSpecifications {

    private MediaItemSpecifications() {
    }

    public static Specification<MediaItem> ownedBy(Long ownerId) {
        return (root, query, cb) -> cb.equal(root.get("owner").get("id"), ownerId);
    }

    public static Specification<MediaItem> hasStatus(Status status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<MediaItem> hasCategory(Category category) {
        return (root, query, cb) -> category == null ? null : cb.equal(root.get("category"), category);
    }

    public static Specification<MediaItem> isWishlist(Boolean wishlist) {
        return (root, query, cb) -> Boolean.TRUE.equals(wishlist) ? cb.isTrue(root.get("wishlist")) : null;
    }

    public static Specification<MediaItem> isFavorite(Boolean favorite) {
        return (root, query, cb) -> Boolean.TRUE.equals(favorite) ? cb.isTrue(root.get("favorite")) : null;
    }

    public static Specification<MediaItem> titleContains(String q) {
        return (root, query, cb) -> {
            if (q == null || q.isBlank()) return null;
            String like = "%" + q.trim().toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("title")), like),
                    cb.like(cb.lower(cb.coalesce(root.get("alternativeTitle"), "")), like)
            );
        };
    }

    public static Specification<MediaItem> hasGenre(String genre) {
        return (root, query, cb) -> {
            if (genre == null || genre.isBlank()) return null;
            query.distinct(true);
            return cb.equal(cb.lower(root.join("genres")), genre.trim().toLowerCase());
        };
    }
}