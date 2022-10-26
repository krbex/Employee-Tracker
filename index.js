const { prompt } = require('inquirer');
const { default: ListPrompt } = require('inquirer/lib/prompts/list');
const db = require('./db/table');
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
        switch(input) {
            case 'VIEW_EMPLOYEES':
                viewEmployees();
                break;
            case 'ADD_EMPLOYEE':
                addEmployee();
                break;
            case 'UPDATE_EMPLOYEE_ROLE':
                updateEmployee();
                break;
            case 'UPDATE_EMPLOYEE_ROLE':
                updateRole();
                break;
            case 'VIEW_ROLES':
                viewRole();
                break;
            case 'ADD_ROLE':
                addRole();
                break;
            case 'VIEW_DEPARTMENTS':
                viewDepartments();
                break;
            case 'ADD_DEPARTMENT':
                addDepartment();
                break;
            case 'QUIT':
                quit();
        }
    })
}

// Views all employees
function viewEmployees() {
    db.findEmployees().then(([rows]) => {
        let employees = rows;
        console.log('\n');
        console.table(employees)
    }).then(() => init());
}

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


// View departments
function viewDepartments() {
    db.findAllDepartments().then(([rows]) => {
        let departments = rows;
        console.log('\n');
        console.table(departments);
    }).then(() => init())
}