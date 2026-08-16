package com.mediatracker.controller;

import com.mediatracker.dto.MediaItemDto;
import com.mediatracker.entity.Status;
import com.mediatracker.entity.User;
import com.mediatracker.repository.UserRepository;
import com.mediatracker.service.MediaItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.mediatracker.entity.Category;
import com.mediatracker.util.CsvExporter;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.List;

@RestController
@RequestMapping("/api/media-items")
@RequiredArgsConstructor
public class MediaItemController {

    private final MediaItemService mediaItemService;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

@GetMapping
public Page<MediaItemDto> list(@RequestParam(required = false) Status status,
                                @RequestParam(required = false) Category category,
                                @RequestParam(required = false) Boolean wishlist,
                                @RequestParam(required = false) Boolean favorite,
                                @RequestParam(required = false) String genre,
                                @RequestParam(required = false) String q,
                                Pageable pageable,
                                Authentication authentication) {
    User user = currentUser(authentication);
    return mediaItemService.search(user, status, category, wishlist, favorite, genre, q, pageable);
}
    @GetMapping("/{id}")
    public MediaItemDto getOne(@PathVariable Long id, Authentication authentication) {
        return mediaItemService.getOneForUser(id, currentUser(authentication));
    }

    @PostMapping
    public ResponseEntity<MediaItemDto> create(@Valid @RequestBody MediaItemDto dto, Authentication authentication) {
        MediaItemDto created = mediaItemService.create(dto, currentUser(authentication));
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    public MediaItemDto update(@PathVariable Long id, @Valid @RequestBody MediaItemDto dto, Authentication authentication) {
        return mediaItemService.update(id, dto, currentUser(authentication));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        mediaItemService.delete(id, currentUser(authentication));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/export/csv")
    public ResponseEntity<String> exportCsv(Authentication authentication) {
        List<MediaItemDto> items = mediaItemService.exportAllForUser(currentUser(authentication));
        String csv = CsvExporter.toCsv(items);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=media-tracker-export.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }

    @GetMapping("/export/json")
    public ResponseEntity<String> exportJson(Authentication authentication) throws com.fasterxml.jackson.core.JsonProcessingException {
        List<MediaItemDto> items = mediaItemService.exportAllForUser(currentUser(authentication));
        String json = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(items);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=media-tracker-export.json")
                .contentType(MediaType.APPLICATION_JSON)
                .body(json);
    }
    /**
     * The JWT filter authenticates by email (Spring's UserDetails "username").
     * Look the full User entity up once per request to get the numeric id.
     * A future refinement is a custom Authentication principal that carries
     * the id directly and avoids this extra lookup.
     */
    
    private User currentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found: " + email));
    }


}
