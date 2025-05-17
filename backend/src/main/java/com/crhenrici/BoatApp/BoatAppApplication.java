package com.crhenrici.BoatApp;

import com.crhenrici.BoatApp.model.Boat;
import com.crhenrici.BoatApp.repository.BoatRepository;
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
	BoatRepository boatRepository;

	@Bean
	CommandLineRunner runner() {
		return args -> {
			if (boatRepository.count() == 0) {
				Boat boat = new Boat("Boat A", "Some very cool boat");
				Boat boat2 = new Boat("Boat B", "Some cool boat");
				Boat boat3 = new Boat("Boat C", "Some other boat");
				boatRepository.save(boat);
				boatRepository.save(boat2);
				boatRepository.save(boat3);
			}
		};
	}

}
