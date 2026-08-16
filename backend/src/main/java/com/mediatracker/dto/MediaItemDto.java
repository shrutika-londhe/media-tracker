package com.mediatracker.dto;

import com.mediatracker.entity.Category;
import com.mediatracker.entity.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class MediaItemDto {

    private Long id;

    @NotBlank
    private String title;

    private String alternativeTitle;
    private String coverImageUrl;
    private String author;
    private String artist;
    private String director;
    private String studio;
    private String publisher;
    private String platform;

    @NotNull
    private Category category;

    private Status status;

    private List<String> genres;
    private List<String> tags;

    private String language;
    private String country;
    private Integer releaseYear;

    private Double rating;
    private Double personalRating;
    private String review;
    private String notes;
    private Boolean favorite;
    private Boolean wishlist;
    private Integer repeatCount;
    private Integer recommendationScore;

    private Integer currentProgress;
    private Integer totalProgress;
    private Integer currentSeason;
}
