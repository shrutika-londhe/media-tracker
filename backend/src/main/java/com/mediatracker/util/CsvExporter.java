package com.mediatracker.util;

import com.mediatracker.dto.MediaItemDto;

import java.util.List;

public final class CsvExporter {

    private static final String[] HEADERS = {
            "Title", "Alternative Title", "Category", "Status", "Genres", "Tags",
            "Author", "Artist", "Director", "Studio", "Publisher", "Platform",
            "Language", "Country", "Release Year", "Rating", "Personal Rating",
            "Current Progress", "Total Progress", "Favorite", "Wishlist", "Notes", "Review"
    };

    private CsvExporter() {
    }

    public static String toCsv(List<MediaItemDto> items) {
        StringBuilder sb = new StringBuilder();
        sb.append(String.join(",", HEADERS)).append("\n");
        for (MediaItemDto item : items) {
            sb.append(row(item)).append("\n");
        }
        return sb.toString();
    }

    private static String row(MediaItemDto item) {
        return String.join(",",
                escape(item.getTitle()),
                escape(item.getAlternativeTitle()),
                escape(item.getCategory() != null ? item.getCategory().name() : ""),
                escape(item.getStatus() != null ? item.getStatus().name() : ""),
                escape(join(item.getGenres())),
                escape(join(item.getTags())),
                escape(item.getAuthor()),
                escape(item.getArtist()),
                escape(item.getDirector()),
                escape(item.getStudio()),
                escape(item.getPublisher()),
                escape(item.getPlatform()),
                escape(item.getLanguage()),
                escape(item.getCountry()),
                escape(item.getReleaseYear() != null ? item.getReleaseYear().toString() : ""),
                escape(item.getRating() != null ? item.getRating().toString() : ""),
                escape(item.getPersonalRating() != null ? item.getPersonalRating().toString() : ""),
                escape(item.getCurrentProgress() != null ? item.getCurrentProgress().toString() : ""),
                escape(item.getTotalProgress() != null ? item.getTotalProgress().toString() : ""),
                escape(Boolean.TRUE.equals(item.getFavorite()) ? "Yes" : "No"),
                escape(Boolean.TRUE.equals(item.getWishlist()) ? "Yes" : "No"),
                escape(item.getNotes()),
                escape(item.getReview())
        );
    }

    private static String join(List<String> values) {
        return values == null ? "" : String.join("; ", values);
    }

    private static String escape(String value) {
        if (value == null) return "";
        boolean needsQuoting = value.contains(",") || value.contains("\"") || value.contains("\n");
        String escaped = value.replace("\"", "\"\"");
        return needsQuoting ? "\"" + escaped + "\"" : escaped;
    }
}