CREATE DATABASE flux_control;

CREATE TABLE companies (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL UNIQUE,
  thumbnail VARCHAR(500),
  color VARCHAR(10) NOT NULL,
  created_at DATETIME NOT NULL,
  inactive BOOLEAN DEFAULT(0) NOT NULL
);

CREATE TABLE vehicles (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  number SMALLINT NOT NULL,
  license_plate VARCHAR(10) NOT NULL,
  created_at DATETIME NOT NULL,
  inactive BOOLEAN DEFAULT(0) NOT NULL,
  company_id INT UNSIGNED NOT NULL,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE users (
  registration INT UNSIGNED PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(40) NOT NULL UNIQUE,
  password VARCHAR(1000),
  role VARCHAR(15) NOT NULL,
  created_at DATETIME NOT NULL,
  inactive BOOLEAN DEFAULT(0) NOT NULL,
  token_id VARCHAR(64),
  FOREIGN KEY (token_id) REFERENCES tokens(id)
);

CREATE TABLE tokens (
  id VARCHAR(64) PRIMARY KEY,
  expires DATETIME NOT NULL
);

CREATE TABLE flow_records (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  arrival DATETIME NOT NULL,
  departure DATETIME,
  inactive BOOLEAN DEFAULT(0) NOT NULL,
  vehicle_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
  FOREIGN KEY (user_id) REFERENCES users(registration)
);