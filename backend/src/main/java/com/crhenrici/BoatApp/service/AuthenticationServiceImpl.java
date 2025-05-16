package com.crhenrici.BoatApp.service;

import com.crhenrici.BoatApp.dto.LoginDto;
import com.crhenrici.BoatApp.dto.RegisterUserDto;
import com.crhenrici.BoatApp.exceptions.UserExistsException;
import com.crhenrici.BoatApp.model.UserModel;
import com.crhenrici.BoatApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthenticationServiceImpl implements AuthenticationService{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;


    @Autowired
    public AuthenticationServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder,
                                     AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public UserModel signup(RegisterUserDto registerUserDto) {
        UserModel user = UserModel.builder()
                .email(registerUserDto.email())
                .password(passwordEncoder.encode(registerUserDto.password()))
                .name(registerUserDto.name())
                .build();

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new UserExistsException("User with email " + user.getEmail() + " already exists");
        }

        return userRepository.save(user);
    }

    @Override
    public UserModel login(LoginDto loginDto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.email(), loginDto.password()
                )
        );

        return userRepository.findByEmailWithRoles(loginDto.email()).orElseThrow();
    }
}
