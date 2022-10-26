const connection = require('./connection');

class awfulTable {
    constructor(connection) {
        this.connection = connection
    }

    findEmployees() {
        return this.connection.promise().query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;");
    }

    addEmployee() {
        return this.connection.promise().query("INSERT INTO employee SET ?", employee);
    }

    findManagers() {
        return this.connection.promise().query("SELECT id, first_name, last_name FROM employee WHERE id != ?");
    }

    viewDepartments() {
        return this.connection.promise().query("SELECT department.id, department.name FROM department LEFT JOIN department on role.department_id;");
    }

    findRoles() {
        return this.connection.promise().query("SELECT role.id, role.title FROM roles;");
    }

    findEmployeesDepartment() {
        return this.connection.promise().query("SELECT department.id, department.name FROM department;")
    }

    findEmployeesByManager() {
        return this.connection.promise().query("SELECT employee.id, employee.first_name, employee.last_name, department.role, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE manager_id = ?;", managerId);
    }
}

module.exports = new awfulTable(connection)