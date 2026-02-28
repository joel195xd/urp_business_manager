let businessData = [];
let locales = {};
let currentMode = 'admin';
let editingBusinessId = null;

// Listener de mensajes NUI
window.addEventListener('message', function (event) {
    const data = event.data;

    if (data.type === 'URP_OPEN_DASHBOARD') {
        businessData = data.businesses;
        locales = data.translations;
        currentMode = data.mode;
        applyTranslations();
        renderBusinesses(businessData);
        document.getElementById('urp-admin-root').style.display = 'flex';
    } else if (data.type === 'URP_CLOSE_DASHBOARD') {
        closeAll();
    }
});

function closeAll() {
    const root = document.getElementById('urp-admin-root');
    root.classList.add('closing');

    setTimeout(() => {
        root.style.display = 'none';
        root.classList.remove('closing');
        document.getElementById('urp-modal-overlay').style.display = 'none';
        document.getElementById('business-search').value = '';
        editingBusinessId = null;
    }, 250);
}

// Aplica traducciones recibidas
function applyTranslations() {
    const title = currentMode === 'admin' ? locales['panel_title'] : locales['player_panel_title'];
    document.querySelector('.dashboard-title').innerText = title;
    document.getElementById('business-search').placeholder = locales['search_placeholder'];

    // Modal translations
    document.getElementById('modal-cancel').innerText = locales['cancel_btn'] || 'Cancelar';
    document.getElementById('modal-confirm').innerText = locales['confirm_btn'] || 'Confirmar';
}

// Renderiza las tarjetas de negocio
function renderBusinesses(businesses) {
    const list = document.getElementById('business-list');
    list.innerHTML = '';

    businesses.forEach(biz => {
        const card = document.createElement('div');
        card.className = 'business-card';

        const statusClass = biz.isOpen ? 'status-open' : 'status-closed';
        const statusText = biz.isOpen ? locales['status_open'] : locales['status_closed'];
        const statusIcon = biz.isOpen ? 'fa-door-open' : 'fa-door-closed';

        let adminInfo = '';
        if (currentMode === 'admin') {
            adminInfo = `
                <div class="biz-balance">
                    <i class="fas fa-wallet"></i> ${locales['balance_label'] || 'Caja'}: <span class="money-text">$${biz.money || 0}</span>
                </div>
            `;
        }

        let actionButtons = '';
        if (currentMode === 'admin') {
            actionButtons = `
                <button class="btn-action" onclick="URP_EditBusiness('${biz.id}', '${biz.name}', ${biz.money || 0})">
                    <i class="fas fa-cog"></i> ${locales['manage_btn'] || 'Gestionar'}
                </button>
                <button class="btn-action btn-delete" onclick="URP_DeleteBusiness('${biz.id}', '${biz.name}')">
                    <i class="fas fa-trash-alt"></i> ${locales['delete_btn']}
                </button>
            `;
        }

        // Siempre mostrar GPS si hay coordenadas, independientemente del modo o estado
        if (biz.coords) {
            actionButtons += `
                <button class="btn-action" onclick="URP_SetGPS('${biz.id}')">
                    <i class="fas fa-location-arrow"></i> ${locales['gps_btn']}
                </button>
            `;
        }

        card.innerHTML = `
            <div class="biz-info">
                <h3>${biz.name}</h3>
                <div class="status-badge">
                    <span class="biz-status ${statusClass}">
                        <i class="fas ${statusIcon}"></i> ${statusText}
                    </span>
                    ${adminInfo}
                </div>
            </div>
            <div class="actions">
                ${actionButtons}
            </div>
        `;
        list.appendChild(card);
    });
}

// Filtro de búsqueda
document.getElementById('business-search').addEventListener('input', function (e) {
    const term = e.target.value.toLowerCase();
    const filtered = businessData.filter(biz =>
        biz.name.toLowerCase().includes(term) ||
        biz.id.toLowerCase().includes(term)
    );
    renderBusinesses(filtered);
});

// Editar/Gestionar negocio (Abrir Modal)
function URP_EditBusiness(id, currentName, currentMoney) {
    editingBusinessId = id;
    document.getElementById('modal-title').innerText = locales['manage_title'] || 'Gestión de Negocio';
    document.getElementById('modal-input').value = currentName;
    document.getElementById('modal-money-input').value = '';
    document.getElementById('urp-modal-overlay').style.display = 'flex';
    document.getElementById('modal-input').focus();
}

// Botones de Dinero en el Modal
document.getElementById('modal-add-money').addEventListener('click', function () {
    const amount = parseInt(document.getElementById('modal-money-input').value);
    if (amount > 0 && editingBusinessId) {
        URP_UpdateMoney(editingBusinessId, 'add', amount);
        document.getElementById('modal-money-input').value = '';
    }
});

document.getElementById('modal-remove-money').addEventListener('click', function () {
    const amount = parseInt(document.getElementById('modal-money-input').value);
    if (amount > 0 && editingBusinessId) {
        URP_UpdateMoney(editingBusinessId, 'remove', amount);
        document.getElementById('modal-money-input').value = '';
    }
});

function URP_UpdateMoney(id, type, amount) {
    fetch(`https://${GetParentResourceName()}/URP_UpdateBusinessMoney`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id, type: type, amount: amount })
    });
}

// Confirmar cambio de nombre en el modal
document.getElementById('modal-confirm-name').addEventListener('click', function () {
    const newName = document.getElementById('modal-input').value;
    if (newName && editingBusinessId) {
        fetch(`https://${GetParentResourceName()}/URP_UpdateBusinessName`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: editingBusinessId, name: newName })
        });
        // No cerramos el modal aquí para que el usuario pueda seguir gestionando si quiere, 
        // o podemos cerrarlo si prefieres. Por ahora lo dejamos abierto para seguir editando capital.
    }
});

// Cancelar modal
document.getElementById('modal-cancel').addEventListener('click', function () {
    document.getElementById('urp-modal-overlay').style.display = 'none';
    editingBusinessId = null;
});

let deletingBusinessId = null;

// Eliminar negocio
function URP_DeleteBusiness(id, name) {
    deletingBusinessId = id;
    const confirmText = locales['confirm_delete'] ? locales['confirm_delete'].replace('%s', name) : `¿Estás seguro de que deseas eliminar ${name}?`;
    document.getElementById('delete-modal-text').innerText = confirmText;
    document.getElementById('urp-delete-modal-overlay').style.display = 'flex';
}

document.getElementById('delete-modal-confirm').addEventListener('click', function () {
    if (deletingBusinessId) {
        fetch(`https://${GetParentResourceName()}/URP_DeleteBusiness`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: deletingBusinessId })
        });
        document.getElementById('urp-delete-modal-overlay').style.display = 'none';
        deletingBusinessId = null;
    }
});

document.getElementById('delete-modal-cancel').addEventListener('click', function () {
    document.getElementById('urp-delete-modal-overlay').style.display = 'none';
    deletingBusinessId = null;
});

// GPS Waypoint
function URP_SetGPS(id) {
    const biz = businessData.find(b => b.id === id);
    if (biz && biz.coords) {
        fetch(`https://${GetParentResourceName()}/URP_SetGPS`, {
            method: 'POST',
            body: JSON.stringify({ coords: biz.coords })
        });
    }
}

// Cerrar menú
document.getElementById('close-btn').addEventListener('click', function () {
    fetch(`https://${GetParentResourceName()}/URP_CloseMenu`, {
        method: 'POST',
        body: JSON.stringify({})
    });
});

// Cerrar con Escape
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        if (document.getElementById('urp-modal-overlay').style.display === 'flex') {
            document.getElementById('urp-modal-overlay').style.display = 'none';
            editingBusinessId = null;
        } else {
            fetch(`https://${GetParentResourceName()}/URP_CloseMenu`, {
                method: 'POST',
                body: JSON.stringify({})
            });
        }
    }
});
