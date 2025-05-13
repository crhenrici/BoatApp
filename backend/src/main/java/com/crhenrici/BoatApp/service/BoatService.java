package com.crhenrici.BoatApp.service;

import com.crhenrici.BoatApp.model.Boat;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface BoatService {
    List<Boat> findAll();
    Boat findById(Long id);
    Boat save(Boat boat);
    void deleteById(Long id);
}
