import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import './Inventory.css';

const Inventory = () => {
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem('inventoryItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });

  const [newItem, setNewItem] = useState({ name: '', category: '', quantity: '' });
  const [filterCategory, setFilterCategory] = useState('All');
  const [editMode, setEditMode] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('inventoryItems', JSON.stringify(items));
  }, [items]);

  const handleAddItem = () => {
    const { name, category, quantity } = newItem;

    // Check for empty fields
    if (!name || !category || !quantity) {
      setError('All fields are required.');
      return;
    }

    // Ensure quantity is a valid number
    if (isNaN(quantity) || quantity <= 0) {
      setError('Quantity must be a positive number.');
      return;
    }

    setError(''); // Clear error if validations pass

    if (editMode) {
      const updatedItems = items.map((item) =>
        item.id === currentEditItem.id ? { ...item, ...newItem, quantity: parseInt(quantity, 10) } : item
      );
      setItems(updatedItems);
      setEditMode(false);
    } else {
      const newItemWithId = { ...newItem, id: Date.now(), quantity: parseInt(quantity, 10) };
      setItems([...items, newItemWithId]);
    }
    setNewItem({ name: '', category: '', quantity: '' });
  };

  const handleEdit = (item) => {
    setCurrentEditItem(item);
    setNewItem({ name: item.name, category: item.category, quantity: item.quantity });
    setEditMode(true);
    setError('');
  };

  const handleDelete = (id) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
  };

  const handleFilterChange = (e) => {
    setFilterCategory(e.target.value);
  };

  const handleSort = () => {
    const sortedItems = [...items].sort((a, b) => a.quantity - b.quantity);
    setItems(sortedItems);
  };

  const isLowStock = (quantity) => quantity < 10;

  const filteredItems = filterCategory === 'All' ? items : items.filter(item => item.category === filterCategory);

  const categories = [...new Set(items.map(item => item.category))];

  return (
    <div className="app-container">
      <h1>Inventory Management</h1>

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      {/* Add/Edit Item Form */}
      <div className="form-container">
        <input
          type="text"
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          value={newItem.category}
          onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
        />
        <button onClick={handleAddItem}>{editMode ? 'Update Item' : 'Add Item'}</button>
      </div>

      {/* Filter and Sort */}
      <div className="controls">
        <select onChange={handleFilterChange} value={filterCategory}>
          <option value="All">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <button onClick={handleSort}>Sort by Quantity</button>
      </div>

      {/* Inventory Table */}
      {filteredItems.length === 0 ? (
        <p>No items available in the inventory.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id} className={isLowStock(item.quantity) ? 'low-stock' : ''}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>
                  <button onClick={() => handleEdit(item)}>
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(item.id)}>
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Inventory;
