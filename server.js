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
            console.log(`\n\n${table}\n`);
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

                  // Inserts new employee to the employee database and calls back the general menu
                  db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [firstNameCapitalized, lastNameCapitalized, newEmployeeRoleId, managerId], function (err, results) {

                    // If any of the inputs failed, move user back to the general menu
                    if (err) {
                      console.error('\nA first and last name are both required to add a new employee. Please input the employee again.\n');
                      return employeeTracker();
                    };

                    console.log(`\n${firstNameCapitalized} ${lastNameCapitalized} has been added to the employee database!\n`);
                    return employeeTracker();
                  });
                })
                .catch(err => { console.log(err) });
            });
          });
          break;

        // Updates the role id number on an employee
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
                    name: 'name',
                    message: 'Which employee would you like to change?',
                    choices: employeeArray
                  },
                  {
                    type: 'list',
                    name: 'role',
                    message: 'What role would you like to assign to the employee?',
                    choices: results.map(obj => obj.title)
                  }
                ])
                .then(function (response) {

                  // Retrieves id of chosen employee and id of chosen role
                  const employeeId = idArray.filter(obj => obj.name === response.name).map(obj => obj.id);
                  const employeeChangedRoleId = results.filter(obj => obj.title === response.role).map(obj => obj.id);

                  // Updates employee's role_id to the chosen role
                  db.query(`UPDATE employees SET role_id = ? WHERE id = ?`, [employeeChangedRoleId, employeeId], function (err, results) {

                    // If any of the inputs failed, move user back to the general menu
                    if (err) {
                      console.error(err);
                      return employeeTracker();
                    };

                    console.log(`\n${response.name} has been added to the employee database!\n`);
                    return employeeTracker();
                  });
                })
                .catch(err => { console.log(err) });
            });
          });
          break;

        // Shows a table of all roles in employee_db on the console
        case 'View All Roles':
          db.query('SELECT roles.id, roles.title, departments.name AS department, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id ORDER BY id', function (err, results) {
            const table = cTable.getTable(results);
            console.log(`\n\n${table}\n`);
            return employeeTracker();
          });
          break;

        // Adds a new role to the roles table in employee_db
        case 'Add Role':
          db.query('SELECT * FROM departments', function (err, results) {
            inquirer
              .prompt([
                {
                  type: 'input',
                  name: 'newRole',
                  message: 'What is the new role called?'
                },
                {
                  type: 'list',
                  name: 'department',
                  message: 'What department will the new role be assigned to?',
                  choices: results.map(obj => obj.name)
                },
                {
                  type: 'input',
                  name: 'salary',
                  message: 'How much is the salary for the role?'
                }
              ])
              .then(function (response) {

                // Capitalizes the user input for the new role
                const newRoleCapitalized = response.newRole.split(' ').map(obj => obj[0].toUpperCase() + obj.substring(1)).join(' ');

                // Retrieves the id number for the chosen department
                const departmentId = results.filter(obj => obj.name === response.department).map(obj => obj.id);

                // Convert salary string to integer
                const salaryInt = parseInt(response.salary);

                // Adds new role into the database
                db.query('INSERT INTO roles (title, department_id, salary) VALUES (?, ?, ?)', [newRoleCapitalized, departmentId, salaryInt], function (err, results) {

                  // If any of the inputs failed, move user back to the general menu
                  if (err) {
                    console.error(err);
                    return employeeTracker();
                  };

                  console.log(`\nThe ${newRoleCapitalized} role has been added to the employee database!\n`);
                  return employeeTracker();
                });
              })
              .catch(err => { console.log(err) });
          });
          break;

        // Shows a table of all departments in employee_db on the console
        case 'View All Departments':
          db.query('SELECT * FROM departments ORDER BY id', function (err, results) {
            const table = cTable.getTable(results);
            console.log(`\n\n${table}\n`);
            return employeeTracker();
          });
          break;

        // Adds a new department to the departments table in employee_db
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

              // Capitalizes all words on the response
              const department = response.departmentName.split(' ').map((words) => {
                return words.substring(0, 1).toUpperCase() + words.substring(1);
              }).join(' ');

              // Adds new department into the database
              db.query(`INSERT INTO departments (name) VALUES (?)`, department);
              console.log(`\nThe ${department} department has been added to the employee database!\n`)
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
