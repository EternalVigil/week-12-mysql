// Amyzon CLI
var inquirer = require("inquirer");
var mysql = require("mysql");

function userInput() {
	"use strict";
	inquirer.prompt([{
		name: "userChoice",
		type: "list",
		message: "Select User Action:",
		choices: ["User Login", "Create New User", "Exit"]

	}]).then(function (answers) {
		if (answers.userChoice === "User Login") {
			userLogin();
		} else if (answers.userChoice === "Create New User") {
			createUser();
		} else if (answers.userChoice === "Exit") {
			return console.log("Come back when you feel like shopping!!!");
		} else {
			return console.log("You broke the command line; I hope you're proud of what you did.");
		}

	});
}

function userLogin() {
	"use strict";
	var connection = Connection();
	
	connection.query("SELECT productName from products", function(error, data){
		if (error){
			return console.log(error);
		}
		var productList = [];
		for (var i = 0; i < data.length; i++){
			productList.push(data[i].productName);
		}

		inquirer.prompt([
			{
				name: "productChoice",
				type: "list",
				message: "Select the product you wish to buy",
				choices: productList
			},
			{
				name: "qtyInput",
				type: "input",
				message: "And how many of that item would you like?"
			}
			
		]).then(function(answers){
			connection.query("SELECT productQty from products WHERE ?", {productName:answers.productChoice}, function(error, result){
				if (answers.qtyInput > result){
					return console.log("Sorry, we don't have that many of that item in stock...");
				}
				else{
					console.log("You're in luck, we have more than enough.");
				}
			});
			
			console.log("Total comes out to $; cash or charge?");
		});
		
		
	});

}

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


userInput();
