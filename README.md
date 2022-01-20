# employee-tracker
[![license](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

## Description
Terminal app that keeps track of employees, roles at a company, and departments at a company leverage MySQL and Node.js.

## User Story
```
As a business owner, I want to be able to view and manage the departments, roles, and employees in my company so that I can organize and plan my business.
```

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Features](#features)
- [Tests](#tests)
- [Questions](#questions)

## Installation
To get the app on your local machine:
Click on the code button on the repo.
Copy the HTTPS or SSH link.
Run the command `git clone` with the copied HTTPS or SSH link.
In your local repo, open the `.env` file and fill in the fields with your mysql login information.
In the terminal, run the command `npm i`,
then run `mysql -u root -p`.
After logging into mysql, run the command `source db/schema.sql`,
then run `source db/seeds.sql`,
then run `quit`.


## Usage
The visual shows the program being run on a local machine, the functionality, and options.

![Employee Tracker visual](./assets/employee-tracker-visual.gif)

Please click [here](https://youtu.be/ROllFSIcx1c) for a video demo.

## License
This application is covered under the MIT license.

## Features
- View list of employees
- Ability to write, edit and delete employees
- View list of job roles
- Ability to write and delete job roles
- View list of departments
- Ability to write and delete departments

## Tests
In the terminal, the command `npm start` was run which initiates the application. Commands were run as displayed in the video demo. The commands that were not in the video demo were the delete options which were tested and work as intended.

## Questions
To view more of my projects, you can visit my GitHub page at [andrewbyoo](https://github.com/andrewbyoo).
If you have questions, email me at [andrewbyoo@gmail.com](mailto:andrewbyoo@gmail.com).
