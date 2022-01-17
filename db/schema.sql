DROP DATABASE IF EXISTS trackerList_db;
CREATE DATABASE trackerList_db;

USE trackerList_db;

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT FOREIGN KEY
  REFERENCES departments(id)
  ON DELETE SET NULL
);

CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT FOREIGN KEY
  REFERENCES roles(id)
  ON DELETE SET NULL,
  manager_id INT -- should be whatever the manager "employee" id number is, possibly add inquirer prompt with list of available managers to connect to employee?
)
