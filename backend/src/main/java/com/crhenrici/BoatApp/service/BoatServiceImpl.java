package com.crhenrici.BoatApp.service;

import com.crhenrici.BoatApp.dto.PageObject;
import com.crhenrici.BoatApp.model.Boat;
import com.crhenrici.BoatApp.repository.BoatRepository;
import jakarta.persistence.EntityExistsException;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BoatServiceImpl implements BoatService{

    private final BoatRepository boatRepository;

    @Autowired
    public BoatServiceImpl(BoatRepository boatRepository) {
        this.boatRepository = boatRepository;
    }
    @Override
    public PageObject findAll(Pageable pageable) {
        Page<Boat> boatPage = boatRepository.findAll(pageable);
        List<Boat> boats = boatPage.stream().toList();
        return new PageObject(boats.size(), boats);
    }

    @Override
    public Boat findById(Long id) {
        return boatRepository.findById(id).orElseThrow();
    }

    @Override
    public Boat save(Boat boat) {
        if (boatRepository.existsByName(boat.getName())) {
            throw new EntityExistsException("Boat with name " + boat.getName() + " already exists");
        }
        boat.setName(sanitizeInput(boat.getName()));
        boat.setDescription(sanitizeInput(boat.getDescription()));
        return boatRepository.save(boat);
    }

    @Override
    public Boat update(Boat boat) {
        boat.setName(sanitizeInput(boat.getName()));
        boat.setDescription(sanitizeInput(boat.getDescription()));
        return boatRepository.save(boat);
    }

    @Override
    public void deleteById(Long id) {
        boatRepository.deleteById(id);
    }

    private String sanitizeInput(String input) {
        return Jsoup.clean(input, Safelist.basic());
    }
}
