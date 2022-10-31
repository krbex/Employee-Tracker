const { prompt } = require('inquirer');
const { default: ListPrompt } = require('inquirer/lib/prompts/list');
const db = require('./db');
require('console.table');

init();

function init() {
    prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'Lets get started',
            choices: [
                {
                    name: 'View all employees',
                    value: 'VIEW_EMPLOYEES'
                },
                {
                    name: 'Add employee',
                    value: 'ADD_EMPLOYEE'
                },
                {
                    name: 'Update employee role',
                    value: 'UPDATE_EMPLOYEE_ROLE'
                },
                {
                    name: 'View all roles',
                    value: 'VIEW_ROLES'
                },
                {
                    name: 'Add role',
                    value: 'ADD_ROLE'
                },
                {
                    name: 'View all departments',
                    value: 'VIEW_DEPARTMENTS'
                },
                {
                    name: 'Add department',
                    value: 'ADD_DEPARTMENT'
                },
                {
                    name: 'Quit',
                    value: 'QUIT'
                },
            ]
        }
    ]).then(res => {
        let input = res.choice;
        switch (input) {
            case 'VIEW_EMPLOYEES':
                viewEmployees();
                break;
            case 'ADD_EMPLOYEE':
                addEmployee();
                break;
            case 'VIEW_ROLES':
                viewRole();
                break;
            case 'UPDATE_EMPLOYEE_ROLE':
                updateRole();
                break;
            case 'ADD_ROLE':
                createRole();
                break;
            case 'VIEW_DEPARTMENTS':
                viewDepartments();
                break;
            case 'ADD_DEPARTMENT':
                addDepartment();
                break;
            case 'QUIT':
                quit();
        };
    });
};

// Views all employees
function viewEmployees() {
    db.findEmployees().then(([rows]) => {
        let employees = rows;
        console.table(employees)
    }).then(() => init());
};

// Add employee
function addEmployee() {
    prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'What is the new employees first name?'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'What is the new employees last name?'
        }
    ]).then(res => {
        let firstName = res.first_name
        let lastName = res.last_name

        db.findRoles().then(([rows]) => {
            let roles = rows;
            const roleChoice = roles.map(({ id, title }) => ({
                name: title,
                value: id
            }));

            prompt({
                type: 'list',
                name: 'roleId',
                message: 'What is the new employees role?',
                choices: roleChoice
            }).then(res => {
                let roleId = res.roleId;

                db.findEmployees().then(([rows]) => {
                    let employees = rows;
                    const managerChoice = employees.map(({ id, first_name, last_name }) => ({
                        name: `${first_name} ${last_name}`,
                        value: id
                    }));

                    managerChoice.unshift({ name: 'None', value: null });

                    prompt({
                        type: 'list',
                        name: 'managerId',
                        message: 'Who is the new employees manager',
                        choices: managerChoice
                    }).then(res => {
                        let employee = {
                            manager_id: res.managerId,
                            role_id: roleId,
                            first_name: firstName,
                            last_name: lastName
                        }

                        db.addEmployee(employee);
                    }).then(() => console.log('Added new employee to the database')).then(() => init());
                });
            });
        });
    });
};

// View roles
function viewRole() {
    db.findRoles()
        .then(([rows]) => {
            let roles = rows;
            console.table(roles);
        }).then(() => init());
};

// Add role
function createRole() {
    db.viewDepartments().then().then(([rows]) => {
        let departments = rows;
        const departmentChoice = departments.map(({ id, name }) => ({
            name: name,
            value: id
        }));

        prompt([
            {
                type: 'input',
                message: 'What is the name of the role',
                name: 'title'
            },
            {
                type: 'input',
                message: 'What is the salary of the role',
                name: 'salary'
            },
            {
                type: 'list',
                message: 'What department is this role a part of',
                name: 'department_id',
                choices: departmentChoice
            }
        ]).then(role => {
            db.addRole(role).then(() => console.log('Role added')).then(() => init())
        })
    })
}

// Update role
function updateRole() {
    db.findEmployees().then(([rows]) => {
        let employees = rows;
        const employeeChoice = employees.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: 'Which employee would you like to update?',
                choices: employeeChoice
            }
        ]).then(res => {
            let employeeId = res.employeeId;
            db.findRoles().then(([rows]) => {
                let roles = rows;
                const roleChoice = roles.map(({ id, title }) => ({
                    name: title,
                    value: id
                }));

                prompt([
                    {
                        type: 'list',
                        name: 'roleId',
                        message: 'Which role do you want this employee assigned to?',
                        choices: roleChoice
                    }
                ]).then(res => db.updateRole(employeeId, res.roleId))
                .then(() => console.log('Update successful')).then(() => init());
            });
        });
    });
};

// View departments
function viewDepartments() {
    db.viewDepartments().then(([rows]) => {
        let departments = rows;
        console.table(departments);
    }).then(() => init());
};

// Add department
function addDepartment() {
    prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What department would you like to add?'
        }
    ]).then(res => {
        db.createDepartment(res).then(() => console.log('Department added'))
        .then(() => init())
    });
};

// Quit
function quit() {
    process.exit();
};