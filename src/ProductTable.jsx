import React from 'react';
import ProductRow from './ProductRow';

const ProductTable = ({
  products,
  currentPage,
  itemsPerPage,
  editingProduct,
  editedProduct,
  handleEditChange,
  handleEditSubmit,
  handleEdit,
  handleDelete,
  selectedProducts,
  handleSelectProduct,
  handleSelectAll,
}) => {
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
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
            <ProductRow
              key={product.id}
              product={product}
              editingProduct={editingProduct}
              editedProduct={editedProduct}
              handleEditChange={handleEditChange}
              handleEditSubmit={handleEditSubmit}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              selectedProducts={selectedProducts}
              handleSelectProduct={handleSelectProduct}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
