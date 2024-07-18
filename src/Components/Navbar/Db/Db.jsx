import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navbar from '../../Navbar/Navbar'; // Adjusted the import path
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

  const getApi = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json");
      setProducts(data);
      setLoading(false);
    } catch (e) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  useEffect(() => {
    getApi();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setEditedProduct(product);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: value,
    });
  };

  const handleEditSubmit = () => {
    if (editedProduct.name && editedProduct.email && editedProduct.role) {
      setProducts(products.map(product => (product.id === editedProduct.id ? editedProduct : product)));
      setEditingProduct(null);
    } else {
      alert('All fields are required');
    }
  };

  const handleDelete = (product) => {
    const newProducts = products.filter(p => p.id !== product.id);
    setProducts(newProducts);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === currentProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(currentProducts.map(product => product.id));
    }
  };

  const handleDeleteSelected = () => {
    const newProducts = products.filter(product => !selectedProducts.includes(product.id));
    setProducts(newProducts);
    setSelectedProducts([]);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredProducts.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

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
                  checked={selectedProducts.length === currentProducts.length && currentProducts.length > 0} 
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
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={number === currentPage ? 'active' : ''}
            >
              {number}
            </button>
          ))}
          {currentPage < pageNumbers.length && (
            <>
              <button onClick={() => handlePageChange(currentPage + 1)}>
                <FontAwesomeIcon icon={faAngleRight} />
              </button>
              <button onClick={() => handlePageChange(pageNumbers.length)}>
                <FontAwesomeIcon icon={faAnglesRight} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Db;
