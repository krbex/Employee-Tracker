INSERT INTO department (id, department_name)
VALUES  (1, 'Accounting'),
        (2, 'Finance'),
        (3, 'Legal'),
        (4, 'Sales'),
        (5, 'Marketing'),
        (6, 'Operations');

INSERT INTO roles (id, title, salary, department_id)
VALUES  (11, 'Lawyer', 75000, 3),
        (12, 'Accountant', 65000, 1),
        (13, 'Business Development', 45000, 4),
        (14, 'Financial Analyst', 60000, 2),
        (15, 'Marketing Coordinator', 50000, 5),
        (16, 'Operations Analyst', 50000, 6);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES  (101, 'Dalinar', 'Kholin', 6, NULL),
        (102, 'Adolin', 'Kholin', 1, 101),
        (103, 'Kaladin', 'Stormblessed', 3, 101),
        (104, 'Torol', 'Sadeas', 2, NULL),
        (105, 'Rysn', 'Ftori', 4, NULL),
        (106, 'Shallan', 'Davar', 5, 101);
