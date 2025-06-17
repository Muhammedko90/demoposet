// Gerekli modülleri ve fonksiyonları içe aktar
import { 
    db, auth, signInAnonymously, onAuthStateChanged, collection, doc, addDoc, 
    updateDoc, deleteDoc, onSnapshot, query, serverTimestamp, writeBatch 
} from './firebase.js';

import { 
    allElements, icons, formatDate, formatRelativeTime, showApp, showConnectionError, applySettings, 
    createItemElement, createArchiveItemElement, createNoteElement, switchTab, updateSortButtons, 
    renderArchivePagination, showModal, showConfirmationModal, showInputModal, exportToPDF, exportToCSV 
} from './ui.js';

// --- UYGULAMA MANTIĞI ---
document.addEventListener('DOMContentLoaded', () => {

    // --- STATE (DURUM) YÖNETİMİ ---
    let allItems = [];
    let allCustomers = [];
    let settings = {};
    let sortState = { type: 'alpha', direction: 'asc' };
    let archiveCurrentPage = 1;
    const itemsPerPage = 10;
    let itemsUnsubscribe = null;
    let customersUnsubscribe = null;
    let connectionTimeout = null;

    // --- YARDIMCI FONKSİYONLAR ---
    const getSettingsFromStorage = () => JSON.parse(localStorage.getItem('emanet-settings-v2')) || { theme: 'dark', fontSize: 16 };
    const saveSettingsToStorage = (newSettings) => {
        settings = newSettings;
        localStorage.setItem('emanet-settings-v2', JSON.stringify(settings));
    }
    
    // --- RENDER FONKSİYONLARI ---
    function renderAll() {
        const activeItems = allItems.filter(item => item.status !== 'delivered');
        const archivedItems = allItems.filter(item => item.status === 'delivered');
        
        renderItems(activeItems);
        renderArchive(archivedItems);
        renderNotes();
        renderReports();
    }
    
    function renderItems(items) {
        const searchQuery = allElements.searchItemsInput.value.toLowerCase();
        let filteredItems = items.filter(item => item.customerName.toLowerCase().includes(searchQuery));
        
        allElements.totalBagsCounter.textContent = filteredItems.reduce((sum, item) => sum + item.bagCount, 0);

        const direction = sortState.direction === 'asc' ? 1 : -1;
        filteredItems.sort((a, b) => {
            if (sortState.type === 'alpha') return a.customerName.localeCompare(b.customerName, 'tr') * direction;
            if (sortState.type === 'bags') return (a.bagCount - b.bagCount) * direction;
            
            const dateA = a.lastModified?.seconds ? a.lastModified.seconds : new Date(a.lastModified).getTime() / 1000;
            const dateB = b.lastModified?.seconds ? b.lastModified.seconds : new Date(b.lastModified).getTime() / 1000;
            return (dateB - dateA) * direction;
        });
        
        allElements.itemList.innerHTML = '';
        allElements.emptyItemListMessage.style.display = filteredItems.length === 0 ? 'block' : 'none';
        allElements.emptyItemListMessage.textContent = searchQuery ? `Aramanızla eşleşen sonuç bulunamadı.` : `Henüz bekleyen poşet bulunmuyor.`;
        filteredItems.forEach(item => allElements.itemList.appendChild(createItemElement(item)));
    }
    
    function renderArchive(items) {
        const searchQuery = allElements.searchArchiveInput.value.toLowerCase();
        let filteredItems = items.filter(item => item.customerName.toLowerCase().includes(searchQuery));
        
        filteredItems.sort((a,b) => {
            const dateA = a.deliveredAt?.seconds || 0;
            const dateB = b.deliveredAt?.seconds || 0;
            return dateB - dateA;
        });
        
        allElements.emptyArchiveListMessage.style.display = filteredItems.length === 0 ? 'block' : 'none';

        const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
        if(archiveCurrentPage > totalPages && totalPages > 0) archiveCurrentPage = totalPages;

        const startIndex = (archiveCurrentPage - 1) * itemsPerPage;
        const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

        allElements.archiveList.innerHTML = '';
        paginatedItems.forEach(item => allElements.archiveList.appendChild(createArchiveItemElement(item)));

        renderArchivePagination(totalPages, archiveCurrentPage, (page) => {
            archiveCurrentPage = page;
            renderArchive(items);
        });
    }
    
    function renderNotes() {
        const itemsWithNotes = allItems.filter(item => item.note && item.note.trim() !== '').sort((a,b) => {
            const dateA = a.lastModified?.seconds || 0;
            const dateB = b.lastModified?.seconds || 0;
            return dateB - dateA;
        });
        allElements.notesList.innerHTML = '';
        allElements.emptyNotesMessage.classList.toggle('hidden', itemsWithNotes.length > 0);
        itemsWithNotes.forEach(item => allElements.notesList.appendChild(createNoteElement(item)));
    }
    
    function renderReports() {
        renderPeriodicReport(); 
        renderOverdueReport();
    }
    
    function renderOverdueReport() {
        const overdueList = document.getElementById('overdue-report-list');
        const overdueMessage = document.getElementById('empty-overdue-report-message');
        const activeItems = allItems.filter(item => item.status !== 'delivered');

        if (activeItems.length === 0) {
            overdueList.innerHTML = '';
            overdueMessage.classList.remove('hidden');
            return;
        }
        
        overdueMessage.classList.add('hidden');
        activeItems.sort((a, b) => {
             const dateA = a.lastModified?.seconds || 0;
             const dateB = b.lastModified?.seconds || 0;
             return dateA - dateB;
        });
        const top10 = activeItems.slice(0, 10);

        overdueList.innerHTML = top10.map((item, index) => {
            return `<div class="bg-tertiary p-3 rounded-md flex justify-between items-center">
                        <span class="text-primary">${index + 1}. ${item.customerName}</span>
                        <span class="text-sm text-secondary">${formatRelativeTime(item.lastModified)}</span>
                    </div>`;
        }).join('');
    }
    
    function renderPeriodicReport(range = null) {
        const contentDiv = document.getElementById('periodic-report-content');
        if(range === null) {
            const activeBtn = document.querySelector('.report-range-btn.accent-bg');
            if (activeBtn) range = activeBtn.dataset.range;
            else {
                 contentDiv.innerHTML = 'Raporu görmek için bir zaman aralığı seçin.';
                 return; 
            }
        }
        
        let added, delivered;
        
        if (range === 'all') {
            added = allItems.length;
            delivered = allItems.filter(i => i.status === 'delivered').length;
        } else {
            const rangeNum = parseInt(range, 10);
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - rangeNum);

            added = allItems.filter(i => (i.createdAt?.seconds ? new Date(i.createdAt.seconds * 1000) : new Date(i.createdAt)) >= startDate).length;
            delivered = allItems.filter(i => i.status === 'delivered' && (i.deliveredAt?.seconds ? new Date(i.deliveredAt.seconds * 1000) : new Date(i.deliveredAt)) >= startDate).length;
        }

        contentDiv.innerHTML = `
            <div class="grid grid-cols-2 gap-4 text-center">
                <div>
                    <p class="text-3xl font-bold text-green-400">${added}</p>
                    <p class="text-sm text-secondary">Yeni Poşet Eklendi</p>
                </div>
                <div>
                    <p class="text-3xl font-bold text-blue-400">${delivered}</p>
                    <p class="text-sm text-secondary">Poşet Teslim Edildi</p>
                </div>
            </div>
        `;
    }

    // --- FIRESTORE İŞLEMLERİ ---
    async function handleAddItem(e) {
        e.preventDefault();
        const customerName = allElements.customerNameInput.value.trim();
        const bagCount = parseInt(allElements.bagCountInput.value, 10);
        if (!customerName || isNaN(bagCount) || bagCount < 1) return;

        try {
            const customerExists = allCustomers.some(c => c.name.toLowerCase() === customerName.toLowerCase());
            if (!customerExists) {
                await addDoc(collection(db, 'customers'), { name: customerName });
            }

            await addDoc(collection(db, 'items'), {
                customerName,
                bagCount,
                note: '',
                status: 'active',
                createdAt: serverTimestamp(),
                lastModified: serverTimestamp(),
                deliveredAt: null
            });

            allElements.addItemForm.reset();
            allElements.bagCountInput.value = 1;
            allElements.customerNameInput.focus();

        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Kayıt eklenirken bir hata oluştu.");
        }
    }

    async function updateItem(id, data) {
        const itemRef = doc(db, 'items', id);
        await updateDoc(itemRef, { ...data, lastModified: serverTimestamp() });
    }

    async function deleteItem(id) {
        await deleteDoc(doc(db, 'items', id));
    }
    
    async function deleteCustomer(id) {
        await deleteDoc(doc(db, 'customers', id));
    }
    
    async function importDataFromJSON(data) {
        if (!data.allItems || !data.allCustomers) {
            alert('Geçersiz yedek dosyası formatı.');
            return;
        }

        allElements.loadingText.textContent = 'Veriler siliniyor...';
        
        const itemsBatch = writeBatch(db);
        allItems.forEach(item => itemsBatch.delete(doc(db, 'items', item.id)));
        await itemsBatch.commit();
        
        const customersBatch = writeBatch(db);
        allCustomers.forEach(customer => customersBatch.delete(doc(db, 'customers', customer.id)));
        await customersBatch.commit();

        allElements.loadingText.textContent = 'Veriler içe aktarılıyor...';
        
        const newItemsBatch = writeBatch(db);
        data.allItems.forEach(item => {
            const newItemRef = doc(collection(db, 'items'));
            const cleanItem = { ...item };
            delete cleanItem.id; 
            if (cleanItem.createdAt) cleanItem.createdAt = new Date(cleanItem.createdAt.seconds ? cleanItem.createdAt.seconds * 1000 : cleanItem.createdAt);
            if (cleanItem.lastModified) cleanItem.lastModified = new Date(cleanItem.lastModified.seconds ? cleanItem.lastModified.seconds * 1000 : cleanItem.lastModified);
            if (cleanItem.deliveredAt) cleanItem.deliveredAt = new Date(cleanItem.deliveredAt.seconds ? cleanItem.deliveredAt.seconds * 1000 : cleanItem.deliveredAt);
            newItemsBatch.set(newItemRef, cleanItem);
        });
        await newItemsBatch.commit();

        const newCustomersBatch = writeBatch(db);
        data.allCustomers.forEach(customer => {
            const newCustomerRef = doc(collection(db, 'customers'));
            const cleanCustomer = { ...customer };
            delete cleanCustomer.id;
            newCustomersBatch.set(newCustomerRef, cleanCustomer);
        });
        await newCustomersBatch.commit();

        alert('Veriler başarıyla geri yüklendi.');
    }
    
    async function resetAllData() {
         allElements.loadingText.textContent = 'Tüm veriler siliniyor...';
         allElements.loadingOverlay.style.display = 'flex';
         allElements.loadingOverlay.style.opacity = '1';

        const itemsBatch = writeBatch(db);
        allItems.forEach(item => itemsBatch.delete(doc(db, 'items', item.id)));
        await itemsBatch.commit();
        
        const customersBatch = writeBatch(db);
        allCustomers.forEach(customer => customersBatch.delete(doc(db, 'customers', customer.id)));
        await customersBatch.commit();
        
        allElements.loadingOverlay.style.opacity = '0';
        setTimeout(() => { allElements.loadingOverlay.style.display = 'none'; }, 300);
    }

    // --- UYGULAMA BAŞLATMA VE VERİ DİNLEME ---
    function startFirebaseConnection() {
        clearTimeout(connectionTimeout);
        connectionTimeout = setTimeout(() => {
            showConnectionError('Bağlantı zaman aşımına uğradı. İnternetinizi kontrol edin.');
        }, 10000); 

        try {
            onAuthStateChanged(auth, user => {
                clearTimeout(connectionTimeout);
                if (user) {
                    // KULLANICI GİRİŞ YAPTIĞINDA HEMEN ARAYÜZÜ GÖSTER
                    showApp();
                    listenToData();
                } else {
                    signInAnonymously(auth).catch(error => {
                        console.error("Anonymous sign-in failed: ", error);
                        showConnectionError('Veritabanı ile kimlik doğrulaması yapılamadı.');
                    });
                }
            });
        } catch(e) {
            clearTimeout(connectionTimeout);
            console.error("Firebase initialization error:", e);
            showConnectionError('Uygulama başlatılamadı. Yapılandırmayı kontrol edin.');
        }
    }

    function initialize() {
        settings = getSettingsFromStorage();
        applySettings(settings);
        updateSortButtons(sortState);
        switchTab('list', true);
        allElements.retryButton.addEventListener('click', () => {
            allElements.loadingText.textContent = 'Veritabanına bağlanılıyor...';
            allElements.loadingSpinner.style.display = 'block';
            allElements.retryContainer.classList.add('hidden');
            startFirebaseConnection();
        });
        startFirebaseConnection();
    }

    function listenToData() {
        if (itemsUnsubscribe) itemsUnsubscribe();
        if (customersUnsubscribe) customersUnsubscribe();

        const itemsQuery = query(collection(db, "items"));
        itemsUnsubscribe = onSnapshot(itemsQuery, (snapshot) => {
            allItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // VERİ GELDİĞİNDE SADECE RENDER ET, ARAYÜZ ZATEN GÖRÜNÜR DURUMDA
            renderAll();
        }, error => {
            console.error("Error listening to items: ", error);
            showConnectionError('Veri alınırken bir hata oluştu.');
        });

        const customersQuery = query(collection(db, "customers"));
        customersUnsubscribe = onSnapshot(customersQuery, (snapshot) => {
            allCustomers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const modalList = document.getElementById('modal-customers-list');
            if (modalList && !allElements.modalContainer.classList.contains('hidden')) {
                const searchInput = document.getElementById('modal-customer-search');
                renderCustomerModalList(searchInput?.value || '');
            }
        }, error => console.error("Error listening to customers: ", error));
    }
    
    // --- EVENT LISTENERS ---
    allElements.addItemForm.addEventListener('submit', handleAddItem);
    
    allElements.searchItemsInput.addEventListener('input', () => renderItems(allItems.filter(item => item.status !== 'delivered')));
    allElements.searchArchiveInput.addEventListener('input', () => {
        archiveCurrentPage = 1;
        renderArchive(allItems.filter(item => item.status === 'delivered'));
    });
    
    function handleSort(type) {
        if (sortState.type === type) {
            sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
        } else {
            sortState.type = type;
            sortState.direction = (type === 'bags' || type === 'date') ? 'desc' : 'asc';
        }
        updateSortButtons(sortState);
        renderItems(allItems.filter(item => item.status !== 'delivered'));
    }

    allElements.sortAlphaBtn.addEventListener('click', () => handleSort('alpha'));
    allElements.sortBagsBtn.addEventListener('click', () => handleSort('bags'));
    allElements.sortDateBtn.addEventListener('click', () => handleSort('date'));

    allElements.mainContent.addEventListener('click', async (e) => {
        const button = e.target.closest('button[data-action]');
        if (!button) return;

        const itemDiv = button.closest('div[data-id]');
        if (!itemDiv) return;
        
        const id = itemDiv.dataset.id;
        const action = button.dataset.action;
        const item = allItems.find(i => i.id === id);
        if (!item) return;

        switch(action) {
            case 'deliver':
                showConfirmationModal(
                    `'${item.customerName}' adlı müşterinin poşetini teslim etmek istediğinizden emin misiniz?`,
                    () => updateItem(id, { status: 'delivered', deliveredAt: serverTimestamp() })
                );
                break;
            case 'restore':
                showConfirmationModal(
                    `'${item.customerName}' adlı kaydı bekleyenler listesine geri yüklemek istiyor musunuz?`,
                    () => updateItem(id, { status: 'active', deliveredAt: null }),
                    "Geri Yükle"
                );
                break;
            case 'delete-permanent':
                showConfirmationModal(
                    `'${item.customerName}' adlı kayıt kalıcı olarak silinecektir. Bu işlem geri alınamaz. Emin misiniz?`,
                    () => deleteItem(id),
                    "Kalıcı Olarak Sil", true
                );
                break;
            case 'edit-count': {
                const result = await showInputModal("Poşet Sayısını Düzenle", `'${item.customerName}' için yeni poşet sayısını girin:`, 'number', item.bagCount);
                if (result.confirmed && result.value && !isNaN(result.value) && result.value > 0) {
                    updateItem(id, { bagCount: parseInt(result.value, 10) });
                }
                break;
            }
            case 'edit-note': {
                const result = await showInputModal("Notu Düzenle", `'${item.customerName}' için not:`, 'textarea', item.note || '');
                if (result.confirmed) {
                   updateItem(id, { note: result.value.trim() });
                }
                break;
            }
             case 'delete-note-from-tab':
                showConfirmationModal(
                    `'${item.customerName}' adlı kaydın notunu silmek istediğinizden emin misiniz?`,
                    () => updateItem(id, { note: '' }),
                    "Notu Sil", true
                );
                break;
        }
    });
    
    document.querySelector('#panel-settings').addEventListener('click', async (e) => {
         const themeBtn = e.target.closest('.theme-btn');
         if(themeBtn) {
             const newSettings = {...settings, theme: themeBtn.dataset.theme};
             saveSettingsToStorage(newSettings);
             applySettings(newSettings);
             return;
         }
         
         const targetId = e.target.id;
         switch(targetId) {
            case 'manage-customers-btn':
                showCustomerManagementModal();
                break;
            case 'export-json-btn':
                exportDataToJSON();
                break;
            case 'import-json-btn':
                allElements.importFileInput.click();
                break;
            case 'export-pdf-btn':
                exportToPDF(allItems.filter(item => item.status !== 'delivered'));
                break;
            case 'export-csv-btn':
                exportToCSV(allItems.filter(item => item.status !== 'delivered'));
                break;
            case 'reset-items-btn':
                showConfirmationModal(
                    "Tüm bekleyen ve teslim edilen poşet kayıtlarını kalıcı olarak silmek istediğinizden emin misiniz? Müşteri listesi etkilenmeyecektir. Bu işlem geri alınamaz.",
                    async () => {
                        allElements.loadingText.textContent = 'Poşetler siliniyor...';
                        allElements.loadingOverlay.style.display = 'flex';
                        const batch = writeBatch(db);
                        allItems.forEach(item => batch.delete(doc(db, 'items', item.id)));
                        await batch.commit();
                        allElements.loadingOverlay.style.display = 'none';
                    }, "Evet, Sil", true
                );
                break;
            case 'reset-all-btn':
                showConfirmationModal(
                    "Uygulamadaki TÜM poşet ve müşteri verilerini kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
                    resetAllData, "EVET, TÜMÜNÜ SİL", true
                );
                break;
         }
    });
    
    allElements.importFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = JSON.parse(event.target.result);
                await showConfirmationModal(
                    "Mevcut tüm verileriniz bu yedeklemedeki verilerle değiştirilecektir. Bu işlem geri alınamaz. Emin misiniz?",
                    async () => {
                        allElements.loadingOverlay.style.display = 'flex';
                        await importDataFromJSON(data);
                        allElements.loadingOverlay.style.display = 'none';
                    }, "Onayla ve Yükle"
                );
            } catch (error) {
                console.error("Import error:", error);
                alert('Yedek dosyası okunurken hata oluştu.');
            }
        };
        reader.readAsText(file);
        e.target.value = null;
    });
    
    document.getElementById('font-size-slider')?.addEventListener('input', (e) => {
        const newSettings = {...settings, fontSize: e.target.value};
        applySettings(newSettings);
        // Only save to storage on 'change' event to avoid performance issues
    });
    document.getElementById('font-size-slider')?.addEventListener('change', (e) => {
        const newSettings = {...settings, fontSize: e.target.value};
        saveSettingsToStorage(newSettings);
    });
    
    document.querySelectorAll('.report-range-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.report-range-btn').forEach(b => b.classList.remove('accent-bg'));
            btn.classList.add('accent-bg');
            renderPeriodicReport(btn.dataset.range);
        });
    });

    document.querySelector('nav').addEventListener('click', (e) => {
        if (e.target.id && e.target.id.startsWith('tab-')) {
            switchTab(e.target.id.replace('tab-', ''));
        }
    });

    allElements.customerNameInput.addEventListener("input", () => {
        const searchTerm = allElements.customerNameInput.value.trim().toLowerCase();
        allElements.suggestionsBox.innerHTML = "";
        if (searchTerm.length === 0) {
            allElements.suggestionsBox.classList.add("hidden");
            return;
        }

        const filtered = allCustomers
            .filter(c => c.name.toLowerCase().includes(searchTerm))
            .map(c => c.name);

        if (filtered.length > 0) {
            filtered.forEach(name => {
                const div = document.createElement("div");
                div.textContent = name;
                div.className = "p-3 hover:bg-slate-600 cursor-pointer text-primary";
                div.addEventListener("click", () => {
                    allElements.customerNameInput.value = name;
                    allElements.suggestionsBox.classList.add("hidden");
                    allElements.bagCountInput.focus();
                });
                allElements.suggestionsBox.appendChild(div);
            });
            allElements.suggestionsBox.classList.remove("hidden");
        } else {
            allElements.suggestionsBox.classList.add("hidden");
        }
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest('.relative')) {
            allElements.suggestionsBox.classList.add("hidden");
        }
    });
    
    function renderCustomerModalList(filter = '') {
        const listContainer = document.getElementById('modal-customers-list');
        if (!listContainer) return;
        listContainer.innerHTML = '';
        const filtered = allCustomers
            .filter(c => c.name.toLowerCase().includes(filter.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name, 'tr'));

        if(filtered.length === 0) {
            listContainer.innerHTML = '<p class="text-center text-secondary">Müşteri bulunamadı.</p>';
            return;
        }

        filtered.forEach(customer => {
            const div = document.createElement('div');
            div.className = 'flex justify-between items-center p-2 bg-tertiary/50 rounded-md';
            div.innerHTML = `
                <span class="text-primary text-sm">${customer.name}</span>
                <button data-cust-id="${customer.id}" class="p-1 text-secondary hover:text-red-500 rounded-full transition" title="Müşteriyi Sil"><svg class="pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3V2h11v1z"/></svg></button>`;
            listContainer.appendChild(div);
        });
    }
    
    async function showCustomerManagementModal() {
         showModal(`
            <div class="flex flex-col h-[70vh]">
                <h3 class="text-xl font-semibold mb-4 text-primary">Müşteri Listesi</h3>
                <form id="modal-add-customer-form" class="flex gap-2 mb-4">
                    <input type="text" id="modal-new-customer-name" placeholder="Yeni Müşteri Ekle" class="flex-grow p-2 bg-secondary border border-dynamic text-primary rounded-lg focus:ring-2 ring-accent transition" required>
                    <button type="submit" class="accent-bg text-white font-semibold px-4 rounded-lg accent-bg-hover transition">Ekle</button>
                </form>
                <input type="search" id="modal-customer-search" placeholder="Müşteri ara..." class="w-full p-2 mb-4 bg-secondary border border-dynamic rounded-lg focus:ring-2 ring-accent transition">
                <div id="modal-customers-list" class="flex-grow overflow-y-auto space-y-2 pr-2"></div>
                <div class="flex justify-end gap-3 mt-4">
                    <button id="modal-close" class="bg-tertiary px-4 py-2 rounded-lg hover:bg-slate-500 transition">Kapat</button>
                </div>
            </div>
        `);

        await new Promise(resolve => setTimeout(resolve, 0));
        
        const listContainer = document.getElementById('modal-customers-list');
        const searchInput = document.getElementById('modal-customer-search');
        const addForm = document.getElementById('modal-add-customer-form');
        const addInput = document.getElementById('modal-new-customer-name');

        searchInput.addEventListener('input', () => renderCustomerModalList(searchInput.value));
        
        listContainer.addEventListener('click', async e => {
            const deleteBtn = e.target.closest('button[data-cust-id]');
            if (deleteBtn) {
                const customerId = deleteBtn.dataset.custId;
                const customer = allCustomers.find(c => c.id === customerId);
                if (customer) {
                    showConfirmationModal(
                        `'${customer.name}' adlı müşteriyi silmek istediğinizden emin misiniz? Bu işlem, müşteriye ait poşet kayıtlarını etkilemez.`,
                        () => deleteCustomer(customerId), "Evet, Sil", true
                    );
                }
            }
        });
        
        addForm.addEventListener('submit', async e => {
            e.preventDefault();
            const name = addInput.value.trim();
            if(name && !allCustomers.some(c => c.name.toLowerCase() === name.toLowerCase())) {
               await addDoc(collection(db, 'customers'), { name });
               addInput.value = '';
            } else if (name) {
               alert('Bu müşteri zaten mevcut.');
            }
        });
        
        renderCustomerModalList();
    }
    
    function exportDataToJSON() {
        const data = { allItems, allCustomers, settings };
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `poset-takip-yedek-${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // --- UYGULAMAYI BAŞLAT ---
    initialize();
});
