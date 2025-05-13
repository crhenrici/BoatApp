package com.crhenrici.BoatApp.dto;

public record LoginResponse(String token, Long expiresIn) {
}
