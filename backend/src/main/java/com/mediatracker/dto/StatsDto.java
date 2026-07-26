package com.mediatracker.dto;

import com.mediatracker.entity.Category;
import com.mediatracker.entity.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatsDto {
    private int totalItems;
    private Map<Status, Long> statusCounts;
    private Map<Category, Long> categoryCounts;
    private List<MonthCountDto> monthlyCompletions;
    private List<DayCountDto> dailyActivity;
    private List<GenreCountDto> topGenres;
    private int currentStreak;
    private int longestStreak;
}
