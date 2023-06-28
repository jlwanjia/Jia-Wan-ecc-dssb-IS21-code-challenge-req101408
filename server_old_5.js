// server.js
const express = require('express');
const faker = require('faker');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger.json');

const app = express();

// Middleware for enabling CORS and parsing JSON request bodies
app.use(cors());
app.use(express.json());

// Swagger set up
const options = {
  swaggerDefinition: swaggerFile,
  apis: ['./server.js'],
};

const specs = swaggerJsDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

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

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         productId:
 *           type: integer
 *         productNumber:
 *           type: string
 *         productName:
 *           type: string
 *         productOwner:
 *           type: string
 *         developers:
 *           type: array
 *           items:
 *             type: string
 *         scrumMaster:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         methodology:
 *           type: string
 *         location:
 *           type: string
 *       required:
 *         - productId
 *         - productNumber
 *         - productName
 *         - productOwner
 *         - developers
 *         - scrumMaster
 *         - startDate
 *         - methodology
 *         - location
 */

// GET endpoint to fetch all products
/**
 * @swagger
 * /product:
 *   get:
 *     tags:
 *       - Products
 *     description: Returns all products
 *     responses:
 *       200:
 *         description: An array of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get('/api/product', (req, res) => {
  res.json(data);
});

// GET endpoint to fetch a specific product by productId
/**
 * @swagger
 * /product/{productId}:
 *   get:
 *     tags:
 *       - Products
 *     description: Returns a single product
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the product to get
 *     responses:
 *       200:
 *         description: A single product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
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
/**
 * @swagger
 * /product:
 *   post:
 *     tags:
 *       - Products
 *     description: Creates a new product
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Successfully created
 */
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
/**
 * @swagger
 * /product/{productId}:
 *   put:
 *     tags:
 *       - Products
 *     description: Updates a single product
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the product to get
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Successfully updated
 */
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
/**
 * @swagger
 * /product/{productId}:
 *   delete:
 *     tags:
 *       - Products
 *     description: Deletes a single product
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the product to delete
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
app.delete('/api/product/:productId', (req, res) => {
  const productId = Number(req.params.productId);
  const productIndex = data.findIndex((item) => item.productId === productId);
  if (productIndex === -1) {
    return res.status(404).send('Product not found');
  }
  const product = data.splice(productIndex, 1);
  res.json(product);
});

// Serve the Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Start the server
app.listen(3000, () => console.log('Server listening on port 3000!'));