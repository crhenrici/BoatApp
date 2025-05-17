package com.crhenrici.BoatApp.service;

import com.crhenrici.BoatApp.model.Boat;
import com.crhenrici.BoatApp.repository.BoatRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ExtendWith(SpringExtension.class)
class BoatServiceImplTest {

    @Autowired
    BoatRepository boatRepository;
    @Autowired
    BoatServiceImpl boatService;

    @BeforeEach
    public void setUp() {
        boatRepository.deleteAll();
    }

    @Test
    public void saveBoat() {
        Boat boat = new Boat("Boat A", "Some very cool boat");
        boatService.save(boat);
        assertEquals(boatRepository.count(), 1);
    }

    @Test
    public void saveDuplicateBoatFailed() {
        Boat boat = new Boat("Boat A", "Some very cool boat");
        boatService.save(boat);
        assertThrows(Exception.class, () -> boatService.save(boat));
    }

    @Test
    public void findBoatById() {
        Boat boat = new Boat("Boat A", "Some very cool boat");
        boatService.save(boat);
        assertEquals(boatService.findById(boat.getId()).getName(), "Boat A");
    }

    @Test
    public void updateBoat() {
        Boat boat = new Boat("Boat A", "Some very cool boat");
        boatService.save(boat);
        boat.setName("Boat B");
        boatService.update(boat);
        assertEquals(boatService.findById(boat.getId()).getName(), "Boat B");
    }

    @Test
    public void deleteBoat() {
        Boat boat = new Boat("Boat A", "Some very cool boat");
        boatService.save(boat);
        boatService.deleteById(boat.getId());
        assertEquals(boatRepository.count(), 0);
    }
}