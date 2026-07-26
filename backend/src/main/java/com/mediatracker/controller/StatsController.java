package com.mediatracker.controller;

import com.mediatracker.dto.StatsDto;
import com.mediatracker.entity.User;
import com.mediatracker.repository.UserRepository;
import com.mediatracker.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final StatsService statsService;
    private final UserRepository userRepository;

    @GetMapping
    public StatsDto getStats(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found: " + authentication.getName()));
        return statsService.getStatsForUser(user);
    }
}
