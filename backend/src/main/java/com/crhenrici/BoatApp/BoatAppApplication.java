package com.crhenrici.BoatApp;

import com.crhenrici.BoatApp.model.Boat;
import com.crhenrici.BoatApp.service.BoatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BoatAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(BoatAppApplication.class, args);
	}

	@Autowired
	BoatService boatService;

	@Bean
	CommandLineRunner runner() {
		return args -> {
			Boat boat = new Boat("Boat A", "Some very cool boat");
			Boat boat2 = new Boat("Boat B", "Some cool boat");
			Boat boat3 = new Boat("Boat C", "Some other boat");
			boatService.save(boat);
			boatService.save(boat2);
			boatService.save(boat3);
		};
	}

}
