// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  /* ---------- ELEMENTS ---------- */
  const settingsBtn       = document.getElementById('settingsBtn');
  const settingsModal     = document.getElementById('settingsModal');
  const closeSettingsBtn  = document.getElementById('closeSettingsBtn');
  const editTitleBtn      = document.getElementById('editTitleBtn');
  const clearDataBtn      = document.getElementById('clearDataBtn');

  const titleEditor       = document.getElementById('titleEditor');
  const saveTitleBtn      = document.getElementById('saveTitleBtn');
  const backToSettingsBtn = document.getElementById('backToSettingsBtn');
  const newTitleInput     = document.getElementById('newTitleInput');
  const inventoryTitle    = document.getElementById('inventoryTitle');

  const addItemBtn  = document.getElementById('addItemBtn');
  const idInput     = document.getElementById('idNumber');
  const itemInput   = document.getElementById('itemInput');
  const descInput   = document.getElementById('itemDescriptionInput');
  const qtyInput    = document.getElementById('itemQuantityInput');

  const inventoryTable = document.getElementById('inventoryTable');
  const inventoryBody  = inventoryTable.querySelector('tbody');

  const editItemModal = document.getElementById('editItemModal');
  const editId   = document.getElementById('editId');
  const editName = document.getElementById('editName');
  const editDesc = document.getElementById('editDesc');
  const editQty  = document.getElementById('editQty');
  const saveEditBtn   = document.getElementById('saveEditBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');

  /* ---------- DATA ---------- */
  let inventory = JSON.parse(localStorage.getItem('inventoryItems')) || [];
  let currentEditIndex = null;

  /* ---------- UTILITIES ---------- */
  const markInvalid = (el, bad = true) => el.classList.toggle('invalid', bad);

  const closeAllModals = () =>
    document.querySelectorAll('.modal:not(.hidden)')
      .forEach(m => m.classList.add('hidden'));

  /* ---------- GLOBAL ESC / BACKDROP CLICK ---------- */
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllModals(); });
  document.addEventListener('click',  e => { if (e.target.classList.contains('modal')) closeAllModals(); });

  /* ---------- INITIAL TITLE ---------- */
  const savedTitle = localStorage.getItem('inventoryTitle');
  if (savedTitle) inventoryTitle.textContent = savedTitle;

  /* ---------- SETTINGS MODAL ---------- */
  settingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));
  closeSettingsBtn.addEventListener('click', closeAllModals);

  /* ----- Title editing ----- */
  editTitleBtn.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
    titleEditor.classList.remove('hidden');
    newTitleInput.value = inventoryTitle.textContent;
  });

  saveTitleBtn.addEventListener('click', () => {
    const t = newTitleInput.value.trim();
    if (t) {
      inventoryTitle.textContent = t;
      localStorage.setItem('inventoryTitle', t);
    }
    closeAllModals();
  });

  backToSettingsBtn.addEventListener('click', () => {
    titleEditor.classList.add('hidden');
    settingsModal.classList.remove('hidden');
  });

  /* ----- Clear ALL ----- */
  clearDataBtn.addEventListener('click', () => {
    if (confirm("Clear all stored data?")) {
      localStorage.clear();
      inventory = [];
      inventoryTitle.textContent = "Let's Inventory";
      renderInventory();
    }
    closeAllModals();
  });

  /* ---------- ADD NEW ITEM ---------- */
  addItemBtn.addEventListener('click', () => {
    const id   = idInput.value.trim();
    const name = itemInput.value.trim();
    const desc = descInput.value.trim();
    const qty  = qtyInput.value.trim();

    // reset invalid marks
    [idInput, itemInput, descInput, qtyInput].forEach(i => markInvalid(i,false));

    if (!id || !name || !desc || !qty) {
      if (!id)   markInvalid(idInput);
      if (!name) markInvalid(itemInput);
      if (!desc) markInvalid(descInput);
      if (!qty)  markInvalid(qtyInput);
      alert("Please fill out all fields.");
      return;
    }

    if (inventory.some(i => i.id === id)) {
      markInvalid(idInput);
      alert("That code already exists. Choose a unique code.");
      return;
    }

    if (inventory.some(i => i.name === name && i.desc === desc)) {
      markInvalid(itemInput); markInvalid(descInput);
      alert("An item with the same name *and* description already exists.");
      return;
    }

    inventory.push({ id, name, desc, qty });
    localStorage.setItem('inventoryItems', JSON.stringify(inventory));
    renderInventory();
    clearInputs();
  });

  const clearInputs = () => {
    idInput.value = itemInput.value = descInput.value = qtyInput.value = '';
  };

  /* ---------- RENDER TABLE ---------- */
  function renderInventory() {
    inventoryBody.innerHTML = '';
    inventoryTable.classList.toggle('hidden', inventory.length === 0);

    inventory.forEach((item, idx) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.desc}</td>
        <td>${item.qty}</td>
        <td><button class="editBtn">Edit</button> <button class="deleteBtn">Delete</button></td>
      `;

      row.querySelector('.editBtn').onclick = () => openEditModal(idx);
      row.querySelector('.deleteBtn').onclick = () => {
        if (confirm("Delete this item?")) {
          inventory.splice(idx, 1);
          localStorage.setItem('inventoryItems', JSON.stringify(inventory));
          renderInventory();
        }
      };
      inventoryBody.appendChild(row);
    });
  }

  /* ---------- EDIT ITEM MODAL ---------- */
  function openEditModal(i) {
    currentEditIndex = i;
    const itm = inventory[i];
    editId.value = itm.id; editName.value = itm.name; editDesc.value = itm.desc; editQty.value = itm.qty;
    editItemModal.classList.remove('hidden');
  }

  saveEditBtn.addEventListener('click', () => {
    // enforce qty ≥ 1
    if (editQty.value.trim() === '' || +editQty.value < 1) {
      alert('Quantity must be at least 1');
      markInvalid(editQty); return;
    }
    markInvalid(editQty,false);

    inventory[currentEditIndex].name = editName.value.trim();
    inventory[currentEditIndex].desc = editDesc.value.trim();
    inventory[currentEditIndex].qty  = editQty.value.trim();
    localStorage.setItem('inventoryItems', JSON.stringify(inventory));
    renderInventory();
    closeAllModals();
  });

  cancelEditBtn.addEventListener('click', closeAllModals);

  /* ---------- INITIAL RENDER ---------- */
  renderInventory();
});
