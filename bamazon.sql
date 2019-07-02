DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products (
  item_id INT (10) NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT (10) NOT NULL,
  product_sales DECIMAL(7,2) DEFAULT '0.00',
  
  PRIMARY KEY (item_id)
);

Select * from products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("PS4", "Electronics", 250.00, 20),
("Wii U", "Electronics", 299.99, 6),
("Brita", "Kitchen", 25.00, 15),
("iPhone XR", "Electronics", 799.99, 40),
("'Tennis Racket", "Sports", 100.00, 35),
("Tent", "Camping", 90.00, 100),
("Bicycle", "Sports", 80.00, 40),
("Lunchboxes", "School Accessories", 15.00, 150),
("JanSport Backpack", "School Accessories", 39.99, 120),
("Dog Food", "Pets", 19.99, 80),
("Cat Litter", "Pets", 20.00, 90);

CREATE TABLE departments (
department_id INT (10) NOT NULL AUTO_INCREMENT,
department_name VARCHAR (100) NOT NULL, 
over_head_costs DECIMAL(10,2) NOT NULL DEFAULT '0.00',
total_sales DECIMAL(10,2) NOT NULL DEFAULT '0.00',

PRIMARY KEY (department_id)
);
Select * From departments;

INSERT INTO departments(department_name, over_head_costs)
VALUES ('Kitchen', 15000.00),
    ('Electronics', 12000.00),
    ('Sports', 15000.00),
    ('Camping', 12000.00),
    ('School Accessories', 15000.00),
    ('Pets', 12000.00);

