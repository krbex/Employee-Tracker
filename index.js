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
                    name: 'View all employees by department',
                    value: 'VIEW_EMPLOYEES_BY_DEPARTMENT'
                },
                {
                    name: 'View all employees by manager',
                    value: 'VIEW_EMPLOYEES_BY_MANAGER'
                },
                {
                    name: 'Add employee',
                    value: 'ADD_EMPLOYEE'
                },
                {
                    name: 'Remove employee',
                    value: 'REMOVE_EMPLOYEE'
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
                    name: 'Remove role',
                    value: 'REMOVE_ROLE'
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
                    name: 'Remove deaprtment',
                    value: 'REMOVE_DEPARTMENT'
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
            case 'VIEW_EMPLOYEES_BY_DEPARTMENT':
                viewEmployeesDepartment();
                break;
            case 'VIEW_EMPLOYEES_BY_MANAGER':
                viewEmployeesManager();
                break;
            case 'ADD_EMPLOYEE':
                addEmployee();
                break;
            case 'REMOVE_EMPLOYEE':
                removeEmployee();
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
            case 'REMOVE_ROLE':
                removeRole();
                break;
            case 'VIEW_DEPARTMENTS':
                viewDepartments();
                break;
            case 'ADD_DEPARTMENT':
                addDepartment();
                break;
            case 'REMOVE_DEPARTMENT':
                removeDepartment();
                break;
            case 'QUIT':
                quit();
        }
    })
}

// Views all employees
function viewEmployees() {
    db.findAllEmployees().then(([rows]) => {
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

        db.findAllRoles().then(([rows]) => {
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

                db.findAllEmployees().then(([rows]) => {
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

                        db.createEmployee(employee);
                    }).then(() => console.log('Added new employee to the database')).then(() => init());
                });
            });
        });
    });
};

// Views employees by department they are in
function viewEmployeesDepartment() {
    db.findAllDepartments().then(([rows]) => {
        let deparments = rows;
        const departmentChoices = deparments.map(({ id, name }) => ({
            name: name,
            value: id
        }));

        prompt([
            {
                type: 'list',
                name: 'departmentID',
                message: 'Which department would you like to review?',
                choices: departmentChoices
            }
        ]).then(res => db.findAllEmployeesDepartment(res.departmentId))
        .then(([rows]) => {
            let employees = rows;
            console.log('\n');
            console.table(employees);
        }).then(() => init());
    });
};

// Views all employees by manager they report to
function viewEmployeesManager() {
    db.findAllEmployees().then(([rows]) => {
        let managers = rows;
        const managerSelected = managers.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        prompt([
            {
                type: 'list',
                name: 'managerId',
                message: 'Whose manager would you like to view?',
                choices: managerSelected
            }
        ]).then(res => db.findAllEmployeesByManager(res.managerId))
        .then(([rows]) => {
            let employees = rows;
            console.log('\n');
            if (employees.length === 0) {
                console.log('This employee does not have a direct manager')
            } else {
                console.table(employees);
            };
        }).then(() => init());
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