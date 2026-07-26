package com.mediatracker.controller;

import com.mediatracker.dto.CollectionDetailDto;
import com.mediatracker.dto.CollectionRequest;
import com.mediatracker.dto.CollectionSummaryDto;
import com.mediatracker.entity.User;
import com.mediatracker.repository.UserRepository;
import com.mediatracker.service.CollectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collections")
@RequiredArgsConstructor
public class CollectionController {

    private final CollectionService collectionService;
    private final UserRepository userRepository;

    @GetMapping
    public List<CollectionSummaryDto> list(Authentication authentication) {
        return collectionService.listForUser(currentUser(authentication));
    }

    @GetMapping("/{id}")
    public CollectionDetailDto getOne(@PathVariable Long id, Authentication authentication) {
        return collectionService.getOneForUser(id, currentUser(authentication));
    }

    @PostMapping
    public ResponseEntity<CollectionDetailDto> create(@Valid @RequestBody CollectionRequest request,
                                                        Authentication authentication) {
        CollectionDetailDto created = collectionService.create(request.getName(), currentUser(authentication));
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    public CollectionDetailDto rename(@PathVariable Long id,
                                       @Valid @RequestBody CollectionRequest request,
                                       Authentication authentication) {
        return collectionService.rename(id, request.getName(), currentUser(authentication));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        collectionService.delete(id, currentUser(authentication));
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/items/{itemId}")
    public CollectionDetailDto addItem(@PathVariable Long id, @PathVariable Long itemId, Authentication authentication) {
        return collectionService.addItem(id, itemId, currentUser(authentication));
    }

    @DeleteMapping("/{id}/items/{itemId}")
    public CollectionDetailDto removeItem(@PathVariable Long id, @PathVariable Long itemId, Authentication authentication) {
        return collectionService.removeItem(id, itemId, currentUser(authentication));
    }

    private User currentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found: " + email));
    }
}
