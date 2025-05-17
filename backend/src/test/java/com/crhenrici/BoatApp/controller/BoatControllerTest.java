package com.crhenrici.BoatApp.controller;

import com.crhenrici.BoatApp.dto.*;
import com.crhenrici.BoatApp.model.Boat;
import com.crhenrici.BoatApp.repository.BoatRepository;
import com.crhenrici.BoatApp.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class BoatControllerTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private BoatRepository boatRepository;

    @Autowired
    private UserRepository userRepository;

    private String baseUrl;
    private String boatUrl;

    private String token;

    @BeforeEach
    public void setup() {
        userRepository.deleteAll();
        boatRepository.deleteAll();
        baseUrl = "http://localhost:" + port;
        boatUrl = baseUrl + "/api/v1/boat";
        signup();
        token = login();
    }

    private void signup() {
        RegisterUserDto userDto = new RegisterUserDto("test@test.ch", "test", "Test");
        restTemplate.postForEntity(baseUrl + "/auth/signup", userDto, UserDto.class);
    }

    private String login() {
        LoginDto loginDto = new LoginDto("test@test.ch", "test");
        ResponseEntity<LoginResponse> response = restTemplate.postForEntity(baseUrl + "/auth/login", loginDto, LoginResponse.class);
        return response.getBody().token();
    }

    @Test
    public void createBoat() {
        BoatDto boatDto = new BoatDto("Boat A", "Some very cool boat");
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + token);
        HttpEntity<BoatDto> request = new HttpEntity<>(boatDto, headers);
        ResponseEntity<Boat> response = restTemplate.postForEntity(boatUrl, request, Boat.class);
        assertEquals(boatRepository.count(), 1);
        assertNotNull(response);
        assertNotNull(response.getBody());
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        Boat boat = response.getBody();
        assertEquals(boat.getName(), boatDto.name());
        assertNotNull(boat.getId());
    }

    @Test
    public void unauthorizedCreateBoat() {
        BoatDto boatDto = new BoatDto("Boat A", "Some very cool boat");
        HttpEntity<BoatDto> request = new HttpEntity<>(boatDto);
        ResponseEntity<Boat> response = restTemplate.postForEntity(boatUrl, request, Boat.class);
        assertEquals(boatRepository.count(), 0);
        assertNotNull(response);
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    @Test
    public void findBoatById() {
        Boat boat = createBoat("Boat A", "Some very cool boat");
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + token);
        HttpEntity<BoatDto> request = new HttpEntity<>(headers);
        ResponseEntity<Boat> response = restTemplate.exchange(boatUrl + "/" + boat.getId(),
                HttpMethod.GET,
                request,
                Boat.class);
        assertNotNull(response.getBody());
        assertEquals(HttpStatus.OK, response.getStatusCode());
        Boat boatResponse = response.getBody();
        assertEquals(boat.getName(), boatResponse.getName());
        assertEquals(boat.getDescription(), boatResponse.getDescription());
        assertEquals(boat.getId(), boatResponse.getId());
    }

    @Test
    public void unauthorizedFindBoatById() {
        Boat boat = createBoat("Boat A", "Some very cool boat");
        HttpEntity<BoatDto> request = new HttpEntity<>(null);
        ResponseEntity<Boat> response = restTemplate.exchange(boatUrl + "/" + boat.getId(),
                HttpMethod.GET,
                request,
                Boat.class);
        assertNotNull(response);
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    @Test
    public void findAll() {
        createBoat("Boat A", "Some very cool boat");
        createBoat("Boat B", "Some other cool boat");
        createBoat("Boat C", "Some even cooler boat");

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + token);
        HttpEntity<BoatDto> request = new HttpEntity<>(headers);

        ResponseEntity<PageObject> response = restTemplate.exchange(boatUrl + "?pageIndex=" + 0 + "&pageSize=" + 5, HttpMethod.GET,
                request, PageObject.class);

        assertNotNull(response.getBody());
        assertEquals(HttpStatus.OK, response.getStatusCode());
        PageObject pageObject = response.getBody();
        List<Boat> boats = pageObject.data();
        assertEquals(3, boats.size());
        assertEquals(3, pageObject.totalCount());
        assertEquals("Boat A", boats.get(0).getName());
    }

    @Test
    public void unauthorizedFindAll() {
        createBoat("Boat A", "Some very cool boat");
        createBoat("Boat B", "Some other cool boat");
        createBoat("Boat C", "Some even cooler boat");
        ResponseEntity<PageObject> response = restTemplate.getForEntity(boatUrl + "?pageIndex=" + 0 + "&pageSize=" + 5, PageObject.class);

        assertNotNull(response);
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    private Boat createBoat(String name, String description) {
        Boat boat = new Boat(name, description);
        return boatRepository.save(boat);
    }
}