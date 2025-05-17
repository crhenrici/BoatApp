package com.crhenrici.BoatApp.security;

import com.crhenrici.BoatApp.dto.RegisterUserDto;
import com.crhenrici.BoatApp.model.UserModel;
import com.crhenrici.BoatApp.repository.UserRepository;
import com.crhenrici.BoatApp.service.AuthenticationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ExtendWith(SpringExtension.class)
class UserDetailsServiceTest {

    @Autowired
    UserDetailsService userDetailsService;
    @Autowired
    AuthenticationService authenticationService;
    @Autowired
    UserRepository userRepository;
    UserModel user;

    @BeforeEach
    public void setup() {
        userRepository.deleteAll();
        user =  UserModel.builder()
                .name("Test")
                .email("test@test.ch")
                .password("test")
                .build();

        authenticationService.signup(new RegisterUserDto(user.getEmail(), user.getPassword(), user.getName()));
    }

    @Test
    public void foundUser() {
        UserDetails userDetails = userDetailsService.loadUserByUsername("test@test.ch");
        assertNotNull(userDetails);
        assertEquals(userDetails.getUsername(), user.getEmail());
    }

    @Test
    public void notFoundUser() {
        assertThrows(UsernameNotFoundException.class, () -> userDetailsService.loadUserByUsername("testing@test.ch"), "User not found");
    }

}