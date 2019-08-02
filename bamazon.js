var mysql = require('mysql');
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Brandon9',
  database: 'bamazon',
  port: 3306
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected successfully!")
  displayProducts();
});

//display list of products to users
function displayProducts() {

  connection.query('SELECT * FROM products', function (error, results, fields) {
    if (error) throw error;
    console.table(results);
    ask();
  });

}
//ask user what product(id) they would like to purchase and how many

function ask() {
  inquirer
    .prompt([
      {
        name: "idNumber",
        type: "input",
        message: "What is the id number of the product you would like to purchase?",
      }
    ])
    .then(function (answer) {
      //console.log(answer.idNumber);
      var item = connection.query('SELECT * FROM products WHERE id= ?', [answer.idNumber], function (error, results, fields) {
        if (error) throw error;
        console.table(results);
        howMany(results);
      });
    });
};

function howMany(results) {
  inquirer
    .prompt([

      {
        name: "idQuantity",
        type: "input",
        message: "How many would you like to purchase?",
      }
    ])
    .then(function (answer) {
      console.log(answer.idQuantity);
      if (answer.idQuantity <= results[0].stock_quantity) {
        var total = results[0].stock_quantity - answer.idQuantity;
        //if stock_quantity > answer.idQuantity then (answer.idQuantity * price)
        console.log("Thank you for your purchase! Your total is: $" + (answer.idQuantity * results[0].price));

      }
      // else console.log("Insufficient Quantity!")
      else {
        console.log("Sorry....insufficient quantity!")
        displayProducts();
        return;
      }
      connection.query("update products set ? where ?",
        [{ stock_quantity: total }, { id: results[0].id }],
        function () {
          displayProducts();
        })

    })

}

//connection.end();