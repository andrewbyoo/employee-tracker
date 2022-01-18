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
          inquirer
            .prompt(
              {
                type: 'input',
                name: 'firstName',
                message: `What is the employee's first name?`
              },
              {
                type: 'input',
                name: 'lastName',
                message: `What is the employee's last name?`
              }
              // Figure out how to add choices depending on mysql database then add questions for role and who the manager is
            )
            .then()
            .catch(err => {console.log(err)});
          break;
        case 'Update Employee Role':
          inquirer
            .prompt(
              // Same as above, but for listing employee names and what role they can be assigned to
            )
            .then()
            .catch(err => {console.log(err)});
          break;
        case 'View All Roles':
          db.query('SELECT * FROM roles', function(err, results) {
            console.table(results);
            return employeeTracker();
          });
          break;
        case 'Add Role':
          inquirer
            .prompt(
              {
                type: 'input',
                name: 'newRole',
                message: 'What is the new role called?'
              },
              // Same as above, but for listing what departments the role can be assigned to
            )
            .then()
            .catch(err => {console.log(err)});
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
              const department = response.departmentName.split(' ').map((words) => {
                return words.substring(0, 1).toUpperCase() + words.substring(1);
              }).join(' ');
              db.query(`INSERT INTO departments (name) VALUES ('${department}')`);
              return employeeTracker();
            })
            .catch(err => {console.log(err)});
          break;
      }
    })
    .catch(err => {console.log(err)});
};

// Initialize app
employeeTracker();
