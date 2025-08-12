CREATE TABLE `cars` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(255) NOT NULL,
	`model` varchar(255) NOT NULL,
	`year` int NOT NULL,
	`price` decimal NOT NULL,
	`fuel_type` varchar(50) NOT NULL,
	`transmission` varchar(50) NOT NULL,
	`description` text,
	`image_url` varchar(500),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `cars_id` PRIMARY KEY(`id`)
);
