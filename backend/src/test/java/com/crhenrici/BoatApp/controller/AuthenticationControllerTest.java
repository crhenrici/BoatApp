package com.crhenrici.BoatApp.controller;

import com.crhenrici.BoatApp.dto.LoginDto;
import com.crhenrici.BoatApp.dto.LoginResponse;
import com.crhenrici.BoatApp.dto.RegisterUserDto;
import com.crhenrici.BoatApp.dto.UserDto;
import com.crhenrici.BoatApp.model.UserModel;
import com.crhenrici.BoatApp.repository.UserRepository;
import com.crhenrici.BoatApp.service.AuthenticationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AuthenticationControllerTest {

    @LocalServerPort
    private int port;

    @Autowired
    UserRepository userRepository;

    @Autowired
    private TestRestTemplate restTemplate;

    private String url;

    @BeforeEach
    public void setup() {
        userRepository.deleteAll();
        url = "http://localhost:" + port;
    }

    @Test
    public void signup() {
        RegisterUserDto registerUserDto = new RegisterUserDto("test@test.ch", "test", "Test");

        ResponseEntity<UserDto> response = restTemplate.postForEntity(
            url + "/auth/signup",
            registerUserDto,
            UserDto.class
        );

        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    
        UserDto userDto = response.getBody();
        assertNotNull(userDto);
        assertNotNull(userDto.id());
        assertEquals("test@test.ch", userDto.email());
        assertEquals("Test", userDto.name());
    }

    @Test
    public void signupDuplicateEmail() {
        createUser("test@test.ch", "test", "Test");

        RegisterUserDto registerUserDto = new RegisterUserDto("test@test.ch", "test", "Test");

        ResponseEntity<String> response = restTemplate.postForEntity(url + "/auth/signup",
                registerUserDto, String.class);

        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    public void invalidSignup() {
        RegisterUserDto registerUserDto = new RegisterUserDto(null, null, null);
        ResponseEntity<Map> response = restTemplate.postForEntity(url + "/auth/signup",
                registerUserDto, Map.class);

        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        Map<String, String> body = response.getBody();

        assertNotNull(body);
        assertEquals(3, body.size());
        assertEquals("Email is mandatory", body.get("email"));
    }

    @Test
    public void login() {
        registerUser("test@test.ch", "test", "Test");
        LoginDto loginDto = new LoginDto("test@test.ch", "test");

        ResponseEntity<LoginResponse> response = restTemplate.postForEntity(url + "/auth/login",
                loginDto, LoginResponse.class);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());

        LoginResponse loginResponse = response.getBody();
        assertNotNull(loginResponse);

        assertNotEquals("", loginResponse.token());
        assertNotNull(loginResponse.token());
    }

    @Test
    public void loginFailed() {
        registerUser("test@test.ch", "test", "Test");

        LoginDto loginDto = new LoginDto("test@test.ch", "testi12");

        ResponseEntity<String> response = restTemplate.postForEntity(url + "/auth/login",
                loginDto, String.class);

        assertNotNull(response);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Bad credentials", response.getBody());
    }

    @Test
    public void loginInvalid() {
        registerUser("test@test.ch", "test", "Test");

        LoginDto loginDto = new LoginDto(null, null);

        ResponseEntity<Map> response = restTemplate.postForEntity(url + "/auth/login",
                loginDto, Map.class);

        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        Map<String, String> body = response.getBody();
        assertNotNull(body);
        assertEquals(2, body.size());
        assertEquals("Email is mandatory", body.get("email"));
    }

    private void registerUser(String email, String password, String name) {
        RegisterUserDto registerUserDto = new RegisterUserDto(email, password, name);
        restTemplate.postForEntity(url + "/auth/signup",
                registerUserDto, UserDto.class);
    }


    private void createUser(String email, String password, String name) {
        UserModel user = UserModel.builder()
                .email(email)
                .password(password)
                .name(name)
                .build();
        userRepository.save(user);
    }
}