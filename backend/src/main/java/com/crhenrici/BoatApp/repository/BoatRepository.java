package com.crhenrici.BoatApp.repository;

import com.crhenrici.BoatApp.model.Boat;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoatRepository extends CrudRepository<Boat, Long> {

    Boat save(Boat boat);
    void deleteById(Long id);
    List<Boat> findAll();

    List<Boat> findByName(String name);

    Boat findDistinctByName(String name);

    boolean existsByName(String name);
}
