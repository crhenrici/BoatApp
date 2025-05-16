package com.crhenrici.BoatApp.dto;

import com.crhenrici.BoatApp.model.Boat;

import java.util.List;

public record PageObject(int totalCount, List<Boat> data) {
}
