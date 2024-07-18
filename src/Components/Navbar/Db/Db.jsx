import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navbar from '../../Navbar/Navbar'; 
import './Db.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenSquare, faTrash, faAngleLeft, faAngleRight, faAnglesRight, faAnglesLeft } from '@fortawesome/free-solid-svg-icons';

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
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    selectedProducts.length === currentProducts.length &&
                    currentProducts.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                  />
                </td>
                <td>
                  {editingProduct === product.id ? (
                    <input
                      type="text"
                      name="name"
                      value={editedProduct.name}
                      onChange={handleEditChange}
                    />
                  ) : (
                    product.name
                  )}
                </td>
                <td>
                  {editingProduct === product.id ? (
                    <input
                      type="text"
                      name="email"
                      value={editedProduct.email}
                      onChange={handleEditChange}
                    />
                  ) : (
                    product.email
                  )}
                </td>
                <td>
                  {editingProduct === product.id ? (
                    <input
                      type="text"
                      name="role"
                      value={editedProduct.role}
                      onChange={handleEditChange}
                    />
                  ) : (
                    product.role
                  )}
                </td>
                <td>
                  {editingProduct === product.id ? (
                    <button className="action-button" onClick={handleEditSubmit}>
                      Save
                    </button>
                  ) : (
                    <>
                      <button className="action-button" onClick={() => handleEdit(product)}>
                        <FontAwesomeIcon icon={faPenSquare} />
                      </button>
                      <button className="action-button" onClick={() => handleDelete(product)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="task1">
          <button onClick={handleDeleteSelected}>Delete Selected</button>
        </div>
        <div className="pagination">
          {currentPage > 1 && (
            <>
              <button onClick={() => handlePageChange(1)}>
                <FontAwesomeIcon icon={faAnglesLeft} />
              </button>
              <button onClick={() => handlePageChange(currentPage - 1)}>
                <FontAwesomeIcon icon={faAngleLeft} />
              </button>
            </>
          )}
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={number === currentPage ? 'active' : ''}
            >
              {number}
            </button>
          ))}
          {currentPage < totalPages && (
            <>
              <button onClick={() => handlePageChange(currentPage + 1)}>
                <FontAwesomeIcon icon={faAngleRight} />
              </button>
              <button onClick={() => handlePageChange(totalPages)}>
                <FontAwesomeIcon icon={faAnglesRight} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Db;
