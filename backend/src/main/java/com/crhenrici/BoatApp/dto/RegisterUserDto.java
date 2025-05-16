package com.crhenrici.BoatApp.dto;

import jakarta.validation.constraints.NotBlank;

public record RegisterUserDto(@NotBlank(message = "Email is mandatory") String email,
                              @NotBlank(message = "Password is mandatory") String password,
                              @NotBlank(message = "Name is mandatory") String name) {
}
