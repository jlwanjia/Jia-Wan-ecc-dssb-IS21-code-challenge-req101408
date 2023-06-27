import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({});
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch products when component mounts
  useEffect(() => {
    axios.get('http://localhost:3000/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  // Handle input change for the new product form
  const handleNewProductChange = (e) => {
    setNewProduct({...newProduct, [e.target.name]: e.target.value});
  }

  // Handle form submission for adding a new product
  const handleNewProductSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/products', newProduct)
      .then(res => setProducts([...products, res.data]))
      .catch(err => console.error(err));
  }

  // Handle input change for the edit product form
  const handleEditProductChange = (e) => {
    setEditingProduct({...editingProduct, [e.target.name]: e.target.value});
  }

  // Handle form submission for editing a product
  const handleEditProductSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3000/products/${editingProduct.id}`, editingProduct)
      .then(res => {
        // Replace the product in the products array
        const updatedProducts = products.map(product => product.id === res.data.id ? res.data : product);
        setProducts(updatedProducts);
        setEditingProduct(null);
      })
      .catch(err => console.error(err));
  }

  // Handle clicking the Edit button for a product
  const handleEditButtonClick = (product) => {
    setEditingProduct(product);
  }

  return (
    <div className="App">
      <form onSubmit={handleNewProductSubmit}>
        <input type="text" name="name" onChange={handleNewProductChange} placeholder="Product name"/>
        <input type="text" name="description" onChange={handleNewProductChange} placeholder="Product description"/>
        <button type="submit">Add Product</button>
      </form>
      {editingProduct && (
        <form onSubmit={handleEditProductSubmit}>
          <input type="text" name="name" value={editingProduct.name} onChange={handleEditProductChange}/>
          <input type="text" name="description" value={editingProduct.description} onChange={handleEditProductChange}/>
          <button type="submit">Update Product</button>
        </form>
      )}
      {products.map((product, index) => (
        <div key={index}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <button onClick={() => handleEditButtonClick(product)}>Edit</button>
        </div>
      ))}
    </div>
  );
}

export default App;