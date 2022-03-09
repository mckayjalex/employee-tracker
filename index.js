const inquirer = require('inquirer');
const mysql = require('mysql2');
const conTable = require('console.table');
const logo = require('asciiart-logo');
const config = require('./package.json');
// console.log(logo(config).render());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employees_db'
    }
);
// INIT Function
const init = () => {
    hello();
    menu();
}
// Function to display an Employee manager message and start the app
const hello = () => {
    console.log(
        logo({
            name: 'Employee Manager',
            font: 'ANSI Shadow',
            lineChars: 10,
            padding: 2,
            margin: 3,
            borderColor: 'white',
            logoColor: 'green',
            textColor: 'green',
        })
            .render()
    );
}
// Function to display goodbye message and exit the app
const goodbye = () => {
    console.log(
        logo({
            name: 'Goodbye',
            font: 'ANSI Shadow',
            lineChars: 10,
            padding: 2,
            margin: 3,
            borderColor: 'white',
            logoColor: 'red',
            textColor: 'red',
        })
            .render()
    );
    process.exit();
}
// MENU function
const menu = () => {
    inquirer
        .prompt([
            {
                name: "opening",
                message: "What would you like to do?",
                type: "list",
                choices: ['View Departments', 'View Roles', 'View Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Update Employee Managers', 'View Employees by Manager', 'View Employees by Department', 'Delete Employee', 'Delete Role', 'Delete Department', 'View Tolal Department Budget Status', 'Quit']
            }
        ])
        .then((data) => {
            switch (data.opening) {
                case 'View Departments':
                    viewDepartment();
                    break;
                case 'View Roles':
                    viewRoles();
                    break;
                case 'View Employees':
                    viewEmployees();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;
                case 'Update Employee Managers':
                    updateEmployeeManager();
                    break;
                case 'View Employees by Manager':
                    viewEmployeeByManager();
                    break;
                case 'View Employees by Department':
                    viewEmployeeByDepartment();
                    break;
                case 'Delete Employee':
                    deleteEmployee();
                    break;
                case 'Delete Role':
                    deleteRole();
                    break;
                case 'Delete Department':
                    deleteDepartment();
                    break;
                case 'View Tolal Department Budget Status':
                    viewStatus();
                    break;
                default:
                    goodbye();
            }
        })
        .catch((error) => console.log(error));
}
// View Department
const viewDepartment = () => {
    const sql = 'SELECT id AS ID, name AS Department FROM department;';
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log();
        console.table(result);
        menu();
    })
}
// View Roles
const viewRoles = () => {
    const sql = 'SELECT role.id AS ID, role.title AS Title, department.name AS Department, role.salary AS Salary FROM department JOIN role ON department.id=role.department_id ORDER BY role.id;';
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log();
        console.table(result);
        menu();
    })
}
// View Employees
const viewEmployees = () => {
    const sql = 'SELECT emp.id AS ID, CONCAT(emp.first_name, " ", emp.last_name) AS Name, role.title AS Role, department.name AS Department, role.salary AS Salary, CONCAT(man.first_name, " ", man.last_name) AS Manager FROM employee emp JOIN role ON role.id=emp.role_id JOIN department ON department.id=role.department_id LEFT JOIN employee man ON man.id=emp.manager_id ORDER BY emp.id;';
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log();
        console.table(result);
        menu();
    })
}
// Add Department
const addDepartment = () => {
    inquirer
        .prompt([
            {
                name: 'dept',
                message: 'Please enter name of the department?',
                type: 'input'
            }
        ])
        .then((data) => {
            const sql = 'INSERT INTO department (name) VALUES (?);';
            db.query(sql, data.dept, (err) => {
                if (err) {
                    console.log(err);
                }
                console.log();
                console.log(`${data.dept} department succesfully added!`);
                console.log();
                menu();
            })

        })
        .catch((error) => console.log(error));
}
// Add Role
const addRole = () => {
    db.query(`SELECT * FROM department;`, (err, result) => {
        if (err) {
            console.log(err);
        }
        const dept = result.map(({ name }) => {
            return name;
        })

        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'role',
                    message: 'What is the name of the role?'
                },
                {
                    type: 'number',
                    name: 'roleSalary',
                    message: 'What is the salary for this role?'
                },
                {
                    type: 'list',
                    name: 'roleDebt',
                    message: 'What department does the role belong to?',
                    choices: dept
                },
            ])
            .then((data) => {
                const deptId = dept.indexOf(data.roleDebt) + 1;
                const sql = `INSERT INTO role(title, salary, department_id) VALUES (?, ?, ?)`;
                const param = [data.role, data.roleSalary, deptId];

                db.query(sql, param, () => {
                    if (err) {
                        console.log(err);
                    }
                    console.log();
                    console.log(`${data.role} role successfully added!`);
                    console.log();
                    menu();
                });
            });
    });
}
// Add Employee
const addEmployee = () => {
    db.query('SELECT title FROM role;', (err, result) => {
        if (err) {
            console.log(err);
        }
        const role = result.map(({ title }) => {
            return title;
        })
        inquirer
            .prompt([
                {
                    name: 'firstName',
                    message: 'Please enter a First name?',
                    type: 'input'
                },
                {
                    name: 'lastName',
                    message: 'Please enter a Last name?',
                    type: 'input'
                },
                {
                    name: 'role',
                    message: 'Please select the employees role?',
                    type: 'list',
                    choices: role
                }
            ])
            .then((data) => {
                const roleId = role.indexOf(data.role) + 1;
                const param = [data.firstName, data.lastName, roleId];
                db.query('SELECT id, CONCAT(first_name," ", last_name) AS name FROM employee;', (err, result) => {
                    if (err) {
                        console.log(err)
                    }
                    const manager = result.map(({ name, id }) => {
                        return {
                            id,
                            name
                        }
                    })
                    console.table(manager);
                    inquirer
                        .prompt([
                            {
                                name: 'managerId',
                                message: 'Please enter your managers ID number from the list above',
                                type: 'input'
                            }
                        ])
                        .then((data) => {
                            param.push(data.managerId);
                            db.query('INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?);', param, (err, result) => {
                                if (err) {
                                    console.log(err);
                                }
                                console.log();
                                console.log(`${param[0]} ${param[1]} is now a registered employee!`);
                                console.log();
                                menu();
                            })
                        })
                        .catch((err) => console.log(err));
                })
            })
            .catch((error) => console.log(error));
    })
}
// Update Employee Role
const updateEmployeeRole = () => {
    db.query('SELECT CONCAT(first_name, " ", last_name) AS name FROM employee;', (err, result) => {
        if (err) {
            console.log(err);
        }
        const employees = result.map(({ name }) => {
            return name;
        })
        inquirer
            .prompt([
                {
                    name: 'employee',
                    message: 'Please select the employee you would like to update?',
                    type: 'list',
                    choices: employees
                }
            ])
            .then((data) => {
                const emp = data.employee;
                const empId = employees.indexOf(data.employee) + 1;
                db.query('SELECT title FROM role;', (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    const role = result.map(({ title }) => {
                        return title;
                    })
                    inquirer
                        .prompt([
                            {
                                name: 'role',
                                message: 'Please select the employees new role',
                                type: 'list',
                                choices: role
                            }
                        ])
                        .then((data) => {
                            const roleId = role.indexOf(data.role) + 1;
                            const param = [roleId, empId];
                            const sql = 'UPDATE employee SET role_id = (?) WHERE id = (?);'
                            db.query(sql, param, (err, result) => {
                                if (err) {
                                    console.log(err);
                                }
                                console.log();
                                console.log(`${emp}'s role was updated!`);
                                console.log();
                                menu();
                            })
                        })
                })
            })
            .catch((err) => console.log(err));
    })
}
// Update Employee Manager
const updateEmployeeManager = () => {
    db.query('SELECT CONCAT(first_name, " ", last_name) AS name FROM employee;', (err, result) => {
        if (err) {
            console.log(err);
        }
        const employees = result.map(({ name }) => {
            return name;
        })
        inquirer
            .prompt([
                {
                    name: 'employee',
                    message: 'Please select the employee you wish to update?',
                    type: 'list',
                    choices: employees
                },
                {
                    name: 'newManager',
                    message: 'Please select the employees new manager?',
                    type: 'list',
                    choices: employees
                }
            ])
            .then((data) => {
                const empId = employees.indexOf(data.employee) + 1;
                const manId = employees.indexOf(data.newManager) + 1;
                const param = [manId, empId];
                console.log(param)
                const sql = 'UPDATE employee SET manager_id = (?) WHERE id = (?);';
                db.query(sql, param, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log();
                    console.log(`${data.employee} has a new manager!`);
                    console.log();
                    menu();
                })
            })
            .catch((err) => console.log(err));
    })
}
// View Employee by Manager
const viewEmployeeByManager = () => {
    db.query('SELECT CONCAT(first_name, " ", last_name) AS name FROM employee;', (err, result) => {
        if (err) {
            console.log(err);
        }
        const employees = result.map(({ name }) => {
            return name;
        })
        inquirer
            .prompt([
                {
                    name: 'managersTeam',
                    message: 'Please select which managers team you would like to view?',
                    type: 'list',
                    choices: employees
                }
            ])
            .then((data) => {
                const manId = employees.indexOf(data.managersTeam) + 1;
                const sql = 'SELECT id AS ID, CONCAT(first_name, " ", last_name) AS Name FROM employee WHERE manager_id = (?);';
                db.query(sql, manId, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    if (result.length === 0) {
                        console.log();
                        console.log(`${data.managersTeam} is not a manager!`);
                        console.log();
                    } else {
                        console.log();
                        console.table(result);
                    }
                    menu();
                })
            })
            .catch((err) => console.log(err));
    })
}
// View Employees by Department
const viewEmployeeByDepartment = () => {
    db.query('SELECT name FROM department;', (err, result) => {
        if (err) {
            console.log(err);
        }
        const dept = result.map(({ name }) => {
            return name;
        })
        inquirer
            .prompt([
                {
                    name: 'dept',
                    message: 'Please select deaprtment in which youd like to view employees?',
                    type: 'list',
                    choices: dept
                }
            ])
            .then((data) => {
                const deptId = dept.indexOf(data.dept) + 1;
                const sql = 'SELECT employee.id AS ID, CONCAT(first_name, " ", last_name) AS Name, title AS Title, salary AS Salary FROM employee JOIN role ON role.id=employee.role_id JOIN department ON department.id=role.department_id WHERE role.department_id = (?);';
                db.query(sql, deptId, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log();
                    console.table(result);
                    menu();
                })
            })
    })
}
// Delete Employee
const deleteEmployee = () => {
    db.query('SELECT CONCAT(first_name, " ", last_name) AS name FROM employee;', (err, result) => {
        if (err) {
            console.log(err);
        }
        const employees = result.map(({ name }) => {
            return name;
        })
        inquirer
            .prompt([
                {
                    name: 'employee',
                    message: 'Please select which employee you would like to delete?',
                    type: 'list',
                    choices: employees
                }
            ])
            .then((data) => {
                const emp = data.employee.split(" ");
                const sql = 'DELETE FROM employee WHERE first_name = (?);';
                db.query(sql, emp[0], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log();
                    console.log(`${data.employee} deleted from database!`);
                    console.log();
                    menu();
                })
            })
            .catch((err) => console.log(err));
    })
}
// Delete Role
const deleteRole = () => {
    db.query('SELECT title FROM role;', (err, result) => {
        if (err) {
            console.log(err);
        }
        const role = result.map(({ title }) => {
            return title;
        })
        inquirer
            .prompt([
                {
                    name: 'role',
                    message: 'Please select which role you would like to delete?',
                    type: 'list',
                    choices: role
                }
            ])
            .then((data) => {
                const title = data.role;
                db.query('DELETE FROM role WHERE title = (?);', title, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log();
                    console.log(`${data.role} deleted from database!`);
                    console.log();
                    menu();
                })
            })
            .catch((err) => console.log(err));
    })
}
// Delete Department
const deleteDepartment = () => {
    db.query('SELECT name FROM department;', (err, result) => {
        if (err) {
            console.log(err);
        }
        const dept = result.map(({ name }) => {
            return name;
        })
        inquirer
            .prompt([
                {
                    name: 'dept',
                    message: 'Please select which role you would like to delete?',
                    type: 'list',
                    choices: dept
                }
            ])
            .then((data) => {
                const name = data.dept;
                db.query('DELETE FROM department WHERE name = (?);', name, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log();
                    console.log(`${data.dept} deleted from database!`);
                    console.log();
                    menu();
                })
            })
            .catch((err) => console.log(err));
    })
}
// View Total Department Budget Status
const viewStatus = () => {
    db.query('SELECT name FROM department;', (err, result) => {
        if(err) {
            console.log(err);
        }
        const dept = result.map(({ name }) => {
            return name;
        })
        inquirer
            .prompt([   
                {
                    name: 'dept',
                    message: 'Please select which departments budget you would like to view?',
                    type: 'list',
                    choices: dept
                }
            ])
            .then((data) => {
                const department = data.dept;
                const sql = 'SELECT SUM(salary) AS Total FROM role JOIN department ON department.id=role.department_id WHERE department.name = (?);';
                db.query(sql, department, (err, result) => {
                    if(err) {
                        console.log(err);
                    }
                    console.log();
                    console.log(`Total Budget for ${department}`);
                    console.log();
                    console.table(result);
                    menu();
                })
            })
            .catch((err) => console.log(err));
    })
}
// Initialize the app
init();