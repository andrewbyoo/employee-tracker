require('dotenv').config();
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

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
          const viewEmpQuery = `SELECT emp.id, emp.first_name, emp.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(mng.first_name, " ",mng.last_name) AS manager
          FROM employees emp
          LEFT JOIN employees mng ON emp.manager_id = mng.id
          JOIN roles ON emp.role_id = roles.id
          JOIN departments ON roles.department_id = departments.id
          ORDER BY id`;

          db.query(viewEmpQuery, function (err, results) {
            const table = cTable.getTable(results);
            console.log(table);
            return employeeTracker();
          });
          break;

        // Adds a new employee to the employees table in employee_db
        case 'Add Employee':

          // Retrieves the full name of all existing employees
          db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees', function (err, results) {
            const idArray = results;
            const employeeArray = results.map(obj => obj.name);

            // Retrieves all available roles
            db.query('SELECT id, title FROM roles', function (err, results) {
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

                  // Converts chosen role to the corresponding id number
                  const newEmployeeRoleId = results.filter(obj => obj.title === response.role).map(obj => obj.id);

                  // Converts chosen manager to the corresponding id number
                  let managerId;
                  (response.managerName === 'None') ? managerId = null : managerId = idArray.filter(obj => obj.name === response.managerName).map(obj => obj.id);

                  // CRUD Insert to add new employee to the employee database and call back the general menu
                  db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [firstNameCapitalized, lastNameCapitalized, newEmployeeRoleId, managerId], function (err, results) {

                    // If any of the inputs failed, move user back to the general menu
                    if (err) {
                      console.error('\nA first and last name are both required to add a new employee. Please input the employee again.\n');
                      return employeeTracker();
                    };

                    console.log(`${firstNameCapitalized} ${lastNameCapitalized} has been added to the employee database!`);
                    return employeeTracker();
                  });
                })
                .catch(err => { console.log(err) });
            });
          });
          break;

        // TODO: write case
        case 'Update Employee Role':

          // Retrieves the full name of all existing employees
          db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees', function (err, results) {
            const idArray = results;
            const employeeArray = results.map(obj => obj.name);

            // Retrieves all available roles
            db.query('SELECT id, title FROM roles', function (err, results) {
              inquirer
                .prompt([
                  {
                    type: 'list',
                    name: 'names',
                    message: 'Which employee would you like to change?',
                    choices: employeeArray
                  },
                  {
                    type:'list',
                    name: 'role',
                    message: 'What role would you like to assign to the employee?',
                    choices: results.map(obj => obj.title)
                  }
                ])
                .then(function (response) {
                  return employeeTracker();
                })
                .catch(err => { console.log(err) });
            });

          })
          break;
        case 'View All Roles':
          db.query('SELECT roles.id, roles.title, departments.name AS department, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id ORDER BY id', function (err, results) {
            const table = cTable.getTable(results);
            console.log(table);
            return employeeTracker();
          });
          break;

        // TODO: write case
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
            .catch(err => { console.log(err) });
          break;
        case 'View All Departments':
          db.query('SELECT * FROM departments ORDER BY id', function (err, results) {
            const table = cTable.getTable(results);
            console.log(table);
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
            .catch(err => { console.log(err) });
          break;
      };
    })
    .catch(err => { console.log(err) });
};

// Initialize app
employeeTracker();
