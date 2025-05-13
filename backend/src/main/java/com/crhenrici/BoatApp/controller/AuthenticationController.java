package com.crhenrici.BoatApp.controller;

import com.crhenrici.BoatApp.dto.LoginDto;
import com.crhenrici.BoatApp.dto.LoginResponse;
import com.crhenrici.BoatApp.dto.RegisterUserDto;
import com.crhenrici.BoatApp.model.UserModel;
import com.crhenrici.BoatApp.security.JwtService;
import com.crhenrici.BoatApp.security.UserDetailsImpl;
import com.crhenrici.BoatApp.service.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.awt.font.TextHitInfo;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    private final JwtService jwtService;
    private final AuthenticationService authService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authService) {
        this.jwtService = jwtService;
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<UserModel> register(@RequestBody RegisterUserDto registerUserDto) {
        UserModel user = authService.signup(registerUserDto);

        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginDto loginDto) {
        UserModel user = authService.login(loginDto);

        String jwtToken = jwtService.generateToken(UserDetailsImpl.build(user));

        return ResponseEntity.ok(new LoginResponse(jwtToken, jwtService.getJwtExpiration()));
    }
}
