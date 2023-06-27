const express = require('express');
const faker = require('faker');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

let data = Array.from({ length: 40 }, (_, id) => ({
  productId: id + 1,
  productName: faker.commerce.productName(),
  productOwnerName: faker.name.findName(),
  developers: Array.from({ length: 5 }, () => faker.name.findName()),
  scrumMasterName: faker.name.findName(),
  startDate: faker.date.past().toISOString().split('T')[0],
  methodology: faker.random.arrayElement(['Scrum', 'Kanban', 'XP', 'Waterfall']),
  location: faker.address.city(),
}));

app.get('/api/product', (req, res) => {
  res.json(data);
});

app.get('/api/product/:productId', (req, res) => {
  const productId = Number(req.params.productId);
  const product = data.find((item) => item.productId === productId);
  if (!product) {
    return res.status(404).send('Product not found');
  }
  res.json(product);
});

app.post('/api/product', (req, res) => {
  const product = req.body;
  product.productId = data.length + 1;
  data.push(product);
  res.json(product);
});

app.put('/api/product/:productId', (req, res) => {
  const productId = Number(req.params.productId);
  const updatedProductData = req.body;
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

app.delete('/api/product/:productId', (req, res) => {
  const productId = Number(req.params.productId);
  const productIndex = data.findIndex((item) => item.productId === productId);
  if (productIndex === -1) {
    return res.status(404).send('Product not found');
  }
  const product = data.splice(productIndex, 1);
  res.json(product);
});

app.listen(3000, () => console.log('Server listening on port 3000!'));