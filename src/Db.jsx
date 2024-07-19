
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import ProductTable from './ProductTable';
import Pagination from './Pagination';
import './Db.css';

const Db = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
      setProducts(data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setEditedProduct(product);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleEditSubmit = () => {
    if (editedProduct.name && editedProduct.email && editedProduct.role) {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === editedProduct.id ? editedProduct : product
        )
      );
      setEditingProduct(null);
    } else {
      alert('All fields are required');
    }
  };

  const handleDelete = (product) => {
    setProducts((prevProducts) => prevProducts.filter((p) => p.id !== product.id));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === currentProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(currentProducts.map((product) => product.id));
    }
  };

  const handleDeleteSelected = () => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => !selectedProducts.includes(product.id))
    );
    setSelectedProducts([]);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <ProductTable
        products={filteredProducts}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        editingProduct={editingProduct}
        editedProduct={editedProduct}
        handleEditChange={handleEditChange}
        handleEditSubmit={handleEditSubmit}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        selectedProducts={selectedProducts}
        handleSelectProduct={handleSelectProduct}
        handleSelectAll={handleSelectAll}
      />
      <div className="task1">
        <button onClick={handleDeleteSelected}>Delete Selected</button>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default Db;