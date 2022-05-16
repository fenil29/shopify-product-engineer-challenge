require('dotenv').config({ path: './environmental-variable.env' })
const port = process.env.PORT

const express = require('express')
const multer = require('multer')
const cors = require('cors')

const items = require('./api/items')
const app = express()

// middleware
app.use(cors())

// for parsing application/json
app.use(express.json())

// serving frontend code
app.use(
  '/',
  express.static('./frontend/build'),
)
app.get('/api', (req, res) => {
  res.send('shopify-product-engineer-challenge-api😃')
})

// route for image
app.use('/get-image', express.static('uploaded-images'))

// configuration for storing images
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploaded-images')
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split('/')
    let extension = extArray[extArray.length - 1]
    cb(null, Date.now() + '.' + extension)
  },
})
const upload = multer({ storage: storage })

// routes for items
app.get('/items', items.getAllItems)
app.post('/items', upload.single('image'), items.addItems)
app.put('/items/:id', upload.single('image'), items.updateItems)
app.delete('/items/:id', items.deleteItem)

app.listen(port, "0.0.0.0", () => {
  console.log(`App listening at http://localhost:${port}`);
});
