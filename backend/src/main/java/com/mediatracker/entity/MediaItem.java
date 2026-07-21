package com.mediatracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * A single tracked item — a book, manga volume, anime, drama, podcast, etc.
 * Progress fields are kept generic (current/total unit) so one entity can
 * cover pages, chapters, episodes, or listening hours depending on category.
 */
@Entity
@Table(name = "media_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MediaItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User owner;

    @NotBlank
    @Column(nullable = false)
    private String title;

    private String alternativeTitle;
    private String coverImageUrl;
    private String author;
    private String artist;
    private String director;
    private String studio;
    private String publisher;
    private String platform;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Status status = Status.PLANNED;

    @ElementCollection
    @CollectionTable(name = "media_item_genres", joinColumns = @JoinColumn(name = "media_item_id"))
    @Column(name = "genre")
    @Builder.Default
    private List<String> genres = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "media_item_tags", joinColumns = @JoinColumn(name = "media_item_id"))
    @Column(name = "tag")
    @Builder.Default
    private List<String> tags = new ArrayList<>();

    private String language;
    private String country;
    private Integer releaseYear;

    /** Public/critic rating, e.g. out of 10. */
    private Double rating;

    /** The user's own rating, e.g. out of 10. */
    private Double personalRating;

    @Column(length = 4000)
    private String review;

    @Column(length = 2000)
    private String notes;

    @Builder.Default
    private Boolean favorite = false;

    @Builder.Default
    private Integer repeatCount = 0;

    private Integer recommendationScore;

    // Progress tracking — generic current/total pair covers pages, chapters,
    // episodes, or hours depending on category. currentSeason is anime/TV-specific.
    private Integer currentProgress;
    private Integer totalProgress;
    private Integer currentSeason;

    private Instant startedAt;
    private Instant completedAt;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
