package com.crhenrici.BoatApp.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginDto(@NotBlank(message = "Email is mandatory") String email, @NotBlank(message = "Password is mandatory") String password) {
}
