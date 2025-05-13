package com.crhenrici.BoatApp.controller;

import com.crhenrici.BoatApp.dto.BoatDto;
import com.crhenrici.BoatApp.model.Boat;
import com.crhenrici.BoatApp.service.BoatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/boat")
public class BoatController {

    private final BoatService boatService;

    @Autowired
    public BoatController(BoatService boatService) {
        this.boatService = boatService;
    }

    @GetMapping()
    public ResponseEntity<List<Boat>> findAll() {
        System.out.println("Request came in");
        return ResponseEntity.ok(boatService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Boat> findById(@PathVariable Long id) {
        return ResponseEntity.ok(boatService.findById(id));
    }

    @PostMapping()
    public ResponseEntity<Boat> save(@RequestBody BoatDto boat) {
        return ResponseEntity.ok(boatService.save(new Boat(boat.name(), boat.description())));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Boat> update(@PathVariable Long id, @RequestBody BoatDto boat) {
        return ResponseEntity.ok(boatService.save(new Boat(id, boat.name(), boat.description())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        boatService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
