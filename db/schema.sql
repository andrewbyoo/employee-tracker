DROP DATABASE IF EXISTS trackerList_db;
CREATE DATABASE trackerList_db;

USE trackerList_db;

CREATE TABLE departments (
  ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
  ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Title VARCHAR(30) NOT NULL,
  Salary DECIMAL NOT NULL,
  Department_ID
)
