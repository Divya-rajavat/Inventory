import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import './Inventory.css';

const Inventory = () => {
  // Initialize with empty array or data from localStorage
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem('inventoryItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });
  
  const [newItem, setNewItem] = useState({ name: '', category: '', quantity: '' });
  const [filterCategory, setFilterCategory] = useState('All');
  const [editMode, setEditMode] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);

  // Save items to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('inventoryItems', JSON.stringify(items));
  }, [items]);

  // Add or Update item
  const handleAddItem = () => {
    if (editMode) {
      const updatedItems = items.map((item) =>
        item.id === currentEditItem.id ? { ...item, ...newItem } : item
      );
      setItems(updatedItems);
      setEditMode(false);
    } else {
      const newItemWithId = { ...newItem, id: Date.now() };
      setItems([...items, newItemWithId]);
    }
    setNewItem({ name: '', category: '', quantity: '' });
  };

  // Handle Edit
  const handleEdit = (item) => {
    setCurrentEditItem(item);
    setNewItem({ name: item.name, category: item.category, quantity: item.quantity });
    setEditMode(true);
  };

  // Handle Delete
  const handleDelete = (id) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
  };

  // Filter by category
  const handleFilterChange = (e) => {
    setFilterCategory(e.target.value);
  };

  // Sort by quantity
  const handleSort = () => {
    const sortedItems = [...items].sort((a, b) => a.quantity - b.quantity);
    setItems(sortedItems);
  };

  // Highlight low-stock items
  const isLowStock = (quantity) => quantity < 10;

  // Filter items by category
  const filteredItems = filterCategory === 'All' ? items : items.filter(item => item.category === filterCategory);

  // Extract unique categories from the current items
  const categories = [...new Set(items.map(item => item.category))];

  return (
    <div className="app-container">
      <h1>Inventory Management</h1>

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
        <p>No items available in the inventory.</p>  // Message when no items exist
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