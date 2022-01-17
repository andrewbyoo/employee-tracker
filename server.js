require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

const db = mysql.createConnection(
  {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'Placeholder'
  },
  console.log(`Connected to the database.`)
);

app.use(express.urlencoded({extended: false}));
app.use(express.json());

const employeeTracker = () => {
  inquirer
    .prompt(
      {
        type: 'list',
        name: 'generalMenu',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Exit Program']
      }
    )
    .then(function (response) {
      switch (response) {
        case 'View All Employees':
          break;
        case 'Add Employee':
          break;
        case 'Update Employee Role':
          break;
        case 'View All Roles':
          break;
        case 'Add Role':
          break;
        case 'View All Departments':
          break;
        case 'Add Department':
          break;
        case 'Exit Program':
          break;
      }
    })
};

// Initialize app
employeeTracker();
