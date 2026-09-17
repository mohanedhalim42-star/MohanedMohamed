/**
 * ==========================================================================
 * DAR ELSALAM STORE - Admin Dashboard Logic (Pure Vanilla JavaScript)
 * Synchronizes with localStorage and provides complete catalog management.
 * ==========================================================================
 */

'use strict';

const STORAGE_KEYS = {
  PRODUCTS: "dar_elsalam_products_v1",
  OFFER: "dar_elsalam_offer_v1",
  ORDERS: "dar_elsalam_orders_v1",
  ADMIN_PIN: "dar_elsalam_admin_pin"
};

const DEFAULT_PIN = "1234";

// Initial sample data if reset is triggered
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "صيانة شاشات وباغات OLED وتغيير بطاريات أصلية",
    category: "صيانة",
    image: "images/products/phone-repair.svg",
    price: "450",
    oldPrice: "600",
    description: "خدمة صيانة فورية متخصصة في تغيير باغات وشاشات الهواتف الذكية (iPhone / Samsung / Xiaomi) بأحدث ماكينات الليزر وغرف خالية من الأتربة مع ضمان معتمد.",
    features: [
      "فحص مجاني شامل قبل وبعد الإصلاح",
      "قطع غيار أصلية 100% مع ضمان رسمي",
      "استلام وتسليم فوري خلال أقل من 60 دقيقة",
      "معالجة متقدمة لخلل اللمس والألوان"
    ],
    available: true
  },
  {
    id: 2,
    name: "سماعات AirPods Pro الجيل الثاني (عزل ضوضاء ANC)",
    category: "سماعات",
    image: "images/products/airpods-pro.svg",
    price: "699",
    oldPrice: "950",
    description: "أقوى تجربة صوتية نقية مع تقنية العزل النشط للضوضاء ANC وميزة الصوت المكاني المحيطي Spatial Audio، بالإضافة إلى ميكروفون مدمج عالي الوضوح للمكالمات.",
    features: [
      "عزل ضوضاء حقيقي ANC ووضع الشفافية",
      "بطارية تدوم حتى 30 ساعة مع علبة الشحن",
      "مقاومة للماء والعرق بمعيار IPX4",
      "شحن لاسلكي وشحن عبر منفذ Type-C"
    ],
    available: true
  },
  {
    id: 3,
    name: "ساعة ذكية Smart Watch Ultra شاشة AMOLED فائقة الوضوح",
    category: "ساعات ذكية",
    image: "images/products/smart-watch.svg",
    price: "850",
    oldPrice: "1200",
    description: "ساعة الترا الذكية بهيكل تيتانيوم صلب وشاشة AMOLED كاملة مقاومة للخدش. تدعم استقبال المكالمات الهاتفية، وقراءة إشعارات جميع التطبيقات وقياس المؤشرات الصحية.",
    features: [
      "إجراء واستقبال المكالمات بصوت واضح عبر البلوتوث",
      "مستشعرات قياس نبضات القلب ونسبة الأكسجين والنوم",
      "أكثر من 100 نمط رياضي وخلفيات متعددة",
      "متوافقة مع هواتف iPhone وAndroid"
    ],
    available: true
  },
  {
    id: 4,
    name: "شاحن سريع 65W GaN ثلاثي المنافذ + كابل Type-C مضفر",
    category: "إلكترونيات",
    image: "images/products/charger-cable.svg",
    price: "390",
    oldPrice: "520",
    description: "شاحن جداري بتقنية نيتريد الغاليوم GaN فائقة السرعة، يتيح شحن اللابتوب والموبايل والساعة في نفس الوقت بأقصى سرعة وأمان تام ضد السخونة والجهد الزائد.",
    features: [
      "يدعم بروتوكولات الشحن السريع PD 3.0 وQC 4.0",
      "منفذين Type-C فائقين ومنفذ USB-A سريع",
      "نظام حماية ذكي متعدد الطبقات ضد التذبذب",
      "مرفق كابل قوي معتمد مقاوم للقطع بطول 1.2 متر"
    ],
    available: true
  },
  {
    id: 5,
    name: "باور بنك 20,000mAh شحن فائق السرعة 22.5W مع شاشة رقمية",
    category: "إلكترونيات",
    image: "images/products/powerbank.svg",
    price: "550",
    oldPrice: "750",
    description: "بنك طاقة متطور بسعة ضخمة 20000 ملي أمبير وشاشة رقمية LED تعرض النسبة المئوية بدقة. يشحن الهاتف حتى 4 إلى 5 مرات بسرعة فائقة أينما كنت.",
    features: [
      "سعة عملاقة 20,000 مللي أمبير معتمدة",
      "يدعم الشحن فائق السرعة بقدرة 22.5 واط",
      "شاشة LED رقمية توضح النسبة المتبقية بدقة",
      "منافذ متعددة لشحن 3 أجهزة في آن واحد"
    ],
    available: true
  },
  {
    id: 6,
    name: "جراب ماج سيف مدرع ضد الصدمات مع حماية الكاميرا",
    category: "إكسسوارات",
    image: "images/products/case-accessories.svg",
    price: "180",
    oldPrice: "260",
    description: "جراب حماية بتصميم هجين متين مع مغناطيس ماج سيف فائق القوة، حواف بارزة لحماية الشاشة وعدسات الكاميرا من أعتى الصدمات والسقوط المفاجئ.",
    features: [
      "حلقات مغناطيسية متوافقة تماماً مع MagSafe",
      "وسائد هوائية Airbag مدمجة بالأركان الأربعة",
      "مقاومة لاصفرار المادة مع مرور الوقت",
      "متوفر لمختلف موديلات آيفون وسامسونج"
    ],
    available: true
  }
];

// App State
let productsList = [];
let base64ImageBuffer = "";

/* ==========================================================================
   1. PIN AUTHENTICATION
   ========================================================================== */
const pinScreen = document.getElementById('pinScreen');
const dashboardApp = document.getElementById('dashboardApp');
const pinForm = document.getElementById('pinForm');
const pinInput = document.getElementById('pinInput');
const pinError = document.getElementById('pinError');
const btnLogout = document.getElementById('btnLogout');

function checkAuth() {
  if (sessionStorage.getItem('dar_admin_auth') === 'true') {
    pinScreen.style.display = 'none';
    dashboardApp.style.display = 'flex';
    initDashboard();
  } else {
    pinScreen.style.display = 'flex';
    dashboardApp.style.display = 'none';
    pinInput.focus();
  }
}

pinForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const entered = pinInput.value.trim();
  const validPin = localStorage.getItem(STORAGE_KEYS.ADMIN_PIN) || DEFAULT_PIN;

  if (entered === validPin) {
    sessionStorage.setItem('dar_admin_auth', 'true');
    pinError.style.display = 'none';
    checkAuth();
  } else {
    pinError.style.display = 'block';
    pinInput.value = '';
    pinInput.focus();
  }
});

btnLogout.addEventListener('click', () => {
  sessionStorage.removeItem('dar_admin_auth');
  checkAuth();
});

/* ==========================================================================
   2. TAB NAVIGATION
   ========================================================================== */
const navButtons = document.querySelectorAll('.admin-nav-btn');
const tabSections = document.querySelectorAll('.tab-section');

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    navButtons.forEach(b => b.classList.remove('active'));
    tabSections.forEach(s => s.style.display = 'none');

    btn.classList.add('active');
    const targetTabId = btn.getAttribute('data-tab');
    const targetSection = document.getElementById(targetTabId);
    if (targetSection) targetSection.style.display = 'block';

    if (targetTabId === 'offersTab') loadOfferForm();
    if (targetTabId === 'ordersTab') loadOrdersTable();
  });
});

/* ==========================================================================
   3. PRODUCTS CRUD
   ========================================================================== */
const productsTableBody = document.getElementById('adminProductsTableBody');
const productsCountSpan = document.getElementById('productsCount');
const filterAdminCategory = document.getElementById('filterAdminCategory');
const btnAddNewProduct = document.getElementById('btnAddNewProduct');
const productEditorModal = document.getElementById('productEditorModal');
const btnCloseEditor = document.getElementById('btnCloseEditor');
const btnCancelEdit = document.getElementById('btnCancelEdit');
const productForm = document.getElementById('productForm');

// Form elements
const editProductId = document.getElementById('editProductId');
const prodNameInput = document.getElementById('prodNameInput');
const prodCategoryInput = document.getElementById('prodCategoryInput');
const prodAvailableCheckbox = document.getElementById('prodAvailableCheckbox');
const prodPriceInput = document.getElementById('prodPriceInput');
const prodOldPriceInput = document.getElementById('prodOldPriceInput');
const prodDescInput = document.getElementById('prodDescInput');
const prodFeaturesInput = document.getElementById('prodFeaturesInput');
const prodImageInput = document.getElementById('prodImageInput');
const prodImageFileInput = document.getElementById('prodImageFileInput');
const fileNameDisplay = document.getElementById('fileNameDisplay');
const modalEditorTitle = document.getElementById('modalEditorTitle');

/**
 * Load products from localStorage
 */
function loadProducts() {
  const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!raw) {
    productsList = [...DEFAULT_PRODUCTS];
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(productsList));
  } else {
    try {
      productsList = JSON.parse(raw);
    } catch {
      productsList = [...DEFAULT_PRODUCTS];
    }
  }
  renderProductsTable();
}

/**
 * Save products to localStorage
 */
function saveProducts() {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(productsList));
  renderProductsTable();
  if (window.darSyncProductsToFirestore) {
    window.darSyncProductsToFirestore(productsList);
  }
}

/**
 * Render products table
 */
function renderProductsTable() {
  const selectedCat = filterAdminCategory.value;
  const filtered = productsList.filter(p => selectedCat === 'all' || p.category === selectedCat);

  productsCountSpan.textContent = filtered.length;

  if (filtered.length === 0) {
    productsTableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 40px;">
          لا توجد منتجات مطابقة في هذا التصنيف.
        </td>
      </tr>
    `;
    return;
  }

  productsTableBody.innerHTML = filtered.map(p => `
    <tr>
      <td>
        <img src="${p.image || 'images/products/phone-repair.svg'}" alt="${p.name}" class="table-thumb" onerror="this.src='images/products/phone-repair.svg'">
      </td>
      <td><strong>${escapeHTML(p.name)}</strong></td>
      <td><span style="color: var(--admin-cyan); font-weight: 600;">${escapeHTML(p.category || '')}</span></td>
      <td><strong>${p.price || 0} ج.م</strong></td>
      <td>${p.oldPrice ? `<span style="color: var(--text-muted); text-decoration: line-through;">${p.oldPrice} ج.م</span>` : '-'}</td>
      <td>
        <span class="status-badge ${p.available !== false ? 'in-stock' : 'out-of-stock'}">
          ${p.available !== false ? 'متوفر' : 'غير متوفر'}
        </span>
      </td>
      <td style="text-align: center;">
        <div class="table-actions" style="justify-content: center;">
          <button class="btn btn-secondary btn-icon" onclick="openEditModal(${p.id})">✏️ تعديل</button>
          <button class="btn btn-danger btn-icon" onclick="deleteProduct(${p.id})">🗑️ حذف</button>
        </div>
      </td>
    </tr>
  `).join('');
}

filterAdminCategory.addEventListener('change', renderProductsTable);

/**
 * Open Modal to Add New Product
 */
btnAddNewProduct.addEventListener('click', () => {
  modalEditorTitle.textContent = 'إضافة منتج جديد';
  productForm.reset();
  editProductId.value = '';
  base64ImageBuffer = '';
  fileNameDisplay.textContent = '';
  prodAvailableCheckbox.checked = true;
  productEditorModal.classList.add('open');
});

/**
 * Open Modal to Edit Product
 */
window.openEditModal = function(id) {
  const p = productsList.find(item => item.id === id);
  if (!p) return;

  modalEditorTitle.textContent = 'تعديل بيانات المنتج';
  editProductId.value = p.id;
  prodNameInput.value = p.name || '';
  prodCategoryInput.value = p.category || 'صيانة';
  prodAvailableCheckbox.checked = p.available !== false;
  prodPriceInput.value = p.price || '';
  prodOldPriceInput.value = p.oldPrice || '';
  prodDescInput.value = p.description || '';
  prodFeaturesInput.value = Array.isArray(p.features) ? p.features.join('\n') : '';
  prodImageInput.value = p.image || '';
  base64ImageBuffer = '';
  fileNameDisplay.textContent = '';

  productEditorModal.classList.add('open');
};

/**
 * Delete Product
 */
window.deleteProduct = function(id) {
  const p = productsList.find(item => item.id === id);
  if (!p) return;

  if (confirm(`هل أنت متأكد من حذف المنتج:\n"${p.name}"؟`)) {
    productsList = productsList.filter(item => item.id !== id);
    saveProducts();
    if (window.darDeleteProductFromFirestore) {
      window.darDeleteProductFromFirestore(id);
    }
    alert('تم حذف المنتج بنجاح.');
  }
};

/**
 * File upload to Base64
 */
prodImageFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    alert('حجم الصورة كبير جداً، يفضل اختيار صورة أقل من 2 ميجابايت.');
    return;
  }

  fileNameDisplay.textContent = `جاري تجهيز: ${file.name}`;
  const reader = new FileReader();
  reader.onload = function(event) {
    base64ImageBuffer = event.target.result;
    prodImageInput.value = base64ImageBuffer;
    fileNameDisplay.textContent = `✓ تم تجهيز: ${file.name}`;
  };
  reader.readAsDataURL(file);
});

/**
 * Submit Product Form (Add or Update)
 */
productForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const id = editProductId.value ? parseInt(editProductId.value, 10) : null;
  const name = prodNameInput.value.trim();
  const category = prodCategoryInput.value;
  const available = prodAvailableCheckbox.checked;
  const price = prodPriceInput.value.trim();
  const oldPrice = prodOldPriceInput.value.trim();
  const description = prodDescInput.value.trim();
  const features = prodFeaturesInput.value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  const image = prodImageInput.value.trim() || 'images/products/phone-repair.svg';

  if (!name || !price) {
    alert('من فضلك أكمل الحقول المطلوبة (الاسم والسعر).');
    return;
  }

  if (id) {
    // Update existing product
    const index = productsList.findIndex(p => p.id === id);
    if (index !== -1) {
      productsList[index] = {
        ...productsList[index],
        name,
        category,
        available,
        price,
        oldPrice,
        description,
        features,
        image
      };
    }
  } else {
    // Add new product
    const newProduct = {
      id: Date.now(),
      name,
      category,
      available,
      price,
      oldPrice,
      description,
      features,
      image
    };
    productsList.unshift(newProduct);
  }

  saveProducts();
  closeEditorModal();
  alert('تم حفظ المنتج بنجاح!');
});

function closeEditorModal() {
  productEditorModal.classList.remove('open');
}
btnCloseEditor.addEventListener('click', closeEditorModal);
btnCancelEdit.addEventListener('click', closeEditorModal);

/* ==========================================================================
   4. OFFERS MANAGEMENT
   ========================================================================== */
const offerConfigForm = document.getElementById('offerConfigForm');
const offerEnabledCheckbox = document.getElementById('offerEnabledCheckbox');
const offerTitleInput = document.getElementById('offerTitleInput');
const offerDescInput = document.getElementById('offerDescInput');
const offerNewPriceInput = document.getElementById('offerNewPriceInput');
const offerOldPriceInput = document.getElementById('offerOldPriceInput');
const offerDiscountBadgeInput = document.getElementById('offerDiscountBadgeInput');
const offerExpiryInput = document.getElementById('offerExpiryInput');
const offerImageInput = document.getElementById('offerImageInput');

function loadOfferForm() {
  const raw = localStorage.getItem(STORAGE_KEYS.OFFER);
  let offer = null;
  if (raw) {
    try { offer = JSON.parse(raw); } catch {}
  }
  if (!offer) {
    const target = new Date();
    target.setDate(target.getDate() + 5);
    offer = {
      enabled: true,
      title: "باقة الافتتاح الكبرى: ساعة ذكية Ultra + AirPods Pro + شاحن 65W",
      description: "احصل على أقوى مجموعة تكنولوجية متكاملة بسعر الافتتاح الاستثنائي! وفر أكثر من 35% مع ضمان حقيقي وشحن فوري لجميع المحافظات.",
      newPrice: "1250",
      oldPrice: "1950",
      discountBadge: "وفر 700 ج.م (36%-)",
      image: "images/offers/launch-offer.svg",
      expiresAt: target.toISOString()
    };
  }

  offerEnabledCheckbox.checked = offer.enabled !== false;
  offerTitleInput.value = offer.title || '';
  offerDescInput.value = offer.description || '';
  offerNewPriceInput.value = offer.newPrice || '';
  offerOldPriceInput.value = offer.oldPrice || '';
  offerDiscountBadgeInput.value = offer.discountBadge || '';
  offerImageInput.value = offer.image || '';

  // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
  if (offer.expiresAt) {
    const d = new Date(offer.expiresAt);
    const pad = (n) => String(n).padStart(2, '0');
    const localIso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    offerExpiryInput.value = localIso;
  }
}

offerConfigForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const expiryVal = offerExpiryInput.value;
  const expiryDate = expiryVal ? new Date(expiryVal).toISOString() : new Date().toISOString();

  const offerData = {
    enabled: offerEnabledCheckbox.checked,
    title: offerTitleInput.value.trim(),
    description: offerDescInput.value.trim(),
    newPrice: offerNewPriceInput.value.trim(),
    oldPrice: offerOldPriceInput.value.trim(),
    discountBadge: offerDiscountBadgeInput.value.trim(),
    image: offerImageInput.value.trim() || 'images/offers/launch-offer.svg',
    expiresAt: expiryDate
  };

  localStorage.setItem(STORAGE_KEYS.OFFER, JSON.stringify(offerData));
  if (window.darSyncOfferToFirestore) {
    window.darSyncOfferToFirestore(offerData);
  }
  alert('تم تحديث إعدادات عرض الافتتاح بنجاح! التغييرات ستظهر فوراً في واجهة المتجر.');
});

/* ==========================================================================
   5. ORDERS LOG
   ========================================================================== */
const ordersTableBody = document.getElementById('ordersTableBody');
const btnClearOrders = document.getElementById('btnClearOrders');

function loadOrdersTable() {
  const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
  let orders = [];
  if (raw) {
    try { orders = JSON.parse(raw); } catch {}
  }

  if (orders.length === 0) {
    ordersTableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px;">
          لا توجد طلبات مسجلة في الموقع حتى الآن.
        </td>
      </tr>
    `;
    return;
  }

  ordersTableBody.innerHTML = orders.map(o => `
    <tr>
      <td><code>${escapeHTML(o.id || '')}</code></td>
      <td>${o.createdAt ? new Date(o.createdAt).toLocaleString('ar-EG') : '-'}</td>
      <td><strong>${escapeHTML(o.fullName || '')}</strong></td>
      <td><a href="tel:${o.phone}" style="color: var(--admin-cyan);">${escapeHTML(o.phone || '')}</a></td>
      <td>${escapeHTML(o.governorate || '')}</td>
      <td><strong>${escapeHTML(o.product || '')}</strong> (الكمية: ${o.quantity || 1})</td>
      <td><small>${escapeHTML(o.address || '')} | ${escapeHTML(o.notes || '')}</small></td>
    </tr>
  `).join('');
}

btnClearOrders.addEventListener('click', () => {
  if (confirm('هل تريد مسح سجل الطلبات المسجلة محلياً؟')) {
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    loadOrdersTable();
  }
});

/* ==========================================================================
   6. SETTINGS & PIN MANAGEMENT
   ========================================================================== */
const newPinInput = document.getElementById('newPinInput');
const btnSavePin = document.getElementById('btnSavePin');
const btnResetDefaults = document.getElementById('btnResetDefaults');

btnSavePin.addEventListener('click', () => {
  const val = newPinInput.value.trim();
  if (val.length < 4) {
    alert('يجب أن يتكون الرمز من 4 خانات على الأقل.');
    return;
  }
  localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, val);
  alert('تم تغيير رمز المرور بنجاح! احتفظ به في مكان آمن.');
  newPinInput.value = '';
});

btnResetDefaults.addEventListener('click', () => {
  if (confirm('تنبيه: سيتم مسح كافة التعديلات واستعادة المنتجات الافتراضية وعرض الافتتاح الأصلي. هل تريد المتابعة؟')) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    localStorage.removeItem(STORAGE_KEYS.OFFER);
    loadProducts();
    alert('تمت استعادة البيانات الافتراضية بنجاح!');
  }
});

/* ==========================================================================
   7. UTILITIES
   ========================================================================== */
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

window.loadOrdersTable = loadOrdersTable;

// Initial setup
function initDashboard() {
  loadProducts();
}

// Check auth state on boot
checkAuth();
