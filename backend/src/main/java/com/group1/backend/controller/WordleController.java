package com.group1.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Random;

@RestController
public class WordleController {
    // Navigating to http://localhost:8080/sayhello while the backend is running
    // will give you "Hello World!" and print "Hello!" in the console.
    @GetMapping("/sayhello")
    public String sayHello() {
        System.out.println("Hello!");
        return "Hello World!";
    }

    private final Random random = new Random();

    @GetMapping("/randomnumber")
    public int randomNumber() {
        System.out.println("Generating random number...");
        return random.nextInt(0, 100000);
    }

}
