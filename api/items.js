const pool = require('../database/postgresql_connection').pool
const axios = require('axios')
var fs = require('fs')

let getAllItems = async (req, res) => {
  let items = await pool.query('SELECT * from item ORDER BY date_created')
  try {
    for (let i = 0; i < items.rows.length; i++) {
      let item = items.rows[i]
      //  getting weather info using open weather api
      let response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${item.location}&appid=6a40c1675c9008d836d8349284e40aa3`,
      )
      items.rows[i].weather = response.data.weather
    }
  } catch (error) {
    console.log(error)
  }
  res.status(200).send(items.rows)
}

let addItems = async (req, res) => {
  const { name, price, location, quantity } = req.body
  let filename

  // image not provided
  if (!req.file) {
    filename = ''
  } else {
    // image provided
    filename = req.file.filename
  }
  const item = await pool.query(
    'INSERT INTO item(name,price,location,quantity,image) VALUES($1, $2, $3, $4,$5) RETURNING *',
    [name, price, location, quantity, filename],
  )
  res.status(200).send(item.rows[0])
}

let updateItems = async (req, res) => {
  let id = req.params.id
  const { name, price, location, quantity } = req.body

  let itemImage = await pool.query('SELECT image from item WHERE id = $1', [id])

  // image is unchanged
  if (!req.file) {
    let item = await pool.query(
      'UPDATE item SET name = $1, price = $2, location = $3, quantity = $4 WHERE id = $5 RETURNING *',
      [name, price, location, quantity, id],
    )

    res.status(200).send(item.rows[0])

    // new image provided
  } else {
    const { filename } = req.file
    // delete image old
    deleteFile(itemImage.rows[0].image)

    let item = await pool.query(
      'UPDATE item SET name = $1, price = $2, location = $3, quantity = $4, image = $5 WHERE id = $6 RETURNING *',
      [name, price, location, quantity, filename, id],
    )
    res.status(200).send(item.rows[0])
  }
}

let deleteItem = async (req, res) => {
  let id = req.params.id
  let deletedItem = await pool.query(
    'DELETE FROM item WHERE id = $1 RETURNING *',
    [id],
  )
  // delete image
  deleteFile(deletedItem.rows[0].image)
  res.status(200).send('item deleted successfully')
}

let deleteFile = (fileName) => {
  try {
    fs.unlinkSync('./uploaded-images/' + fileName)
  } catch (error) {
    console.log(error)
  }
}
module.exports = {
  getAllItems,
  addItems,
  updateItems,
  deleteItem,
}
