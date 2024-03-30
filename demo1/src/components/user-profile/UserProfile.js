import React, { useState, useContext } from 'react';
import { loginContext } from "../../contexts/LoginContextProvider";
import axios from  "axios"

function UserProfile() {
  const { currentUserDetails } = useContext(loginContext);
  const [showInventory, setShowInventory] = useState(false);
  const [showAddStockForm, setShowAddStockForm] = useState(false);
  const [showBillingForm, setShowBillingForm] = useState(false);
  const [billItems, setBillItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');

  function getInventory() {
    setShowInventory(true);
    setShowAddStockForm(false); // Hide add stock form when showing inventory
    setShowBillingForm(false); // Hide billing form when showing inventory
  }

  function toggleAddStockForm() {
    setShowAddStockForm(!showAddStockForm);
    setShowInventory(false); // Hide inventory when showing add stock form
    setShowBillingForm(false); // Hide billing form when showing add stock form
  }

  function toggleBillingForm() {
    setShowBillingForm(!showBillingForm);
    setShowInventory(false); // Hide inventory when showing billing form
    setShowAddStockForm(false); // Hide add stock form when showing billing form
  }

  async function handleAddStock(event) {
    event.preventDefault();

    const existingItemIndex = currentUserDetails.currentUser.inventory.findIndex(item => Object.keys(item)[0] === itemName);

    if (existingItemIndex !== -1) {
        // If item already exists, update its quantity
        const updatedInventory = [...currentUserDetails.currentUser.inventory];
        updatedInventory[existingItemIndex][itemName] += parseInt(quantity);
        currentUserDetails.currentUser.inventory=updatedInventory;
        const updatedInventoryData = {
          username: currentUserDetails.currentUser.username,
          inventory: updatedInventory
      };
      await axios.put('http://localhost:4000/usersapi/update-inventory', updatedInventoryData)
        // Example of updating context - replace with your actual update function
        // updateInventory(updatedInventory);
    } else {
        // If item doesn't exist, add it to the inventory
        const updatedInventory = [...currentUserDetails.currentUser.inventory, { [itemName]: parseInt(quantity) }];
        currentUserDetails.currentUser.inventory=updatedInventory;

        // Create an object containing the updated inventory data
        const updatedInventoryData = {
            username: currentUserDetails.currentUser.username,
            inventory: updatedInventory
        };

        try {
            // Send a PUT request to update the inventory
            await axios.put('http://localhost:4000/usersapi/update-inventory', updatedInventoryData);
            // Example of updating context - replace with your actual update function
            // updateInventory(updatedInventory);
        } catch (error) {
            console.error('Error updating inventory:', error);
        }
    }

    // Clear form fields
    setItemName('');
    setQuantity('');
}

async function handleBilling(event) {
  event.preventDefault();

  
  // Update inventory based on billing
  try {
      billItems.forEach(item => {
          const itemName = item.itemName;
          const quantity = item.quantity;

          // Find the item in the inventory
          const existingItemIndex = currentUserDetails.currentUser.inventory.findIndex(item => Object.keys(item)[0] === itemName);
          if (existingItemIndex !== -1) {
              const updatedInventory = [...currentUserDetails.currentUser.inventory];
              updatedInventory[existingItemIndex][itemName] -= quantity;
              // Example of updating context - replace with your actual update function
              // updateInventory(updatedInventory);
              
          }
      });
      
      // After updating the inventory, send a PUT request to update it in the database
      const updatedInventoryData = {
          username: currentUserDetails.currentUser.username,
          inventory: currentUserDetails.currentUser.inventory
      };
      await axios.put('http://localhost:4000/usersapi/update-inventory', updatedInventoryData);
  } catch (error) {
      console.error('Error updating inventory:', error);
  }

  // Clear billing items after processing
  setBillItems([]);
}


  function addToBill() {
    // Check if itemName and quantity are not empty
    if (itemName.trim() !== '' && quantity.trim() !== '') {
      // Add item to billItems array
      setBillItems([...billItems, { itemName, quantity: parseInt(quantity) }]);
      // Clear form fields
      
      setItemName('');
      setQuantity('');
    }
  }

  return (
    <div style={{ display: 'flex'}}>
      <div style={{ marginRight: '50px', display: 'flex', flexDirection: 'column' }}>
        <button className="btn btn-primary mr-2 mb-4" onClick={getInventory}>Inventory</button>
        <button className="btn btn-success mr-2 mb-4" onClick={toggleAddStockForm}>Add Stock</button>
        <button className="btn btn-info mr-2" onClick={toggleBillingForm}>Billing</button>
      </div>
      <div>
        {showAddStockForm && (
          <div className="mt-3"  style={{ width: '900px'}}>
            <h2>Add Stock:</h2>
            <form onSubmit={handleAddStock}>
              <div className="form-group">
                <label htmlFor="itemName">Item Name:</label>
                <input
                  type="text"
                  className="form-control"
                  id="itemName"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  type="number"
                  className="form-control"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Add</button>
            </form>
          </div>
        )}
        {showBillingForm && (
          <div className="mt-3">
            <h2>Billing:</h2>
            <form>
              <div className="form-group" style={{ width: '900px'}}>
                <label htmlFor="itemName">Item Name:</label>
                <input
                  type="text"
                  className="form-control"
                  id="itemName"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  type="number"
                  className="form-control"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              <button type="button" className="btn btn-primary" onClick={addToBill}>Add to Bill</button>
            </form>
            <div className="mt-3">
              <h3>Items in Bill:</h3>
              <ul>
                {billItems.map((item, index) => (
                  <li key={index}>{item.itemName} - {item.quantity}</li>
                ))}
              </ul>
              <button type="button" className="btn btn-primary" onClick={handleBilling}>Process Billing</button>
            </div>
          </div>
        )}
        {showInventory && (
  <div className="mt-3">
    <h2>Inventory Details:</h2>
    <table style={{ width: '300%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Item</th>
          <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Quantity</th>
        </tr>
      </thead>
      <tbody>
        {currentUserDetails.currentUser.inventory.map((item, index) => (
          <tr key={index}>
            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>{Object.keys(item)[0]}</td>
            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>{Object.values(item)[0]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

      </div>
    </div>
  );
}

export default UserProfile;
