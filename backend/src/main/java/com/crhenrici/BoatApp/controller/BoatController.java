package com.crhenrici.BoatApp.controller;

import com.crhenrici.BoatApp.dto.BoatDto;
import com.crhenrici.BoatApp.dto.PageObject;
import com.crhenrici.BoatApp.model.Boat;
import com.crhenrici.BoatApp.service.BoatService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<PageObject> findAll(@RequestParam(name = "pageIndex") Integer pageIndex, @RequestParam(name = "pageSize") Integer pageSize) {
        Pageable pageObject = PageRequest.of(pageIndex, pageSize);
        return ResponseEntity.ok(boatService.findAll(pageObject));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Boat> findById(@PathVariable Long id) {
        return ResponseEntity.ok(boatService.findById(id));
    }

    @PostMapping()
    public ResponseEntity<Boat> save(@Valid @RequestBody BoatDto boat) {
        return new ResponseEntity(boatService.save(new Boat(boat.name(), boat.description())), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Boat> update(@PathVariable Long id, @Valid @RequestBody BoatDto boat) {
        return ResponseEntity.ok(boatService.update(new Boat(id, boat.name(), boat.description())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        boatService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
