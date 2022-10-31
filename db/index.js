const connection = require('./connection');

class awfulTable {
    constructor(connection) {
        this.connection = connection
    }

    findEmployees() {
        return this.connection.promise().query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.last_name AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;");
    }

    addEmployee(employee) {
        return this.connection.promise().query("INSERT INTO employee SET ?", employee);
    }

    findManagers() {
        return this.connection.promise().query("SELECT id, first_name, last_name FROM employee WHERE id != ?");
    }

    viewDepartments() {
        return this.connection.promise().query("SELECT department.id, department.name FROM department;");
    }

    createDepartment(department) {
        return this.connection.promise().query("INSERT INTO department SET ?", department)
    }

    findRoles() {
        return this.connection.promise().query("SELECT role.id, role.title FROM role;");
    }

    updateRole(employeeId, roleId) {
        return this.connection.promise().query("UPDATE employee SET role_id = ? WHERE id = ?", [roleId, employeeId]);
    }

    addRole(role) {
        return this.connection.promise().query("INSERT INTO role SET ?", role);
    }

    findEmployeesDepartment() {
        return this.connection.promise().query("SELECT department.id, department.name FROM department;");
    }
};

module.exports = new awfulTable(connection);