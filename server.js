const inquirer = require('inqurier');

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
};

// Initialize app
employeeTracker();
