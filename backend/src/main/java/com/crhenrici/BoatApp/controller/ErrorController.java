package com.crhenrici.BoatApp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ErrorController {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleError(Exception ex) {
        return ResponseEntity.badRequest().body("Something went wrong: " + ex.getMessage() + "\n");
    }
}
