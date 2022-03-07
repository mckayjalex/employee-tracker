INSERT INTO department (name)
VALUES ("Marketing"),
       ("Human Resources"),
       ("Finance"),
       ("Sales"),
       ("Operations"),
       ("Business");

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 100000, 1),
       ("Accountant", 75000, 3),
       ("Salesperson", 70000, 4),
       ("Analyst", 90000, 3),
       ("HR Rep", 65000, 2),
       ("Technician", 80000, 5),
       ("CEO", 500000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Sam", "Welsh", 6, 7),
       ("Sarah", "McKinnion", 2, 8),
       ("Alex", "McKay", 4, 7),
       ("Brandon", "Storrey", 6, 7),
       ("Amanda", "Sampson", 2, 8),
       ("Zara", "Jaffer", 3, 8),
       ("Bob", "Marley", 1, 10),
       ("Paul", "Vourn", 1, 10),
       ("Rachel", "Vale", 5, 8),
       ("Adam", "Lorey", 7, null);