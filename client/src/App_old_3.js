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
  const [productOwner, setProductOwner] = useState('');
  const [scrumMaster, setScrumMaster] = useState('');
  const [startDate, setStartDate] = useState('');
  const [methodology, setMethodology] = useState('');
  const [location, setLocation] = useState('');
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
    const productData = {
      productName,
      productOwner,
      scrumMaster,
      startDate,
      methodology,
      location,
    };
    if (editingProduct) {
      axios.put(`http://localhost:3000/api/product/${editingProduct.productId}`, productData)
        .then(res => {
          const updatedProducts = products.map(product => 
            product.productId === editingProduct.productId ? res.data : product
          );
          setProducts(updatedProducts);
          setEditingProduct(null);
        })
        .catch(err => setError(err.message));
    } else {
      axios.post('http://localhost:3000/api/product', productData)
        .then(res => setProducts([...products, res.data]))
        .catch(err => setError(err.message));
    }
    setProductName('');
    setProductOwner('');
    setScrumMaster('');
    setStartDate('');
    setMethodology('');
    setLocation('');
  };

  const handleEditButtonClick = product => {
    setProductName(product.productName);
    setProductOwner(product.productOwner);
    setScrumMaster(product.scrumMaster);
    setStartDate(product.startDate);
    setMethodology(product.methodology);
    setLocation(product.location);
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
          value={productOwner}
          onChange={e => setProductOwner(e.target.value)}
          placeholder="Product owner"
        />
        <Input
          value={scrumMaster}
          onChange={e => setScrumMaster(e.target.value)}
          placeholder="Scrum master"
        />
        <Input
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          placeholder="Start date"
        />
        <Input
          value={methodology}
          onChange={e => setMethodology(e.target.value)}
          placeholder="Methodology"
        />
        <Input
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="Location"
        />
        <Button type="submit">{editingProduct ? 'Update' : 'Add'} product</Button>
      </Form>
      {error && <p>Error: {error}</p>}
      {products.map((product, index) => (
        <div key={index}>
          <h2>{product.productName}</h2>
          <p>Owner: {product.productOwner}</p>
          <p>Scrum Master: {product.scrumMaster}</p>
          <p>Start Date: {product.startDate}</p>
          <p>Methodology: {product.methodology}</p>
          <p>Location: {product.location}</p>
          <button onClick={() => handleEditButtonClick(product)}>Edit</button>
          <button onClick={() => handleDeleteButtonClick(product.productId)}>Delete</button>
        </div>
      ))}
    </Container>
  );
}

export default App;