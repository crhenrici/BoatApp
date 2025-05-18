package com.crhenrici.BoatApp.dto;

import jakarta.validation.constraints.NotBlank;

import java.io.Serializable;

public record BoatDto(@NotBlank(message = "Name is mandatory") String name, @NotBlank(message = "Description is mandatory") String description) implements Serializable {
}