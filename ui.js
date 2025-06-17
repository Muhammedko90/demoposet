// Gerekli kütüphaneleri yükle (global scope'tan)
const { jsPDF } = window.jspdf;

// --- DOM ELEMENTLERİ ---
export const allElements = {
    loadingOverlay: document.getElementById('loading-overlay'),
    loadingSpinner: document.getElementById('loading-spinner'),
    loadingText: document.getElementById('loading-text'),
    retryContainer: document.getElementById('retry-container'),
    retryButton: document.getElementById('retry-button'),
    appContainer: document.getElementById('app-container'),
    mainContent: document.getElementById('main-content'),
    itemList: document.getElementById('item-list'),
    emptyItemListMessage: document.getElementById('empty-item-list-message'),
    searchItemsInput: document.getElementById('search-items-input'),
    totalBagsCounter: document.getElementById('total-bags-counter'),
    sortAlphaBtn: document.getElementById('sort-alpha'),
    sortBagsBtn: document.getElementById('sort-bags'),
    sortDateBtn: document.getElementById('sort-date'),
    addItemForm: document.getElementById('add-item-form'),
    customerNameInput: document.getElementById('customer-name'),
    bagCountInput: document.getElementById('bag-count'),
    suggestionsBox: document.getElementById('suggestions-box'),
    archiveList: document.getElementById('archive-list'),
    emptyArchiveListMessage: document.getElementById('empty-archive-list-message'),
    searchArchiveInput: document.getElementById('search-archive-input'),
    archivePagination: document.getElementById('archive-pagination'),
    notesList: document.getElementById('notes-list'),
    emptyNotesMessage: document.getElementById('empty-notes-message'),
    manageCustomersBtn: document.getElementById('manage-customers-btn'),
    exportJsonBtn: document.getElementById('export-json-btn'),
    importJsonBtn: document.getElementById('import-json-btn'),
    importFileInput: document.getElementById('import-file-input'),
    exportPdfBtn: document.getElementById('export-pdf-btn'),
    exportCsvBtn: document.getElementById('export-csv-btn'),
    resetItemsBtn: document.getElementById('reset-items-btn'),
    resetAllBtn: document.getElementById('reset-all-btn'),
    modalContainer: document.getElementById('modal-container'),
    modalContentWrapper: document.getElementById('modal-content-wrapper'),
    modalContent: document.getElementById('modal-content'),
};

// --- İKONLAR ---
export const icons = {
    alpha_asc: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M10.082 12.629 9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371h-1.781zm1.57-1.055h-1.296l.648-2.042.648 2.042z"/><path d="M12.96 7.022c.16-.21.283-.417.371-.622h.043c.09.205.214.412.375.622L15.04 8.5h-1.2l-.71-1.258h-.043l-.71 1.258h-1.21l1.83-3.05zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L4.5 12.293V2.5z"/></svg>',
    alpha_desc: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M10.082 3.629 9.664 2H8.598l1.789 5.332h1.234L13.402 2h-1.12l-.419 1.371h-1.781zm1.57 1.055h-1.296l.648 2.042.648 2.042z"/><path d="M12.96 10.022c.16.21.283-.417.371.622h.043c.09-.205.214-.412.375-.622L15.04 8.5h-1.2l-.71 1.258h-.043l-.71-1.258h-1.21l1.83 3.05zM4.5 13.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L4.5 3.707V13.5z"/></svg>',
    bags_desc: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11.5 2.707V14.5a.5.5 0 0 0 .5.5z"/><path fill-rule="evenodd" d="M2.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5z"/></svg>',
    bags_asc: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M11.5 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L11.5 13.293V1.5a.5.5 0 0 1 .5-.5z"/><path fill-rule="evenodd" d="M2.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5z"/></svg>',
    date_desc: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>',
    date_asc: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M10.854 8.854a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708 0l-1.5 1.5a.5.5 0 0 0 .708.708L7.5 6.707l2.646 2.647a.5.5 0 0 0 .708 0z"/><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>'
};

// --- YARDIMCI FONKSİYONLAR ---
export const formatDate = (iso) => {
    if(!iso) return '';
    const date = iso.seconds ? new Date(iso.seconds * 1000) : new Date(iso);
    return date.toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short'});
};
export const formatRelativeTime = (iso) => {
    if (!iso) return '';
    const date = iso.seconds ? new Date(iso.seconds * 1000) : new Date(iso);
    const now = new Date();
    const diffDays = Math.floor((now.setHours(0,0,0,0) - date.setHours(0,0,0,0)) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return '';
    if (diffDays === 0) return 'bugün';
    if (diffDays === 1) return 'dün';
    return `${diffDays} gün önce`;
};
export function showApp() {
    allElements.loadingOverlay.style.opacity = '0';
    allElements.appContainer.style.opacity = '1';
    setTimeout(() => { allElements.loadingOverlay.style.display = 'none'; }, 300);
}
export function showConnectionError(message) {
    allElements.loadingSpinner.style.display = 'none';
    allElements.retryContainer.classList.remove('hidden');
    allElements.loadingText.innerHTML = `<span class="text-red-400 font-semibold">${message}</span>`;
}
// --- AYARLAR ---
export function applySettings(settings) {
    document.body.className = `theme-${settings.theme} text-primary`;
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('ring-2', btn.dataset.theme === settings.theme);
        btn.classList.toggle('ring-accent', btn.dataset.theme === settings.theme);
    });

    document.body.style.fontSize = `${settings.fontSize}px`;
    const fontSizeSlider = document.getElementById('font-size-slider');
    const fontSizePreview = document.getElementById('font-size-preview');
    if(fontSizeSlider) fontSizeSlider.value = settings.fontSize;
    if(fontSizePreview) fontSizePreview.textContent = `${settings.fontSize}px`;
}

// --- RENDER FONKSİYONLARI ---
export function createItemElement(item) {
    const div = document.createElement('div');
    const date = item.lastModified?.seconds ? new Date(item.lastModified.seconds * 1000) : new Date();
    const diffDays = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));

    const overdueClass = (() => {
        if (diffDays >= 15) return 'border-red-500/60 bg-red-500/10';
        if (diffDays >= 7) return 'border-yellow-500/60 bg-yellow-500/10';
        return 'border-dynamic';
    })();
    const noteIndicatorHTML = item.note ? `<span class="accent-text text-xs" title="Not Mevcut">●</span>` : '';
    
    div.className = `bg-primary p-4 rounded-lg shadow-md flex items-center justify-between border ${overdueClass} transition-colors duration-300`;
    div.dataset.id = item.id;
    div.innerHTML = `
        <div class="item-details flex-1 flex items-center gap-4">
            <div class="item-bag-count bg-purple-500/20 text-purple-300 font-bold w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full text-xl">${item.bagCount}</div>
            <div class="flex-1">
                <p class="item-customer-name font-semibold text-lg text-primary flex items-center gap-2">${item.customerName} ${noteIndicatorHTML}</p>
                <p class="item-subtext text-sm text-secondary">Poşet Sayısı</p>
                <p class="item-subtext text-xs text-secondary/70 mt-1">Son Değişiklik: ${formatRelativeTime(item.lastModified)}</p>
            </div>
        </div>
        <div class="item-actions flex items-center gap-1 sm:gap-2 ml-2">
            <button data-action="edit-count" class="p-2 text-secondary hover:accent-text rounded-full transition" title="Poşet Sayısını Düzenle"><svg class="pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.293z"/></svg></button>
            <button data-action="edit-note" class="p-2 text-secondary hover:accent-text rounded-full transition ${item.note ? 'accent-text' : ''}" title="Notu Düzenle"><svg class="pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M4.5 12.5A.5.5 0 0 1 5 12h3.793l1.147-1.146a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .5-.5m.5 2.5a.5.5 0 0 1 0-1h4a.5.5 0 0 1 0 1z"/><path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1z"/></svg></button>
            <button data-action="deliver" class="p-2 text-green-400 hover:text-green-300 rounded-full transition" title="Teslim Et"><svg class="pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/></svg></button>
        </div>`;
    return div;
}

export function createArchiveItemElement(item) {
    const div = document.createElement('div');
    div.className = 'bg-primary/50 opacity-70 p-4 rounded-lg shadow-md flex items-center justify-between border border-dynamic';
    div.dataset.id = item.id;
    div.innerHTML = `
        <div class="item-details flex-1 flex items-center gap-4">
            <div class="item-bag-count bg-slate-600/50 text-slate-400 font-bold w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full text-xl">${item.bagCount}</div>
            <div class="flex-1">
                <p class="item-customer-name font-semibold text-lg text-primary/80">${item.customerName}</p>
                <p class="item-subtext text-sm text-secondary">Teslim Edildi: ${formatDate(item.deliveredAt)}</p>
            </div>
        </div>
        <div class="item-actions flex items-center gap-2 ml-2">
            <button data-action="restore" class="p-2 text-secondary hover:text-yellow-400 rounded-full transition" title="Geri Yükle"><svg class="pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/></svg></button>
            <button data-action="delete-permanent" class="p-2 text-secondary hover:text-red-500 rounded-full transition" title="Kalıcı Olarak Sil"><svg class="pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3V2h11v1z"/></svg></button>
        </div>`;
    return div;
}

export function createNoteElement(item) {
    const div = document.createElement('div');
    div.className = 'bg-primary p-4 rounded-lg shadow-md border border-dynamic';
    div.dataset.id = item.id;
    div.innerHTML = `
        <div class="flex justify-between items-start">
             <p class="font-semibold accent-text">${item.customerName}</p>
             <button data-action="delete-note-from-tab" class="p-1 -mt-1 -mr-1 text-secondary hover:text-red-500 rounded-full transition" title="Notu Sil">
                <svg class="pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3V2h11v1z"/></svg>
            </button>
        </div>
        <p class="text-primary mt-2 whitespace-pre-wrap">${item.note}</p>
    `;
    return div;
}

// --- MODAL, SIRALAMA VE DİĞER YARDIMCI UI FONKSİYONLAR ---
export function switchTab(target, instant = false) {
    const tabs = document.querySelectorAll('nav button[id^="tab-"]');
    const panels = document.querySelectorAll('.panel[id^="panel-"]');
    
    tabs.forEach(tab => tab.classList.remove('tab-active'));
    document.getElementById(`tab-${target}`).classList.add('tab-active');

    panels.forEach(panel => {
        const isTargetPanel = panel.id === `panel-${target}`;
        if (instant) {
            panel.style.transition = 'none';
            panel.classList.toggle('hidden', !isTargetPanel);
            requestAnimationFrame(() => panel.style.transition = '');
        } else {
            panel.classList.toggle('hidden', !isTargetPanel);
        }
    });
}

export function updateSortButtons(sortState) {
    [allElements.sortAlphaBtn, allElements.sortBagsBtn, allElements.sortDateBtn].forEach(btn => btn.classList.remove('sort-active'));
    const activeBtn = document.getElementById(`sort-${sortState.type}`);
    if (activeBtn) activeBtn.classList.add('sort-active');

    allElements.sortAlphaBtn.innerHTML = icons[`alpha_${sortState.type === 'alpha' ? sortState.direction : 'asc'}`];
    allElements.sortBagsBtn.innerHTML = icons[`bags_${sortState.type === 'bags' ? sortState.direction : 'desc'}`];
    allElements.sortDateBtn.innerHTML = icons[`date_${sortState.type === 'date' ? sortState.direction : 'desc'}`];
}

export function renderArchivePagination(totalPages, archiveCurrentPage, onPageClick) {
    allElements.archivePagination.innerHTML = '';
    if(totalPages <= 1) return;

    const createBtn = (text, onClick, disabled = false) => {
        const btn = document.createElement('button');
        btn.innerHTML = text;
        btn.className = 'pagination-btn p-2 bg-tertiary rounded-lg hover:accent-bg transition disabled:opacity-50 disabled:cursor-not-allowed';
        btn.disabled = disabled;
        btn.onclick = onClick;
        return btn;
    }

    allElements.archivePagination.appendChild(createBtn('&laquo;', () => onPageClick(archiveCurrentPage - 1), archiveCurrentPage === 1));

    for(let i = 1; i <= totalPages; i++) {
        const pageBtn = createBtn(i, () => onPageClick(i));
        if (i === archiveCurrentPage) pageBtn.classList.add('active');
        allElements.archivePagination.appendChild(pageBtn);
    }

    allElements.archivePagination.appendChild(createBtn('&raquo;', () => onPageClick(archiveCurrentPage + 1), archiveCurrentPage === totalPages));
}

function hideModalUI() {
    allElements.modalContainer.style.opacity = '0';
    allElements.modalContentWrapper.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        allElements.modalContainer.classList.add('hidden');
        allElements.modalContent.innerHTML = '';
    }, 300);
}

export function showModal(htmlContent) {
    return new Promise(resolve => {
        allElements.modalContent.innerHTML = htmlContent;
        
        const modalClickListener = (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            const input = allElements.modalContent.querySelector('input, textarea');
            const value = input ? input.value : true;

            allElements.modalContent.removeEventListener('click', modalClickListener);
            
            hideModalUI();

            switch (button.id) {
                case 'modal-confirm':
                    resolve({ confirmed: true, value });
                    break;
                case 'modal-cancel':
                case 'modal-close':
                    resolve({ confirmed: false });
                    break;
            }
        };

        allElements.modalContent.addEventListener('click', modalClickListener);

        allElements.modalContainer.classList.remove('hidden');
        requestAnimationFrame(() => {
            allElements.modalContainer.style.opacity = '1';
            allElements.modalContentWrapper.classList.remove('scale-95', 'opacity-0');
        });
    });
}

export async function showConfirmationModal(message, onConfirm, confirmText = "Onayla", isDestructive = false) {
    const confirmClass = isDestructive ? 'bg-red-600 hover:bg-red-700' : 'accent-bg accent-bg-hover';
    const result = await showModal(`
        <h3 class="text-xl font-semibold mb-2 ${isDestructive ? 'text-red-400' : 'text-primary'}">Onay</h3>
        <p class="text-secondary mb-4">${message}</p>
        <div class="flex justify-end gap-3">
            <button id="modal-cancel" class="bg-tertiary px-4 py-2 rounded-lg hover:bg-slate-500 transition">İptal</button>
            <button id="modal-confirm" class="${confirmClass} text-white px-4 py-2 rounded-lg transition">${confirmText}</button>
        </div>`);
    
    if (result.confirmed) {
        await onConfirm();
    }
}

export async function showInputModal(title, message, type = 'text', value = '') {
    const inputHtml = type === 'textarea'
        ? `<textarea class="w-full p-2 bg-tertiary border border-dynamic rounded-lg focus:ring-2 ring-accent transition h-28 mb-4">${value}</textarea>`
        : `<input type="${type}" value="${value}" class="w-full p-2 bg-tertiary border border-dynamic rounded-lg focus:ring-2 ring-accent transition mb-4">`;

    return showModal(`
        <h3 class="text-xl font-semibold mb-2 text-primary">${title}</h3>
        <p class="text-secondary mb-2">${message}</p>
        ${inputHtml}
        <div class="flex justify-end gap-3">
            <button id="modal-cancel" class="bg-tertiary px-4 py-2 rounded-lg hover:bg-slate-500 transition">İptal</button>
            <button id="modal-confirm" class="accent-bg text-white px-4 py-2 rounded-lg accent-bg-hover transition">Kaydet</button>
        </div>`);
}

export function exportToPDF(activeItems) {
    if (activeItems.length === 0) { alert("Dışa aktarılacak veri yok."); return; }

    const pdf = new jsPDF();
    pdf.text("Bekleyen Poşet Listesi", 14, 16);
    
    const tableColumn = ["#", "Musteri Adi", "Poset Sayisi", "Tarih"];
    const tableRows = [];

    activeItems.forEach((item, index) => {
        tableRows.push([
            index + 1,
            item.customerName,
            item.bagCount,
            formatDate(item.lastModified).split(' ')[0]
        ]);
    });

    pdf.autoTable({
        head: [tableColumn], body: tableRows, startY: 20,
    });

    pdf.save('poset_listesi.pdf');
}

export function exportToCSV(activeItems) {
    if (activeItems.length === 0) { alert("Dışa aktarılacak veri yok."); return; }
    
    const headers = "Musteri Adi,Poset Sayisi,Not,Son Degisiklik Tarihi";
    const rows = activeItems.map(item =>
        `"${item.customerName.replace(/"/g, '""')}",${item.bagCount},"${(item.note || '').replace(/"/g, '""')}",${formatDate(item.lastModified)}`
    );

    const csvContent = "\uFEFF" + [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "poset_listesi.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
