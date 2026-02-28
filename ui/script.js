/**
 * URP Business Manager
 * Lógica de Interfaz - Versión Profesional
 * 
 * Este archivo gestiona la visualización de datos, filtros y eventos NUI.
 */

let businesses = [];
let currentLocale = {};

// Inicialización de la tablet
function initialize() {
    setupLocale();
    applyVisualSettings();

    // Lista vacía al inicio (esperando datos del servidor)
    renderBusinesses();
    updateStats();
}

// Configura el idioma según el config
function setupLocale() {
    const localeKey = (window.URPConfig.Locale || 'es').toLowerCase();
    currentLocale = (localeKey === 'es') ? Locales_ES : Locales_EN;

    updateUIStrings();
}

// Actualiza los textos de la interfaz
function updateUIStrings() {
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    };

    setText('ui-title', currentLocale.TITLE);
    setText('ui-subtitle', currentLocale.SUBTITLE);
    setText('ui-total-biz-label', currentLocale.TOTAL_BUSINESSES);
    setText('ui-open-biz-label', currentLocale.OPEN_NOW);
    setText('ui-total-money-label', currentLocale.TOTAL_ECONOMY);

    const search = document.getElementById('biz-search');
    if (search) search.placeholder = currentLocale.SEARCH_PLACEHOLDER;

    // Modales
    setText('ui-modal-edit-title', currentLocale.EDIT_TITLE);
    setText('ui-label-new-name', currentLocale.NEW_LABEL);
    setText('ui-btn-cancel-edit', currentLocale.CANCEL);
    setText('ui-btn-save', currentLocale.SAVE);
    setText('ui-modal-delete-title', currentLocale.DELETE_TITLE);
    setText('ui-delete-irreversible', currentLocale.DELETE_IRREVERSIBLE);
    setText('ui-btn-cancel-delete', currentLocale.CANCEL);
    setText('ui-btn-confirm-delete', currentLocale.DELETE_PERMANENT);
}

// Aplica el diseño (cuadrícula y desenfoque)
function applyVisualSettings() {
    const dashboard = document.querySelector('.urp-admin-dashboard');
    if (!dashboard) return;

    dashboard.style.backgroundImage = window.URPConfig.Visuals.ShowGrid ? '' : 'none';
    dashboard.style.backdropFilter = `blur(${window.URPConfig.Visuals.BlurIntensity})`;
}

// Formato de moneda
function formatCurrency(amount) {
    const config = window.URPConfig.Currency;
    return new Intl.NumberFormat(config.Format, {
        style: 'currency',
        currency: config.Code,
        maximumFractionDigits: 0
    }).format(amount);
}

// Actualiza las estadísticas superiores
function updateStats() {
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    };

    setText('total-biz', businesses.length);
    setText('open-biz', businesses.filter(b => b.open === 1).length);

    const totalMoney = businesses.reduce((sum, b) => sum + (b.money || 0), 0);
    setText('total-money', formatCurrency(totalMoney));
}

// Renderiza la lista de negocios
function renderBusinesses(filter = '') {
    const container = document.getElementById('business-container');
    if (!container) return;

    container.innerHTML = '';

    const filtered = businesses.filter(b =>
        (b.label && b.label.toLowerCase().includes(filter.toLowerCase())) ||
        (b.id && b.id.toLowerCase().includes(filter.toLowerCase()))
    );

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-search"></i>
                <span>${currentLocale.NO_RESULTS || 'Sin resultados'} "${filter}"</span>
            </div>
        `;
        return;
    }

    filtered.forEach(biz => {
        const item = document.createElement('div');
        item.className = 'business-item';
        item.innerHTML = `
            <div class="biz-info-container">
                <div class="biz-icon">
                    <i class="fas ${biz.icon || 'fa-briefcase'}"></i>
                </div>
                <div class="biz-details">
                    <h3>${biz.label}</h3>
                    <p>${currentLocale.ID_LABEL || 'ID: '}${biz.id}</p>
                    <div class="biz-badges">
                        <span class="badge ${biz.open ? 'open' : 'closed'}">
                            ${biz.open ? (currentLocale.OPEN || 'Abierto') : (currentLocale.CLOSED || 'Cerrado')}
                        </span>
                        <span class="badge type">${biz.type || 'N/A'}</span>
                        <span class="badge type">Lvl ${biz.level || 0}</span>
                    </div>
                </div>
                <div class="biz-money">
                    ${formatCurrency(biz.money || 0)}
                </div>
            </div>
            <div class="biz-actions">
                <button class="action-btn" onclick="openEditModal('${biz.id}')">
                    <i class="fas fa-edit"></i> ${currentLocale.EDIT}
                </button>
                <button class="action-btn delete" onclick="openDeleteModal('${biz.id}')">
                    <i class="fas fa-trash"></i> ${currentLocale.DELETE}
                </button>
            </div>
        `;
        container.appendChild(item);
    });
}

// --- COMUNICACIÓN FIVE-M ---

window.addEventListener('message', (event) => {
    const data = event.data;

    switch (data.action) {
        case 'setBusinesses':
            businesses = data.list;
            renderBusinesses(document.getElementById('biz-search').value);
            updateStats();
            break;

        case 'updateConfig':
            if (data.config) {
                window.URPConfig = { ...window.URPConfig, ...data.config };
                setupLocale();
                applyVisualSettings();
            }
            break;
    }
});

// --- GESTIÓN DE MODALES ---

window.openEditModal = function (id) {
    const biz = businesses.find(b => b.id === id);
    if (!biz) return;

    document.getElementById('edit-biz-id').value = biz.id;
    document.getElementById('edit-label').value = biz.label;
    document.getElementById('edit-modal').classList.add('active');
};

window.openDeleteModal = function (id) {
    const biz = businesses.find(b => b.id === id);
    if (!biz) return;

    document.getElementById('delete-biz-id').value = biz.id;
    document.getElementById('delete-biz-name').innerText = biz.label;

    const warningBase = currentLocale.DELETE_WARNING || 'Confirmar borrado';
    document.getElementById('ui-delete-warning-text').innerHTML = `${warningBase} <span class="highlight">${biz.label}</span>?`;

    document.getElementById('delete-modal').classList.add('active');
};

function closeModals() {
    document.querySelectorAll('.urp-modal-overlay').forEach(m => m.classList.remove('active'));
}

// Eventos del DOM
document.addEventListener('DOMContentLoaded', () => {
    const search = document.getElementById('biz-search');
    if (search) {
        search.addEventListener('input', (e) => renderBusinesses(e.target.value));
    }

    document.querySelectorAll('.close-modal, .cancel, .urp-modal-overlay').forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target === el || el.classList.contains('close-modal') || el.classList.contains('cancel')) {
                closeModals();
            }
        });
    });

    const saveBtn = document.getElementById('ui-btn-save');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const id = document.getElementById('edit-biz-id').value;
            const newLabel = document.getElementById('edit-label').value;

            fetch(`https://${GetParentResourceName()}/editBusiness`, {
                method: 'POST',
                body: JSON.stringify({ id, label: newLabel })
            });

            closeModals();
        });
    }

    const deleteBtn = document.getElementById('ui-btn-confirm-delete');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            const id = document.getElementById('delete-biz-id').value;

            fetch(`https://${GetParentResourceName()}/deleteBusiness`, {
                method: 'POST',
                body: JSON.stringify({ id })
            });

            closeModals();
        });
    }

    initialize();
});
