package com.crhenrici.BoatApp.service;

import com.crhenrici.BoatApp.dto.PageObject;
import com.crhenrici.BoatApp.model.Boat;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface BoatService {
    PageObject findAll(Pageable pageable);
    Boat findById(Long id);
    Boat save(Boat boat);
    Boat update(Boat boat);
    void deleteById(Long id);
}
