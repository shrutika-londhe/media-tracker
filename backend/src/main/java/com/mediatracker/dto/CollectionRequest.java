package com.mediatracker.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CollectionRequest {

    @NotBlank
    private String name;
}
