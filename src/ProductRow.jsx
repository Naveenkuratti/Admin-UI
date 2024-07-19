import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import './ProductRow.css';// Ensure this file exists for ProductRow styles

const ProductRow = ({
  product,
  editingProduct,
  editedProduct,
  handleEditChange,
  handleEditSubmit,
  handleEdit,
  handleDelete,
  selectedProducts,
  handleSelectProduct,
}) => {
  const isEditing = editingProduct === product.id;
  return (
    <tr>
      <td>
        <input
          type="checkbox"
          className="checkbox"
          checked={selectedProducts.includes(product.id)}
          onChange={() => handleSelectProduct(product.id)}
        />
      </td>
      <td>
        {isEditing ? (
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
        {isEditing ? (
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
        {isEditing ? (
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
        {isEditing ? (
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
  );
};

export default ProductRow;
