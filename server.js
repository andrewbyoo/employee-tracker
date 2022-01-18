require('dotenv').config();
const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection(
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'employee_db'
  },
  console.log(`Connected to the employee database.`)
);

const employeeTracker = () => {
  inquirer
    .prompt(
      {
        type: 'list',
        name: 'generalMenu',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department']
      }
    )
    .then(function (response) {
      switch (response.generalMenu) {
        case 'View All Employees':
          db.query('SELECT * FROM employees', function (err, results) {
            console.table(results);
            return employeeTracker();
          });
          break;
        case 'Add Employee':
          break;
        case 'Update Employee Role':
          break;
        case 'View All Roles':
          db.query('SELECT * FROM roles', function(err, results) {
            console.table(results);
            return employeeTracker();
          });
          break;
        case 'Add Role':
          break;
        case 'View All Departments':
          db.query('SELECT * FROM departments', function(err, results) {
            console.table(results);
            return employeeTracker();
          });
          break;
        case 'Add Department':
          inquirer
            .prompt(
              {
                type: 'input',
                name: 'departmentName',
                message: 'What is the new department called?'
              }
            )
            .then(function (response) {
              db.query(`INSERT INTO departments (name) VALUES ('${response.departmentName}')`);
              return employeeTracker();
            })
            .catch(err => {console.log(err)});
          break;
      }
    }
    .catch(err => {console.log(err)}));
};

// Initialize app
employeeTracker();
