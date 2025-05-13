package com.crhenrici.BoatApp.service;

import com.crhenrici.BoatApp.dto.LoginDto;
import com.crhenrici.BoatApp.dto.RegisterUserDto;
import com.crhenrici.BoatApp.model.UserModel;
import org.springframework.stereotype.Service;

@Service
public interface AuthenticationService {

    UserModel signup(RegisterUserDto registerUserDto);
    UserModel login(LoginDto loginDto);
}
