INSERT INTO departments (name)
VALUES ('Sales'),
       ('Engineering'),
       ('Finance'),
       ('Legal');

INSERT INTO roles (title, department_id, salary)
VALUES ('Sales Lead', 1, 100000),
       ('Salesperson', 1, 80000),
       ('Lead Engineer', 2, 150000),
       ('Software Engineer', 2, 120000),
       ('Account Manager', 3, 160000),
       ('Accountant', 3, 125000),
       ('Legal Team Lead', 4, 250000),
       ('Lawyer', 4, 190000);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('Jane', 'Doe', 1, NULL),
       ('Frances', 'Bolton', 2, 1),
       ('Marie', 'Maurer', 3, NULL),
       ('Barbara', 'Carter', 4, 3),
       ('Sally', 'Wilson', 5, NULL),
       ('Kareem', 'Saba', 6, 5),
       ('Martha', 'Worm', 7, NULL),
       ('Charles', 'Holland', 8, 7);
