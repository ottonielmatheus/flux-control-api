# Sistema para Controle de Fluxo de Veículos

-- futura descrição do projeto aqui ;) --

## How to Run
-- futura instrução para execução aqui ;) --

## 

## Database

#### Description

| Tables | Description |
|--------|-------------|
| companies | São as empresas cadastradas, geralmente possuem uma frota de veículos cadastrados |
| flow_records | É os registros de entradas e saídas dos veículos |
| users | São os operadores do sistema, cada usuário desenvolve uma **função** no sistema |
| vehicles | São os veículos de uma empresa, que serão monitorados pelo sistema |

#### Create

```sql
CREATE DATABASE flux_control;

CREATE TABLE companies (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL UNIQUE,
  thumbnail VARCHAR(500),
  created_at DATETIME NOT NULL,
  inactive BOOLEAN DEFAULT(0) NOT NULL
);

CREATE TABLE vehicles (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  number SMALLINT NOT NULL,
  license_plate VARCHAR(10) NOT NULL,
  created_at DATETIME NOT NULL,
  inactive BOOLEAN DEFAULT(0) NOT NULL,
  company_id INT UNSIGNED,
  FOREIGN KEY (company_id) companies(id)
);

CREATE TABLE users (
  registration INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  password VARCHAR(1000),
  role VARCHAR(15) NOT NULL,
  created_at DATETIME NOT NULL,
  inactive BOOLEAN DEFAULT(0) NOT NULL
);


CREATE TABLE flow_records (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  arrival DATETIME NOT NULL,
  departure DATETIME,
  inactive BOOLEAN DEFAULT(0) NOT NULL,
  vehicle_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  FOREIGN KEY (vehicle_id) vehicles(id),
  FOREIGN KEY (user_id) users(registration)
);
```
