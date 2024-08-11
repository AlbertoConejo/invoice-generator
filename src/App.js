import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import './App.css';

function App() {
  const [invoiceData, setInvoiceData] = useState({
    companyName: 'Company Name',
    companyAddress: 'Address Line 1',
    companyEmail: 'company@example.com',
    companyPhone: '+1 234 567 890',
    clientName: 'Client Name',
    clientAddress: 'Client Address Line 1',
    items: [
      { description: 'Product 1', quantity: 2, price: 10 }
    ]
  });

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (index !== undefined) {
      const updatedItems = [...invoiceData.items];
      updatedItems[index][name] = value;
      setInvoiceData({ ...invoiceData, items: updatedItems });
    } else {
      setInvoiceData({ ...invoiceData, [name]: value });
    }
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: '', quantity: 1, price: 0 }]
    });
  };

  const removeItem = (index) => {
    const updatedItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, items: updatedItems });
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text('Invoice', 20, 20);

    doc.setFontSize(12);
    doc.text(invoiceData.companyName, 20, 30);
    doc.text(invoiceData.companyAddress, 20, 35);
    doc.text(`Email: ${invoiceData.companyEmail}`, 20, 40);
    doc.text(`Phone: ${invoiceData.companyPhone}`, 20, 45);

    doc.text(invoiceData.clientName, 20, 70);
    doc.text(invoiceData.clientAddress, 20, 75);

    doc.text('Invoice Number: 001', 20, 100);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 105);

    doc.text('Item', 20, 130);
    doc.text('Quantity', 100, 130);
    doc.text('Price', 150, 130);
    doc.text('Total', 180, 130);

    let yPosition = 140;
    let totalAmount = 0;
    invoiceData.items.forEach((item, index) => {
      const itemTotal = item.quantity * item.price;
      totalAmount += itemTotal;

      doc.text(item.description, 20, yPosition);
      doc.text(item.quantity.toString(), 100, yPosition);
      doc.text(`$${item.price}`, 150, yPosition);
      doc.text(`$${itemTotal.toFixed(2)}`, 180, yPosition);

      yPosition += 10;
    });

    doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 20, yPosition + 20);

    doc.save('invoice.pdf');
  };

  return (
    <div>
      <h2>Invoice Generator</h2>
      <form>
        <h3>Company Information</h3>
        <input
          type="text"
          name="companyName"
          value={invoiceData.companyName}
          onChange={handleChange}
          placeholder="Company Name"
        /><br />
        <input
          type="text"
          name="companyAddress"
          value={invoiceData.companyAddress}
          onChange={handleChange}
          placeholder="Address"
        /><br />
        <input
          type="email"
          name="companyEmail"
          value={invoiceData.companyEmail}
          onChange={handleChange}
          placeholder="Email"
        /><br />
        <input
          type="text"
          name="companyPhone"
          value={invoiceData.companyPhone}
          onChange={handleChange}
          placeholder="Phone"
        /><br />

        <h3>Client Information</h3>
        <input
          type="text"
          name="clientName"
          value={invoiceData.clientName}
          onChange={handleChange}
          placeholder="Client Name"
        /><br />
        <input
          type="text"
          name="clientAddress"
          value={invoiceData.clientAddress}
          onChange={handleChange}
          placeholder="Client Address"
        /><br />

        <h3>Invoice Items</h3>
        {invoiceData.items.map((item, index) => (
          <div key={index}>
            <input
              type="text"
              name="description"
              value={item.description}
              onChange={(e) => handleChange(e, index)}
              placeholder="Item Description"
            /><br />
            <input
              type="number"
              name="quantity"
              value={item.quantity}
              onChange={(e) => handleChange(e, index)}
              placeholder="Quantity"
            /><br />
            <input
              type="number"
              name="price"
              value={item.price}
              onChange={(e) => handleChange(e, index)}
              placeholder="Price"
            /><br />
            <div className="item-actions">
              <button type="button" onClick={() => removeItem(index)}>Remove</button>
            </div>
          </div>
        ))}
        <button type="button" onClick={addItem}>Add Item</button>
      </form>
      <button onClick={generatePDF}>Generate Invoice</button>
    </div>
  );
}

export default App;
