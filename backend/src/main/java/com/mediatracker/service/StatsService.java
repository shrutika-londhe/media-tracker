package com.mediatracker.service;

import com.mediatracker.dto.DayCountDto;
import com.mediatracker.dto.GenreCountDto;
import com.mediatracker.dto.MonthCountDto;
import com.mediatracker.dto.StatsDto;
import com.mediatracker.entity.Category;
import com.mediatracker.entity.MediaItem;
import com.mediatracker.entity.Status;
import com.mediatracker.entity.User;
import com.mediatracker.repository.MediaItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatsService {

    private static final ZoneId ZONE = ZoneId.systemDefault();
    private static final DateTimeFormatter MONTH_FMT = DateTimeFormatter.ofPattern("yyyy-MM");
    /** Width of the activity heatmap, in days (12 weeks). */
    private static final int HEATMAP_DAYS = 84;

    private final MediaItemRepository mediaItemRepository;

    public StatsDto getStatsForUser(User user) {
        List<MediaItem> items = mediaItemRepository.findAllByOwnerId(user.getId());

        Map<Status, Long> statusCounts = items.stream()
                .collect(Collectors.groupingBy(MediaItem::getStatus, Collectors.counting()));

        Map<Category, Long> categoryCounts = items.stream()
                .collect(Collectors.groupingBy(MediaItem::getCategory, Collectors.counting()));

        List<MonthCountDto> monthlyCompletions = computeMonthlyCompletions(items);
        List<DayCountDto> dailyActivity = computeDailyActivity(items);
        List<GenreCountDto> topGenres = computeTopGenres(items);

        List<LocalDate> activeDates = dailyActivity.stream()
                .filter(d -> d.getCount() > 0)
                .map(d -> LocalDate.parse(d.getDate()))
                .sorted()
                .collect(Collectors.toList());

        return StatsDto.builder()
                .totalItems(items.size())
                .statusCounts(statusCounts)
                .categoryCounts(categoryCounts)
                .monthlyCompletions(monthlyCompletions)
                .dailyActivity(dailyActivity)
                .topGenres(topGenres)
                .currentStreak(computeCurrentStreak(activeDates))
                .longestStreak(computeLongestStreak(activeDates))
                .build();
    }

    private List<MonthCountDto> computeMonthlyCompletions(List<MediaItem> items) {
        YearMonth now = YearMonth.now(ZONE);

        Map<String, Long> completed = items.stream()
                .filter(i -> i.getStatus() == Status.COMPLETED && i.getUpdatedAt() != null)
                .map(i -> YearMonth.from(i.getUpdatedAt().atZone(ZONE)).format(MONTH_FMT))
                .collect(Collectors.groupingBy(m -> m, Collectors.counting()));

        List<MonthCountDto> result = new ArrayList<>();
        for (int i = 11; i >= 0; i--) {
            String key = now.minusMonths(i).format(MONTH_FMT);
            result.add(MonthCountDto.builder().month(key).count(completed.getOrDefault(key, 0L)).build());
        }
        return result;
    }

    private List<DayCountDto> computeDailyActivity(List<MediaItem> items) {
        LocalDate today = LocalDate.now(ZONE);
        LocalDate start = today.minusDays(HEATMAP_DAYS - 1);

        Map<LocalDate, Long> activity = items.stream()
                .filter(i -> i.getUpdatedAt() != null)
                .map(i -> i.getUpdatedAt().atZone(ZONE).toLocalDate())
                .filter(d -> !d.isBefore(start) && !d.isAfter(today))
                .collect(Collectors.groupingBy(d -> d, Collectors.counting()));

        List<DayCountDto> result = new ArrayList<>();
        for (LocalDate d = start; !d.isAfter(today); d = d.plusDays(1)) {
            result.add(DayCountDto.builder().date(d.toString()).count(activity.getOrDefault(d, 0L)).build());
        }
        return result;
    }

    private List<GenreCountDto> computeTopGenres(List<MediaItem> items) {
        Map<String, Long> counts = new HashMap<>();
        for (MediaItem item : items) {
            if (item.getGenres() == null) continue;
            for (String genre : item.getGenres()) {
                if (genre == null || genre.isBlank()) continue;
                counts.merge(genre, 1L, Long::sum);
            }
        }
        return counts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> GenreCountDto.builder().genre(e.getKey()).count(e.getValue()).build())
                .collect(Collectors.toList());
    }

    /** Consecutive days of activity counting back from today (or yesterday, if nothing happened yet today). */
    private int computeCurrentStreak(List<LocalDate> sortedActiveDates) {
        if (sortedActiveDates.isEmpty()) return 0;
        java.util.Set<LocalDate> set = new java.util.HashSet<>(sortedActiveDates);
        LocalDate today = LocalDate.now(ZONE);
        LocalDate cursor = set.contains(today) ? today : today.minusDays(1);
        int streak = 0;
        while (set.contains(cursor)) {
            streak++;
            cursor = cursor.minusDays(1);
        }
        return streak;
    }

    private int computeLongestStreak(List<LocalDate> sortedActiveDates) {
        if (sortedActiveDates.isEmpty()) return 0;
        int longest = 1;
        int current = 1;
        for (int i = 1; i < sortedActiveDates.size(); i++) {
            if (sortedActiveDates.get(i).equals(sortedActiveDates.get(i - 1).plusDays(1))) {
                current++;
            } else if (!sortedActiveDates.get(i).equals(sortedActiveDates.get(i - 1))) {
                current = 1;
            }
            longest = Math.max(longest, current);
        }
        return longest;
    }
}
