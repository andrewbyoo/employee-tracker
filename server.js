require('dotenv').config();
const mysql = require('mysql2');
const inquirer = require('inquirer');

// Connects node to mysql using the .env file
const db = mysql.createConnection(
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'employee_db'
  },
  console.log(`Connected to the employee database.`)
);

// Function containing the app options
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

        // Shows a table of all employees in employee_db on the console
        case 'View All Employees':
          db.query('SELECT * FROM employees', function (err, results) {
            console.table(results);
            return employeeTracker();
          });
          break;

        // Adds a new employee to the employees table in employee_db
        case 'Add Employee':

          // Retrieves the full name of all existing employees
          db.query('SELECT first_name, last_name FROM employees', function (err, results) {
            const idArray = results.map(obj => [{ id: obj.id, name: obj.first_name + ' ' + obj.last_name }]);
            const employeeArray = results.map(obj => obj.first_name + ' ' + obj.last_name);

            // Retrieves all available roles
            db.query('SELECT title FROM roles', function (err, results) {
              inquirer
                .prompt([
                  {
                    type: 'input',
                    name: 'firstName',
                    message: `What is the employee's first name?`
                  },
                  {
                    type: 'input',
                    name: 'lastName',
                    message: `What is the employee's last name?`
                  },
                  {
                    type: 'list',
                    name: 'role',
                    message: `What is the employee's job title?`,
                    choices: results.map(obj => obj.title)
                  },
                  {
                    type: 'list',
                    name: 'managerName',
                    message: `Who is the employee's manager?`,
                    choices: ['None'].concat(employeeArray)
                  }
                ])
                .then(function (response) {
                  // Variables to capitalize the input and combine them into one variable containing the full name
                  const firstNameCapitalized = response.firstName.charAt(0).toUpperCase() + response.firstName.slice(1);
                  const lastNameCapitalized = response.lastName.charAt(0).toUpperCase() + response.lastName.slice(1);
                  const newEmployeeName = firstNameCapitalized + ' ' + lastNameCapitalized;

                  return employeeTracker();
                })
                .catch(err => { console.log(err) });
            })
          })
          break;
        case 'Update Employee Role':
          inquirer
            .prompt(
              // Same as above, but for listing employee names and what role they can be assigned to
            )
            .then(function (response) {
              return employeeTracker();
            })
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
            .then(function (response) {
              return employeeTracker();
            })
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
