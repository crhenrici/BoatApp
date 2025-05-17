package com.crhenrici.BoatApp.service;

import com.crhenrici.BoatApp.dto.LoginDto;
import com.crhenrici.BoatApp.dto.RegisterUserDto;
import com.crhenrici.BoatApp.exceptions.UserExistsException;
import com.crhenrici.BoatApp.model.UserModel;
import com.crhenrici.BoatApp.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ExtendWith(SpringExtension.class)
class AuthenticationServiceImplTest {

    @Autowired
    AuthenticationServiceImpl authenticationService;
    @Autowired
    UserRepository userRepository;

    @BeforeEach
    public void setup() {
        userRepository.deleteAll();
        UserModel user = UserModel.builder()
                        .email("testing@test.ch")
                        .name("Test")
                        .password("test")
                        .build();
        userRepository.save(user);
    }

    @Test
    public void signup() {
        UserModel user = authenticationService.signup(new RegisterUserDto("test@test.ch", "test", "Test"));
        assertNotNull(user);
        assertEquals(user.getEmail(), "test@test.ch");
        assertEquals(user.getName(), "Test");
    }

    @Test
    public void signupDuplicateEmail() {
        assertThrows(UserExistsException.class, () -> authenticationService.signup(new RegisterUserDto("testing@test.ch", "test", "Test")));
    }

    @Test
    public void loginSuccessful() {
        UserModel user = authenticationService.signup(new RegisterUserDto("test@test.ch", "test", "Test"));
        UserModel loggedInUser = authenticationService.login(new LoginDto(user.getEmail(), "test"));

        assertEquals(user.getId(), loggedInUser.getId());
    }

    @Test
    public void loginFailed() {
        UserModel user = authenticationService.signup(new RegisterUserDto("test@test.ch", "test", "Test"));
        assertThrows(BadCredentialsException.class, () -> authenticationService.login(new LoginDto(user.getEmail(), "wrong password")));
    }

}