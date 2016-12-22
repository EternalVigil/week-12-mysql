// Amyzon CLI
var inquirer = require("inquirer");
var mysql = require("mysql");

function userLogin() {
	"use strict";
	//Path selection for user action
	inquirer.prompt([{
		name: "userChoice",
		type: "list",
		message: "Select User Action:",
		choices: ["User Login", "Create New User", "Exit"]

	}]).then(function (answers) {
		if (answers.userChoice === "User Login") {
			goShopping();
		} else if (answers.userChoice === "Create New User") {
			createUser();
		} else if (answers.userChoice === "Exit") {
			return console.log("Come back when you feel like shopping!!!");
		} else {
			return console.log("You broke the command line; I hope you're proud of what you did.");
		}

	});
}

function goShopping() {
	"use strict";
	var connection = Connection();
	connection.query("SELECT productName from products", function (error, data) {
		if (error) {
			return console.log(error);
		}
		var productList = [];
		for (var i = 0; i < data.length; i++) {
			productList.push(data[i].productName);
		}
		

		inquirer.prompt([{
				name: "productChoice",
				type: "list",
				message: "Select the product you wish to buy",
				choices: productList
			}, {
				name: "qtyInput",
				type: "input",
				message: "And how many of that item would you like?"
			}

		]).then(function (answers) {
			getQty(connection, answers.productChoice, answers.qtyInput);
			
		});



	});
}

//Create connection to MySQL database
function Connection() {
	"use strict";
	var connection = mysql.createConnection({
		host: "localhost",
		port: 3306,
		user: "root",
		password: "password",
		database: "AmyzonDB",

	});
	connection.connect(function (err) {
		if (err) {
			return console.log("Error Code: " + err);
		} else {
			console.log("connected to database. " + connection.threadId);
		}
	});
	return connection;

}

function getQty(connection, product, qtyRequest) {
	"use strict";
	console.log("Getting product available quantity.");
	connection.query("SELECT productQty from products WHERE ?", [{productName: product}], function (error, response) {
		if (error) {
			return console.log(error);
		}
		console.log("database query established.");
		var availableStock = response[0].productQty;
		
		console.log(availableStock + " " + qtyRequest);
		
		if (availableStock >= qtyRequest){
			console.log("We have enough.");
			updateQty(connection, product, availableStock, qtyRequest);
		}
		else if (availableStock < qtyRequest){
			console.log("We don't have enough.");
		}
		else{
			console.log("I dunno.");
		}
		
	});
}

function updateQty(connection, product, availableQty, desiredQty) {
	"use strict";
	connection.query("UPDATE products SET ? WHERE ?", [{
		productQty: availableQty - desiredQty
	}, {
		productName: product
	}], function (error, response) {
		if (error) {
			return console.log(error);
		}
		console.log(response);
	});
}

userLogin();
