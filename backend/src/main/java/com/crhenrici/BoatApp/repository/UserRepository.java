package com.crhenrici.BoatApp.repository;

import com.crhenrici.BoatApp.model.UserModel;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<UserModel, Long> {
    @Query("SELECT u FROM UserModel u LEFT JOIN FETCH u.roles WHERE u.email = :email")
    Optional<UserModel> findByEmailWithRoles(String email);

    boolean existsByEmail(String email);
}
