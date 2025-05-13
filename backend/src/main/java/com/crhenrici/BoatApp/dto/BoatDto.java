package com.crhenrici.BoatApp.dto;

import java.io.Serializable;

public record BoatDto(String name, String description) implements Serializable {
}