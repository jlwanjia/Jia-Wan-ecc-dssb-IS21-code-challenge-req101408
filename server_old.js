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
  Developers: Array.from({ length: 5 }, () => faker.name.findName()),
  scrumMasterName: faker.name.findName(),
  startDate: faker.date.past().toISOString().split('T')[0],
  methodology: faker.random.arrayElement(['Scrum', 'Kanban', 'XP', 'Waterfall']),
  location: faker.address.city(),
}));

app.get('/products', (req, res) => {
  res.json(data);
});

app.post('/products', (req, res) => {
  if (!req.body.productName || !req.body.productOwnerName) {
    return res.status(400).send('Missing product name or owner name');
  }
  const product = req.body;
  data.push(product);
  res.json(product);
});

app.put('/products/:productId', (req, res) => {
  const productId = req.params.productId;
  const updatedProductData = req.body;
  const product = data.find((product) => product.productId === Number(productId));
  if (!product) {
    return res.status(404).send('Product not found');
  }
  if (!updatedProductData.productName || !updatedProductData.productOwnerName) {
    return res.status(400).send('Missing product name or owner name');
  }
  Object.assign(product, updatedProductData);
  res.json(product);
});

app.listen(3000, () => console.log('Server listening on port 3000!'));