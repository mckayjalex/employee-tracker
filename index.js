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
                choices: ['View Departments', 'View Roles', 'View Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Update Employee Managers', 'View Employees by Manager', 'View Employees by Department', 'Delete Employee', 'Delete Role', 'Delete Departmntt', 'View Tolal Department Budget Status', 'Quit']
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
                    // updateEmployeeRole();
                    break;
                case 'Update Employee Managers':
                    // updateEmployeeManager();
                    break;
                case 'View Employees by Manager':
                    // viewEmployeeByManager();
                    break;
                case 'View Employees by Department':
                    // viewEmployeeByDepartment();
                    break;
                case 'Delete Employee':
                    // deleteEmployee();
                    break;
                case 'Delete Role':
                    // deleteRole();
                    break;
                case 'Delete Department':
                    // deleteDepartment();
                    break;
                case 'View Tolal Department Budget Status':
                    // ViewStatus();
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
        console.log('');
        console.table(result);
        console.log('');
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
        console.log('');
        console.table(result);
        console.log('');
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
        console.log('');
        console.table(result);
        console.log('');
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
                console.log('');
                console.table(`${data.dept} department succesfully added!`);
                console.log('');
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
                    console.log('');
                    console.log(`${data.role} role successfully added!`);
                    console.log('');
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
                    if(err) {
                        console.log(err)
                    }
                    const manager = result.map(({name, id}) => {
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
                                message:'Please enter your managers ID number?',
                                type: 'input'
                            }
                        ])
                        .then((data) => {
                             param.push(data.managerId);
                             db.query('INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?);', param, (err, result) => {
                                 if(err) {
                                     console.log(err);
                                 }
                                 console.log('');
                                 console.log(`${param[0]} ${param[1]} is now a registered employee!`);
                                 console.log('');
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
// const updateEmployeeRole = () => {

// }
// Update Employee Manager
// const updateEmployeeManager = () => {

// }
// View Employee by Manager
// const viewEmployeeByManager = () => {

// }
// View Employees by Department
// const viewEmployeeByDepartment = () => {

// }
// Delete Employee
// const deleteEmployee = () => {

// }
// Delete Role
// const deleteRole = () => {

// }
// Delete Department
// const deleteDepartment = () => {

// }
// View Total Department Budget Status
// const viewStatus = () => {

// }
// Initialize the app
init();