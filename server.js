// server.js
const express = require('express');
const faker = require('faker');
const cors = require('cors');

const app = express();

// Middleware for enabling CORS and parsing JSON request bodies
app.use(cors());
app.use(express.json());

// Initial data creation using faker
let data = Array.from({ length: 40 }, (_, id) => ({
  productId: id + 1,
  productNumber: `ECC-${id + 1}`,
  productName: faker.commerce.productName(),
  productOwner: faker.name.findName(),
  developers: Array.from({ length: 5 }, () => faker.name.findName()),
  scrumMaster: faker.name.findName(),
  startDate: faker.date.past().toISOString().split('T')[0],
  methodology: faker.random.arrayElement(['Agile', 'Waterfall']),
  location: `https://github.com/bcgov/${faker.lorem.word()}`,
}));

// GET endpoint to fetch all products
app.get('/api/product', (req, res) => {
  res.json(data);
});

// GET endpoint to fetch a specific product by productId
app.get('/api/product/:productId', (req, res) => {
  const productId = Number(req.params.productId);
  const product = data.find((item) => item.productId === productId);
  if (!product) {
    return res.status(404).send('Product not found');
  }
  res.json(product);
});

let productIdCounter = data.length;

// POST endpoint to create a new product
app.post('/api/product', (req, res) => {
    const product = req.body;
    productIdCounter += 1;
    product.productId = productIdCounter;
    product.productNumber = `ECC-${product.productId}`; 
    product.developers = product.developers.filter(Boolean); // Filter out empty developers
    data.push(product);
    res.json(product);
});
  
// PUT endpoint to update a specific product by productId
app.put('/api/product/:productId', (req, res) => {
    const productId = Number(req.params.productId);
    const updatedProductData = req.body;
    updatedProductData.developers = updatedProductData.developers.filter(Boolean); // Filter out empty developers
    const productIndex = data.findIndex((item) => item.productId === productId);
    if (productIndex === -1) {
      return res.status(404).send('Product not found');
    }
    data[productIndex] = {
      ...data[productIndex],
      ...updatedProductData,
    };
    res.json(data[productIndex]);
});

// DELETE endpoint to delete a specific product by productId
app.delete('/api/product/:productId', (req, res) => {
  const productId = Number(req.params.productId);
  const productIndex = data.findIndex((item) => item.productId === productId);
  if (productIndex === -1) {
    return res.status(404).send('Product not found');
  }
  const product = data.splice(productIndex, 1);
  res.json(product);
});

// Start the server
app.listen(3000, () => console.log('Server listening on port 3000!'));