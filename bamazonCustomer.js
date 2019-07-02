// The customer module is part of bamazon.
// Users can view a list of products in bamazon.
// And select to purchase products.

// Required node modules.
var mysql = require("mysql");
var inquirer = require("inquirer");

// Connects to the database.
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Root is default username.
  user: "root",
  // Password is empty string.
  password: "Pablo@12396",
  database: "bamazon_db"
});


// If connection doesn't work, throws error, else...
connection.connect(function(err) {
  if (err) throw err;

  // Displays list of available products.
  displayProducts();

});

// Displays list of all available products.
var displayProducts = function() {
	var query = "Select * FROM products";
	connection.query(query, function(err, res) {

		if (err) throw err;

		for (var i = 0; i < res.length; i++) {
			console.log("Product ID: " + res[i].item_id + " || Product Name: " +
						res[i].product_name + " || Price: " + res[i].price);
		}

		// Requests product and number of product items user wishes to purchase.
  		requestProduct();
	});
};

// Requests product and number of product items user wishes to purchase.
var requestProduct = function() {
	inquirer.prompt([{
		name: "productID",
		type: "input",
		message: "Please enter product ID for product you want.",
		validate: function(value) {
			if (isNaN(value) === false) {
				return true;
			}
			return false;
		}
	}, {
		name: "productUnits",
		type: "input",
		message: "How many units do you want?",
		validate: function(value) {
			if (isNaN(value) === false) {
				return true;
			}
			return false
		}
	}]).then(function(answer) {

		// Queries database for selected product.
		var query = "Select stock_quantity, price, product_sales, department_name FROM products WHERE ?";
		connection.query(query, { item_id: answer.productID}, function(err, res) {
			
			if (err) throw err;

			var available_stock = res[0].stock_quantity;
			var price_per_unit = res[0].price;
			var productSales = res[0].product_sales;
			var productDepartment = res[0].department_name;

			// Checks there's enough inventory  to process user's request.
			if (available_stock >= answer.productUnits) {

				// Processes user's request passing in data to complete purchase.
				completePurchase(available_stock, price_per_unit, productSales, productDepartment, answer.productID, answer.productUnits);
			} else {

				// Tells user there isn't enough stock left.
				console.log("There isn't enough stock left!");

				// Lets user request a new product.
				requestProduct();
			}
		});
	});
};


// Completes user's request to purchase product.
var completePurchase = function(availableStock, price, productSales, productDepartment, selectedProductID, selectedProductUnits) {
	
	// Updates stock quantity 
	var updatedSQ = availableStock - selectedProductUnits;

	// Calculates total price for purchase
	var totalPrice = price * selectedProductUnits;

	// Updates total product sales.
	var updatedPS = parseInt(productSales) + parseInt(totalPrice);
	
	// Updates stock quantity based on user's purchase.
	var query = "UPDATE products SET ? WHERE ?";
	connection.query(query, [{
		stock_quantity: updatedSQ,
		product_sales: updatedPS
	}, {
		item_id: selectedProductID
	}], function(err, res) {

		if (err) throw err;
		// Tells user purchase is a success.
		console.log("Your purchase is complete.");

		// Total price of purchase.
		console.log("Your payment has been received : " + "$" + totalPrice);

		// Updates department revenue based off of purchace.
		updatedDR(updatedPS, productDepartment);
		
	});
};

// Updates total sales for department after completed purchase.
var updatedDR = function(updatedPS, productDepartment) {

	// Query database for total sales value for department.
	var query = "Select total_sales FROM departments WHERE ?";
	connection.query(query, { department_name: productDepartment}, function(err, res) {

		if (err) throw err;

		var departmentSales = res[0].total_sales;

		var updatedDS = parseInt(departmentSales) + parseInt(updatedPS);

		// Completes update to total sales for department.
		completeDepartmentSalesUpdate(updatedDS, productDepartment);
	});
};

// Completes update to total sales for department on database.
var completeDepartmentSalesUpdate = function(updatedDS, productDepartment) {

	var query = "UPDATE departments SET ? WHERE ?";
	connection.query(query, [{
		total_sales: updatedDS
	}, {
		department_name: productDepartment
	}], function(err, res) {

		if (err) throw err;

		// Displays products so user can choose to make another purchase.
		displayProducts();
	});
};