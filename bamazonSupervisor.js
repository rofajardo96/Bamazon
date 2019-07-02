
// Required node modules.
var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");

// Connects to database.
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  // Root is default username.
  user: "root",
  // Password is empty string.
  password: "",
  database: "bamazon_db"
});

// If connection doesn't work, throws error, else...
connection.connect(function(err) {
  if (err) throw err;

  // Lets supervisor pick action.
  selectAction();

});

// Supervisor can view product sales or instead create department.
var selectAction = function() {
	inquirer.prompt([
	{
		type: 'list',
		name: 'action',
		message: 'What would you like to do?',
		choices: [
			"View Department Product Sales",
			"Create New Department"
		]
	}
	]).then(function(answer) {

		// Functions called based on supervisor's selection.
		switch (answer.action) {
		    case "View Product Sales by Department":
		    	viewDepartmentSales();
		      	break;

		    case "Create New Department":
		    	createDepartment();
		      	break;
		}
	});
};

// The Supervisor can view the product sales by each department.

var viewDepartmentSales = function() {
	var query = "Select department_id AS department_id, department_name AS department_name," +
				"over_head_costs AS over_head_costs, total_sales AS total_sales," +
				"(total_sales - over_head_costs) AS total_profit FROM departments";
	connection.query(query, function(err, res) {
		if (err) throw err;
		// Product sales displayed using console table npm
		console.table(res);
		selectAction();
	});
};

//Supervisor creates new department.
var createDepartment = function() {
		inquirer.prompt([{
		name: "department_name",
		type: "input",
		message: "What is the new department name?"
	}, {
		name: "over_head_costs",
		type: "input",
		message: "What are the overhead costs?"
	}]).then(function(answer) {
		// Department added to departments database.
		connection.query("INSERT INTO departments SET ?", {
			department_name: answer.department_name,
			over_head_costs: answer.over_head_costs
		}, function(err, res) {
			if (err) {
				throw err;
			} else {
				console.log("Your department was added");
				selectAction();
			}
		});
	});
};