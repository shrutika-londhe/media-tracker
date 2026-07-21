package com.mediatracker.entity;

/**
 * Built-in categories. Custom categories (user-defined) are a future
 * enhancement — see README "What's next". For now OTHER covers anything
 * not yet modeled explicitly.
 */
public enum Category {
    // Reading
    MANHWA, MANGA, MANHUA, BOOK_FICTION, BOOK_NON_FICTION, LIGHT_NOVEL, WEB_NOVEL, COMIC,
    // Watching
    K_DRAMA, C_DRAMA, J_DRAMA, MOVIE, ANIME, TV_SERIES, DOCUMENTARY,
    // Listening
    PODCAST, AUDIOBOOK, MUSIC_ALBUM,

    OTHER
}
