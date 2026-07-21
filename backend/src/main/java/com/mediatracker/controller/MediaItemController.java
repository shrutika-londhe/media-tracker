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

@RestController
@RequestMapping("/api/media-items")
@RequiredArgsConstructor
public class MediaItemController {

    private final MediaItemService mediaItemService;
    private final UserRepository userRepository;

    @GetMapping
    public Page<MediaItemDto> list(@RequestParam(required = false) Status status,
                                    Pageable pageable,
                                    Authentication authentication) {
        User user = currentUser(authentication);
        return mediaItemService.listForUser(user, status, pageable);
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
