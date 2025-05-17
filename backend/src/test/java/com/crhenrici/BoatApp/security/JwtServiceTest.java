package com.crhenrici.BoatApp.security;

import com.crhenrici.BoatApp.model.UserModel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ExtendWith(SpringExtension.class)
class JwtServiceTest {

    @Autowired
    JwtService jwtService;
    UserDetailsImpl userDetails;

    @BeforeEach
    public void setup() {
        UserModel user =  UserModel.builder()
                .name("Test")
                .email("test@test.ch")
                .password("test")
                .build();
        userDetails = UserDetailsImpl.build(user);
    }

    @Test
    public void generateToken() {
        String token = jwtService.generateToken(userDetails);

        assertNotNull(token);
        assertNotEquals("", token);
    }

    @Test
    public void validateToken() {
        String token = jwtService.generateToken(userDetails);

        assertTrue(jwtService.isTokenValid(token, userDetails));
    }

    @Test
    public void validateTokenInvalid() {
        String token = jwtService.generateToken(userDetails);

        UserModel wrongUser = UserModel.builder()
                .name("Some user")
                .email("testing@test.ch")
                .password("password")
                .build();
        UserDetailsImpl wrongUserDetails = UserDetailsImpl.build(wrongUser);

        assertFalse(jwtService.isTokenValid(token, wrongUserDetails));
    }

    @Test
    public void extractUsername() {
        String token = jwtService.generateToken(userDetails);

        assertEquals(userDetails.getUsername(), jwtService.extractUsername(token));
    }
}