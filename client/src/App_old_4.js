// App.js
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
  const [developer1, setDeveloper1] = useState('');
  const [developer2, setDeveloper2] = useState('');
  const [developer3, setDeveloper3] = useState('');
  const [developer4, setDeveloper4] = useState('');
  const [developer5, setDeveloper5] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get('http://localhost:3000/api/product')
      .then(res => {
        setProducts(res.data);
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
      developers: [developer1, developer2, developer3, developer4, developer5]
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
    setDeveloper1('');
    setDeveloper2('');
    setDeveloper3('');
    setDeveloper4('');
    setDeveloper5('');
  };

  const handleEditButtonClick = product => {
    setProductName(product.productName);
    setProductOwner(product.productOwner);
    setScrumMaster(product.scrumMaster);
    setStartDate(product.startDate);
    setMethodology(product.methodology);
    setLocation(product.location);
    setDeveloper1(product.developers[0] || '');
    setDeveloper2(product.developers[1] || '');
    setDeveloper3(product.developers[2] || '');
    setDeveloper4(product.developers[3] || '');
    setDeveloper5(product.developers[4] || '');
    setEditingProduct(product);
  };

  const handleDeleteButtonClick = productId => {
    axios.delete(`http://localhost:3000/api/product/${productId}`)
      .then(() => setProducts(products.filter(product => product.productId !== productId)))
      .catch(err => setError(err.message));
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Input type="text" value={productName} onChange={e => setProductName(e.target.value)} placeholder="Product Name" required />
        <Input type="text" value={productOwner} onChange={e => setProductOwner(e.target.value)} placeholder="Product Owner" required />
        <Input type="text" value={scrumMaster} onChange={e => setScrumMaster(e.target.value)} placeholder="Scrum Master" required />
        <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
        <Input type="text" value={methodology} onChange={e => setMethodology(e.target.value)} placeholder="Methodology" required />
        <Input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" required />
        <Input type="text" value={developer1} onChange={e => setDeveloper1(e.target.value)} placeholder="Developer 1" required />
        <Input type="text" value={developer2} onChange={e => setDeveloper2(e.target.value)} placeholder="Developer 2" required />
        <Input type="text" value={developer3} onChange={e => setDeveloper3(e.target.value)} placeholder="Developer 3" required />
        <Input type="text" value={developer4} onChange={e => setDeveloper4(e.target.value)} placeholder="Developer 4" required />
        <Input type="text" value={developer5} onChange={e => setDeveloper5(e.target.value)} placeholder="Developer 5" required />
        <Button type="submit">{editingProduct ? 'Update' : 'Add'} Product</Button>
      </Form>
      {products.map(product => (
        <div key={product.productId}>
          <h3>{product.productNumber}: {product.productName}</h3>
          <p>Product Owner: {product.productOwner}</p>
          <p>Scrum Master: {product.scrumMaster}</p>
          <p>Start Date: {product.startDate}</p>
          <p>Methodology: {product.methodology}</p>
          <p>Location: {product.location}</p>
          <p>Developers: {product.developers.join(', ')}</p>
          <button onClick={() => handleEditButtonClick(product)}>Edit</button>
          <button onClick={() => handleDeleteButtonClick(product.productId)}>Delete</button>
        </div>
      ))}
      {error && <div>{error}</div>}
    </Container>
  );
}

export default App;