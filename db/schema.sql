DROP DATABASE IF EXISTS departmentList_db;
CREATE DATABASE departmentList_db;

USE departmentList_db;

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

DROP DATABASE IF EXISTS roleList_db;
CREATE DATABASE roleList_db;

USE roleList_db;

DROP DATABASE IF EXISTS employeeList_db;
CREATE DATABASE employeeList_db;

USE employeeList_db;
