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
  transition-duration: 0.4s;
  cursor: pointer;
`;

function App() {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [productOwnerName, setProductOwnerName] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get('http://localhost:3000/api/product')
      .then(res => {
        setProducts(res.data);
        console.log(res.data);  // log the data here
      })
      .catch(err => setError(err.message));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (editingProduct) {
      axios.put(`http://localhost:3000/api/product/${editingProduct.productId}`, { productName, productOwnerName })
        .then(res => {
          const updatedProducts = products.map(product => 
            product.productId === editingProduct.productId ? res.data : product
          );
          setProducts(updatedProducts);
          setEditingProduct(null);
        })
        .catch(err => setError(err.message));
    } else {
      axios.post('http://localhost:3000/api/product', { productName, productOwnerName })
        .then(res => setProducts([...products, res.data]))
        .catch(err => setError(err.message));
    }
    setProductName('');
    setProductOwnerName('');
  };

  const handleEditButtonClick = product => {
    setProductName(product.productName);
    setProductOwnerName(product.productOwnerName);
    setEditingProduct(product);
  };

  const handleDeleteButtonClick = (productId) => {
    axios.delete(`http://localhost:3000/api/product/${productId}`)
      .then(res => {
        const updatedProducts = products.filter(product => product.productId !== productId);
        setProducts(updatedProducts);
      })
      .catch(err => setError(err.message));
  };

  return (
    <Container>
      <h1>Product Tracker</h1>
      <Form onSubmit={handleSubmit}>
        <Input
          value={productName}
          onChange={e => setProductName(e.target.value)}
          placeholder="Product name"
        />
        <Input
          value={productOwnerName}
          onChange={e => setProductOwnerName(e.target.value)}
          placeholder="Product owner name"
        />
        <Button type="submit">{editingProduct ? 'Update' : 'Add'} product</Button>
      </Form>
      {error && <p>Error: {error}</p>}
      {products.map((product, index) => (
        <div key={index}>
          <h2>{product.productName}</h2>
          <p>Owner: {product.productOwnerName}</p>
          <Button onClick={() => handleEditButtonClick(product)}>Edit</Button>
          <Button onClick={() => handleDeleteButtonClick(product.productId)}>Delete</Button>
        </div>
      ))}
    </Container>
  );
}

export default App;