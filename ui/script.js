let businessData = [];
let locales = {};

// Listener de mensajes NUI
window.addEventListener('message', function (event) {
    const data = event.data;

    if (data.type === 'URP_OPEN_DASHBOARD') {
        businessData = data.businesses;
        locales = data.translations;
        applyTranslations();
        renderBusinesses(businessData);
        document.getElementById('urp-admin-root').style.display = 'flex';
    } else if (data.type === 'URP_CLOSE_DASHBOARD') {
        document.getElementById('urp-admin-root').style.display = 'none';
        document.getElementById('business-search').value = '';
    }
});

// Aplica traducciones recibidas
function applyTranslations() {
    document.querySelector('.dashboard-title').innerText = locales['panel_title'];
    document.getElementById('business-search').placeholder = locales['search_placeholder'];
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

        card.innerHTML = `
            <div class="biz-info">
                <h3>${biz.name}</h3>
                <div class="status-badge">
                    <span class="biz-status ${statusClass}">
                        <i class="fas ${statusIcon}"></i> ${statusText}
                    </span>
                </div>
            </div>
            <div class="actions">
                <button class="btn-action" onclick="URP_EditBusiness('${biz.id}', '${biz.name}')">
                    <i class="fas fa-edit"></i> ${locales['edit_btn']}
                </button>
                <button class="btn-action btn-delete" onclick="URP_DeleteBusiness('${biz.id}', '${biz.name}')">
                    <i class="fas fa-trash-alt"></i> ${locales['delete_btn']}
                </button>
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

// Editar nombre
function URP_EditBusiness(id, currentName) {
    const promptText = locales['prompt_new_name'].replace('%s', currentName);
    const newName = prompt(promptText, currentName);
    if (newName && newName !== currentName) {
        fetch(`https://${GetParentResourceName()}/URP_UpdateBusinessName`, {
            method: 'POST',
            body: JSON.stringify({ id: id, name: newName })
        });
    }
}

// Eliminar negocio
function URP_DeleteBusiness(id, name) {
    const confirmText = locales['confirm_delete'].replace('%s', name);
    if (confirm(confirmText)) {
        fetch(`https://${GetParentResourceName()}/URP_DeleteBusiness`, {
            method: 'POST',
            body: JSON.stringify({ id: id })
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
        fetch(`https://${GetParentResourceName()}/URP_CloseMenu`, {
            method: 'POST',
            body: JSON.stringify({})
        });
    }
});
