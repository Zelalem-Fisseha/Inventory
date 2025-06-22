import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="container">
    <h1>Inventory Dashboard</h1>
    
    <div class="dashboard">
      <div class="products-section">
        <div class="section-header">
          <h2>Products</h2>
          <button id="refresh-products" class="btn btn-secondary">Refresh</button>
        </div>
        <div id="products-list" class="products-grid"></div>
      </div>
      
      <div class="add-product-section">
        <h3>Add New Product</h3>
        <form id="add-product-form" class="product-form">
          <div class="form-group">
            <label for="product_name">Product Name</label>
            <input type="text" id="product_name" required />
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" required></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="original_price">Original Price</label>
              <input type="number" id="original_price" step="0.01" required />
            </div>
            <div class="form-group">
              <label for="quantity">Quantity</label>
              <input type="number" id="quantity" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="delivery_fee">Delivery Fee</label>
              <input type="number" id="delivery_fee" step="0.01" required />
            </div>
            <div class="form-group">
              <label for="target_margin">Target Margin (%)</label>
              <input type="number" id="target_margin" step="0.1" required />
            </div>
          </div>
          <button type="submit" class="btn btn-primary">Add Product</button>
        </form>
      </div>
    </div>
    
    <div id="message" class="message"></div>
  </div>
`;

const API = 'http://localhost:3000';

function showMessage(msg, type = 'info') {
  const messageEl = document.getElementById('message');
  messageEl.textContent = msg;
  messageEl.className = `message ${type}`;
  setTimeout(() => {
    messageEl.textContent = '';
    messageEl.className = 'message';
  }, 3000);
}

async function fetchProducts() {
  try {
    const res = await fetch(`${API}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  } catch (error) {
    showMessage('Error loading products: ' + error.message, 'error');
    return [];
  }
}

async function addProduct(data) {
  data.user_id = 1;
  try {
    const res = await fetch(`${API}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product: data })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.errors?.join(', ') || 'Failed to add product');
    }
    return await res.json();
  } catch (error) {
    throw error;
  }
}

async function updateProduct(id, data) {
  data.user_id = 1;
  try {
    const res = await fetch(`${API}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product: data })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.errors?.join(', ') || 'Failed to update product');
    }
    return await res.json();
  } catch (error) {
    throw error;
  }
}

async function deleteProduct(id) {
  try {
    const res = await fetch(`${API}/products/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return true;
  } catch (error) {
    throw error;
  }
}

let editProductId = null;

function setFormToEditMode(product) {
  editProductId = product.id;
  document.getElementById('product_name').value = product.product_name;
  document.getElementById('description').value = product.description;
  document.getElementById('original_price').value = product.original_price;
  document.getElementById('quantity').value = product.quantity;
  document.getElementById('delivery_fee').value = product.delivery_fee;
  document.getElementById('target_margin').value = product.target_margin;
  document.getElementById('add-product-form-submit').textContent = 'Update Product';
  document.getElementById('cancel-edit-btn').style.display = '';
}

function resetFormMode() {
  editProductId = null;
  document.getElementById('add-product-form').reset();
  document.getElementById('add-product-form-submit').textContent = 'Add Product';
  document.getElementById('cancel-edit-btn').style.display = 'none';
}

function editProduct(id) {
  const product = window.currentProducts.find(p => p.id === id);
  if (product) {
    setFormToEditMode(product);
  } else {
    showMessage('Product not found for editing', 'error');
  }
}

function renderProducts(products) {
  window.currentProducts = products; 
  const container = document.getElementById('products-list');
  container.innerHTML = '';
  
  if (products.length === 0) {
    container.innerHTML = '<p class="no-products">No products found. Add your first product!</p>';
    return;
  }
  
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-header">
        <h4>${product.product_name}</h4>
        <div class="product-actions">
          <button class="btn btn-small btn-edit" data-action="edit" data-id="${product.id}">Edit</button>
          <button class="btn btn-small btn-delete" data-action="delete" data-id="${product.id}">Delete</button>
        </div>
      </div>
      <p class="product-description">${product.description}</p>
      <div class="product-details">
        <div class="detail">
          <span class="label">Quantity:</span>
          <span class="value">${product.quantity}</span>
        </div>
        <div class="detail">
          <span class="label">Original Price:</span>
          <span class="value">$${product.original_price}</span>
        </div>
        <div class="detail">
          <span class="label">Delivery Fee:</span>
          <span class="value">$${product.delivery_fee}</span>
        </div>
        <div class="detail">
          <span class="label">Target Margin:</span>
          <span class="value">${product.target_margin}%</span>
        </div>
        <div class="detail highlight">
          <span class="label">Selling Price:</span>
          <span class="value">$${product.selling_price?.toFixed(2) || 'N/A'}</span>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(btn.getAttribute('data-id'));
      editProduct(id);
    });
  });
  container.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(btn.getAttribute('data-id'));
      deleteProductConfirm(id);
    });
  });
}

function deleteProductConfirm(id) {
  if (confirm('Are you sure you want to delete this product?')) {
    deleteProduct(id).then(() => {
      showMessage('Product deleted successfully', 'success');
      loadProducts();
    }).catch(error => {
      showMessage('Error deleting product: ' + error.message, 'error');
    });
  }
}

async function loadProducts() {
  const products = await fetchProducts();
  renderProducts(products);
}

document.getElementById('refresh-products').onclick = loadProducts;

document.getElementById('add-product-form').onsubmit = async (e) => {
  e.preventDefault();
  
  const formData = {
    product_name: document.getElementById('product_name').value,
    description: document.getElementById('description').value,
    original_price: parseFloat(document.getElementById('original_price').value),
    quantity: parseInt(document.getElementById('quantity').value),
    delivery_fee: parseFloat(document.getElementById('delivery_fee').value),
    target_margin: parseFloat(document.getElementById('target_margin').value)
  };
  
  try {
    if (editProductId) {
      await updateProduct(editProductId, formData);
      showMessage('Product updated successfully!', 'success');
      resetFormMode();
    } else {
      await addProduct(formData);
      showMessage('Product added successfully!', 'success');
      document.getElementById('add-product-form').reset();
    }
    loadProducts();
  } catch (error) {
    showMessage('Error saving product: ' + error.message, 'error');
  }
};

if (!document.getElementById('cancel-edit-btn')) {
  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.id = 'cancel-edit-btn';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.className = 'btn btn-secondary';
  cancelBtn.style.display = 'none';
  cancelBtn.onclick = resetFormMode;
  document.getElementById('add-product-form').appendChild(cancelBtn);
}

const submitBtn = document.querySelector('#add-product-form button[type="submit"]');
if (submitBtn) submitBtn.id = 'add-product-form-submit';

loadProducts();