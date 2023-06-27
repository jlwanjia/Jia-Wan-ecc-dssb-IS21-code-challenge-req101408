import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2em;
`;

const Form = styled.form`
  margin: 1em 0;
`;

const Input = styled.input`
  margin-right: 1em;
`;

const Button = styled.button`
  background-color: #008CBA;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
`;

function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    productId: '',
    productName: '',
    productOwnerName: '',
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/products')
      .then(res => setProducts(res.data))
      .catch(err => setError(err.message));
  }, []);

  const handleNewProductChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  }

  const handleNewProductSubmit = (e) => {
    e.preventDefault();

      // Check if product name and owner name fields are filled out
    if (!newProduct.productName || !newProduct.productOwnerName) {
      setError('Product name and owner name are required');
      return;
    }

    axios.post('http://localhost:3000/products', newProduct)
      .then(res => {
        setProducts([...products, res.data]);
        setNewProduct({
          productId: '',
          productName: '',
          productOwnerName: '',
        });
      })
      .catch(err => setError(err.message));
  }

  const handleEditProductChange = (e) => {
    setEditingProduct({ ...editingProduct, [e.target.name]: e.target.value });
  }

  const handleEditProductSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3000/products/${editingProduct.productId}`, editingProduct)
      .then(res => {
        const updatedProducts = products.map(product => product.productId === res.data.productId ? res.data : product);
        setProducts(updatedProducts);
        setEditingProduct(null);
      })
      .catch(err => setError(err.message));
  }

  const handleEditButtonClick = (product) => {
    setEditingProduct(product);
  }

  return (
    <Container>
      {error && <div>Error: {error}</div>}
      <Form onSubmit={handleNewProductSubmit}>
        <Input type="text" name="productName" onChange={handleNewProductChange} placeholder="Product name" />
        <Input type="text" name="productOwnerName" onChange={handleNewProductChange} placeholder="Product owner name" />
        <Button type="submit">Add Product</Button>
      </Form>
      {editingProduct && (
        <Form onSubmit={handleEditProductSubmit}>
          <Input type="text" name="productName" value={editingProduct.productName} onChange={handleEditProductChange} />
          <Input type="text" name="productOwnerName" value={editingProduct.productOwnerName} onChange={handleEditProductChange} />
          <Button type="submit">Update Product</Button>
        </Form>
      )}
      {products.map((product, index) => (
        <div key={index}>
          <h2>{product.productName}</h2>
          <p>{product.productOwnerName}</p>
          <Button onClick={() => handleEditButtonClick(product)}>Edit</Button>
        </div>
      ))}
    </Container>
  );
}

export default App;