package com.crhenrici.BoatApp.repository;

import com.crhenrici.BoatApp.model.Boat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoatRepository extends PagingAndSortingRepository<Boat, Long>, CrudRepository<Boat, Long> {

    Boat save(Boat boat);
    void deleteById(Long id);
    Page<Boat> findAll(Pageable pageable);
    List<Boat> findAll();
    boolean existsByName(String name);
}
