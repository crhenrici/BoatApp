package com.crhenrici.BoatApp.dto;

import jakarta.validation.constraints.NotBlank;

import java.io.Serializable;

public record BoatDto(@NotBlank String name, @NotBlank String description) implements Serializable {
}