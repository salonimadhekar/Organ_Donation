package com.organdonation.springbooth;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;


@EnableScheduling
@SpringBootApplication
public class SpringboothApplication {


	public static void main(String[] args) {


		SpringApplication.run(SpringboothApplication.class, args);
	}


}

