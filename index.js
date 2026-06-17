const mysql = require('mysql2');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

//creating a connection

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

con.connect((error) => {
  if (error) {
    console.log(error);
    return;
  } else {
    console.log('DB connected successfully');
  }

});

app.post('/post', (req, res) => {
  const { foodName, foodCost, foodType, softDrink, costOfDrink } = req.body;

  const sql =
    `INSERT INTO menu (foodName, foodCost, foodType, softDrink, costOfDrink) VALUES(?,?,?,?,?)`;

  con.query(sql, [foodName, foodCost, foodType, softDrink, costOfDrink], (error, result) => {

    if (error) {
      console.log(error);
      res.send('Inserting failed');
      return;
    }

    res.send('Inserted successfully');

  });



});

app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { foodName, foodCost, foodType, softDrink, costOfDrink } = req.body;

  const updateQuery = `
  update menu
  set foodName = ?, foodCost = ?,  foodType = ? ,  softDrink = ?,  costOfDrink = ?
  where id = ?
  `;

  con.query(updateQuery, [foodName, foodCost, foodType, softDrink, costOfDrink, id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: 'Failed to update ..'
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Menu item not found'
      });
    }
    res.status(200).json({
      message: 'Updated successfully'
    });
  })

});

app.delete('/delete/:id', (req, res)=>{
  const {id} = req.params;

  const deleteQuery = `
  delete from menu 
  where id = ?
  `;

  con.query(deleteQuery, [id], (err, result) =>{
    if(err){
      console.log(err);
      return res.status(500).json({
        message:'Failed to delete'
      });
    }
    return res.status(200).json({
      message: 'Deleted successfully'
    });
  });

});

app.get('/get', (req, res) => {

  const sql = `select * from menu`;

  con.query(sql, (error, result) => {
    if (error) {
      console.log(error);
      res.send('Fetching Failed');
      return;
    }
    res.json(result);
  });


});
app.get('/', (req,res)=>{
  console.log('Hello Nani');
});
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('Server Started');
});