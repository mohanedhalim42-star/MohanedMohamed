/**
 * ==========================================================================
 * DAR ELSALAM STORE - Admin Dashboard Logic (Pure Vanilla JavaScript)
 * Firebase Firestore is the PRIMARY data store.
 * localStorage is used only as a cache / offline fallback.
 * ==========================================================================
 */

'use strict';

const STORAGE_KEYS = {
  PRODUCTS: "dar_elsalam_products_v1",
  OFFER: "dar_elsalam_offer_v1",
  ORDERS: "dar_elsalam_orders_v1",
  SHIPPING_RATES: "dar_elsalam_shipping_rates_v1",
  ADMIN_PIN: "dar_elsalam_admin_pin"
};

const DEFAULT_PIN = "mmmnnn";

// Standard Shipping Rates Presets for all 27 Egyptian Governorates
const DEFAULT_SHIPPING_RATES = {
  "الإسكندرية": 40,
  "القاهرة": 60,
  "الجيزة": 60,
  "القليوبية": 60,
  "البحيرة": 65,
  "الغربية": 65,
  "المنوفية": 65,
  "الدقهلية": 65,
  "كفر الشيخ": 65,
  "الشرقية": 65,
  "دمياط": 70,
  "بورسعيد": 70,
  "الإسماعيلية": 70,
  "السويس": 70,
  "الفيوم": 75,
  "بني سويف": 75,
  "المنيا": 80,
  "أسيوط": 85,
  "سوهاج": 90,
  "قنا": 90,
  "الأقصر": 95,
  "أسوان": 95,
  "مطروح": 75,
  "البحر الأحمر": 95,
  "الوادي الجديد": 100,
  "شمال سيناء": 90,
  "جنوب سيناء": 95
};

// Region metadata for governorates
const GOVERNORATE_REGIONS = {
  "الإسكندرية": "المقر الرئيسي (محلي)",
  "القاهرة": "القاهرة الكبرى",
  "الجيزة": "القاهرة الكبرى",
  "القليوبية": "القاهرة الكبرى",
  "البحيرة": "محافظات الدلتا",
  "الغربية": "محافظات الدلتا",
  "المنوفية": "محافظات الدلتا",
  "الدقهلية": "محافظات الدلتا",
  "كفر الشيخ": "محافظات الدلتا",
  "الشرقية": "محافظات الدلتا",
  "دمياط": "مدن القناة",
  "بورسعيد": "مدن القناة",
  "الإسماعيلية": "مدن القناة",
  "السويس": "مدن القناة",
  "الفيوم": "صعيد مصر",
  "بني سويف": "صعيد مصر",
  "المنيا": "صعيد مصر",
  "أسيوط": "صعيد مصر",
  "سوهاج": "صعيد مصر",
  "قنا": "صعيد مصر",
  "الأقصر": "صعيد مصر",
  "أسوان": "صعيد مصر",
  "مطروح": "محافظات حدودية",
  "البحر الأحمر": "محافظات حدودية",
  "الوادي الجديد": "محافظات حدودية",
  "شمال سيناء": "محافظات حدودية",
  "جنوب سيناء": "محافظات حدودية"
};

// Always clear any previously stored PIN so that DEFAULT_PIN is always authoritative
try {
  localStorage.removeItem(STORAGE_KEYS.ADMIN_PIN);
} catch { /* ignore */ }


// Initial sample data used only when Firestore is empty
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
  // Always compare against DEFAULT_PIN — localStorage is NOT used for authentication
  if (entered === DEFAULT_PIN) {
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

    if (targetTabId === 'offersTab') loadOffersTable();
    if (targetTabId === 'ordersTab') loadOrdersTable();
    if (targetTabId === 'shippingTab') loadShippingRates();
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
 * Load products – prefers Firestore via the hook provided by admin.html.
 * Falls back to localStorage cache, then DEFAULT_PRODUCTS.
 */
function loadProducts() {
  // If Firestore hook already provided products, use them; otherwise render empty / waiting state
  if (productsList.length === 0 && Array.isArray(window._adminPendingProducts)) {
    productsList = window._adminPendingProducts;
  }
  renderProductsTable();
}

/**
 * Save all products to Firestore (PRIMARY) and cache to localStorage.
 */
async function saveProducts() {
  // Sync to Firestore via hook provided by admin.html
  if (window.darSyncProductsToFirestore) {
    await window.darSyncProductsToFirestore(productsList);
  }

  renderProductsTable();
}

/**
 * Render products table in admin dashboard
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
 * Delete Product – removes from Firestore and local cache
 */
window.deleteProduct = function(id) {
  const p = productsList.find(item => item.id === id);
  if (!p) return;

  if (confirm(`هل أنت متأكد من حذف المنتج:\n"${p.name}"؟`)) {
    productsList = productsList.filter(item => item.id !== id);

    // Delete from Firestore (PRIMARY) via hook from admin.html
    if (window.darDeleteProductFromFirestore) {
      window.darDeleteProductFromFirestore(id);
    }

    renderProductsTable();
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
 * Submit Product Form (Add or Update) – saves to Firestore as primary
 */
productForm.addEventListener('submit', async (e) => {
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

  // Save to Firestore (PRIMARY) + localStorage cache
  await saveProducts();
  closeEditorModal();
  alert('تم حفظ المنتج بنجاح!');
});

function closeEditorModal() {
  productEditorModal.classList.remove('open');
}
btnCloseEditor.addEventListener('click', closeEditorModal);
btnCancelEdit.addEventListener('click', closeEditorModal);

/* ==========================================================================
   4. OFFERS MANAGEMENT (Multi-Offer CRUD — Firestore 'offers' collection)
   ========================================================================== */

let offersList = [];
let offerBase64ImageBuffer = '';

// DOM refs
const btnAddNewOffer        = document.getElementById('btnAddNewOffer');
const offersTableBody       = document.getElementById('offersTableBody');
const offersCountSpan       = document.getElementById('offersCount');
const offerEditorModal      = document.getElementById('offerEditorModal');
const offerModalTitle       = document.getElementById('offerModalTitle');
const offerForm             = document.getElementById('offerForm');
const editOfferId           = document.getElementById('editOfferId');
const offerTitleInput       = document.getElementById('offerTitleInput');
const offerNewPriceInput    = document.getElementById('offerNewPriceInput');
const offerOldPriceInput    = document.getElementById('offerOldPriceInput');
const offerExpiryInput      = document.getElementById('offerExpiryInput');
const offerImageInput       = document.getElementById('offerImageInput');
const offerImageFileInput   = document.getElementById('offerImageFileInput');
const offerFileNameDisplay  = document.getElementById('offerFileNameDisplay');
const btnCloseOfferEditor   = document.getElementById('btnCloseOfferEditor');
const btnCancelOfferEdit    = document.getElementById('btnCancelOfferEdit');

/**
 * Render the offers list table
 */
function renderOffersTable() {
  if (!offersTableBody) return;
  if (offersCountSpan) offersCountSpan.textContent = offersList.length;

  if (offersList.length === 0) {
    offersTableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 40px;">
          لا توجد عروض مضافة حالياً. اضغط "إضافة عرض جديد" للبدء.
        </td>
      </tr>
    `;
    return;
  }

  offersTableBody.innerHTML = offersList.map(o => {
    const expiry = o.expiresAt ? new Date(o.expiresAt) : null;
    const isExpired = expiry && expiry < new Date();
    const expiryText = expiry
      ? expiry.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      : 'غير محدد';
    return `
      <tr>
        <td>
          <img src="${escapeHTML(o.image || 'images/offers/launch-offer.svg')}"
               alt="${escapeHTML(o.title)}"
               class="table-thumb"
               onerror="this.src='images/offers/launch-offer.svg'">
        </td>
        <td><strong>${escapeHTML(o.title)}</strong></td>
        <td><strong style="color: #ff6b81;">${escapeHTML(String(o.newPrice || ''))} ج.م</strong></td>
        <td><span style="color: var(--text-muted); text-decoration: line-through;">${o.oldPrice ? escapeHTML(String(o.oldPrice)) + ' ج.م' : '-'}</span></td>
        <td>
          <span style="color: ${isExpired ? 'var(--admin-danger)' : 'var(--admin-cyan)'}; font-size: 0.88rem;">
            ${isExpired ? '⛔ منتهي — ' : '✅ '}${expiryText}
          </span>
        </td>
        <td style="text-align: center;">
          <div class="table-actions" style="justify-content: center;">
            <button class="btn btn-secondary btn-icon" onclick="openEditOfferModal('${escapeHTML(String(o.id))}')">✏️ تعديل</button>
            <button class="btn btn-danger btn-icon" onclick="deleteOffer('${escapeHTML(String(o.id))}')">🗑️ حذف</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * Open editor modal for adding a new offer
 */
function openAddOfferModal() {
  if (offerModalTitle) offerModalTitle.textContent = 'إضافة عرض جديد';
  if (offerForm) offerForm.reset();
  if (editOfferId) editOfferId.value = '';
  offerBase64ImageBuffer = '';
  if (offerFileNameDisplay) offerFileNameDisplay.textContent = '';

  // Default expiry: 7 days from now
  const defaultExpiry = new Date();
  defaultExpiry.setDate(defaultExpiry.getDate() + 7);
  const pad = n => String(n).padStart(2, '0');
  const localIso = `${defaultExpiry.getFullYear()}-${pad(defaultExpiry.getMonth() + 1)}-${pad(defaultExpiry.getDate())}T${pad(defaultExpiry.getHours())}:${pad(defaultExpiry.getMinutes())}`;
  if (offerExpiryInput) offerExpiryInput.value = localIso;

  if (offerEditorModal) offerEditorModal.classList.add('open');
}

/**
 * Open editor modal to edit an existing offer
 */
window.openEditOfferModal = function(id) {
  const o = offersList.find(item => String(item.id) === String(id));
  if (!o) return;

  if (offerModalTitle) offerModalTitle.textContent = 'تعديل العرض';
  if (editOfferId) editOfferId.value = o.id;
  if (offerTitleInput) offerTitleInput.value = o.title || '';
  if (offerNewPriceInput) offerNewPriceInput.value = o.newPrice || '';
  if (offerOldPriceInput) offerOldPriceInput.value = o.oldPrice || '';
  if (offerImageInput) offerImageInput.value = o.image || '';
  offerBase64ImageBuffer = '';
  if (offerFileNameDisplay) offerFileNameDisplay.textContent = '';

  // Format expiry date for datetime-local input
  if (o.expiresAt && offerExpiryInput) {
    const d = new Date(o.expiresAt);
    const pad = n => String(n).padStart(2, '0');
    const localIso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    offerExpiryInput.value = localIso;
  }

  if (offerEditorModal) offerEditorModal.classList.add('open');
};

/**
 * Close offer editor modal
 */
function closeOfferEditorModal() {
  if (offerEditorModal) offerEditorModal.classList.remove('open');
}

/**
 * Delete an offer from Firestore
 */
window.deleteOffer = async function(id) {
  const o = offersList.find(item => String(item.id) === String(id));
  if (!o) return;
  if (!confirm(`هل أنت متأكد من حذف العرض:\n"${o.title}"؟`)) return;

  if (window.darDeleteOfferFromFirestore) {
    try {
      await window.darDeleteOfferFromFirestore(id);
      // onSnapshot will update offersList automatically
      alert('تم حذف العرض بنجاح.');
    } catch (err) {
      alert('حدث خطأ أثناء الحذف: ' + err.message);
    }
  }
};

// Image File Upload for Offer
if (offerImageFileInput) {
  offerImageFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً، يفضل اختيار صورة أقل من 3 ميجابايت.');
      return;
    }
    if (offerFileNameDisplay) offerFileNameDisplay.textContent = `جاري تجهيز: ${file.name}`;
    const reader = new FileReader();
    reader.onload = function(event) {
      offerBase64ImageBuffer = event.target.result;
      if (offerImageInput) offerImageInput.value = offerBase64ImageBuffer;
      if (offerFileNameDisplay) offerFileNameDisplay.textContent = `✓ تم تجهيز: ${file.name}`;
    };
    reader.readAsDataURL(file);
  });
}

// Submit Offer Form (Add or Edit)
if (offerForm) {
  offerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = editOfferId ? editOfferId.value.trim() : '';
    const title = offerTitleInput ? offerTitleInput.value.trim() : '';
    const newPrice = offerNewPriceInput ? offerNewPriceInput.value.trim() : '';
    const oldPrice = offerOldPriceInput ? offerOldPriceInput.value.trim() : '';
    const expiryVal = offerExpiryInput ? offerExpiryInput.value : '';
    const image = (offerImageInput ? offerImageInput.value.trim() : '') || 'images/offers/launch-offer.svg';
    const expiresAt = expiryVal ? new Date(expiryVal).toISOString() : new Date(Date.now() + 7 * 86400000).toISOString();

    if (!title || !newPrice || !expiryVal) {
      alert('من فضلك أكمل الحقول المطلوبة (العنوان، السعر الجديد، وتاريخ الانتهاء).');
      return;
    }

    const offerData = {
      id: id || undefined,
      title,
      newPrice,
      oldPrice,
      image,
      expiresAt
    };

    if (window.darSaveOfferToFirestore) {
      try {
        await window.darSaveOfferToFirestore(offerData);
        closeOfferEditorModal();
        alert('✓ تم حفظ العرض بنجاح! سيظهر فوراً في واجهة المتجر.');
      } catch (err) {
        alert('حدث خطأ أثناء الحفظ: ' + err.message);
      }
    } else {
      alert('لم يتم الاتصال بـ Firestore بعد، حاول مجدداً.');
    }
  });
}

// Event Listeners
if (btnAddNewOffer) btnAddNewOffer.addEventListener('click', openAddOfferModal);
if (btnCloseOfferEditor) btnCloseOfferEditor.addEventListener('click', closeOfferEditorModal);
if (btnCancelOfferEdit) btnCancelOfferEdit.addEventListener('click', closeOfferEditorModal);
if (offerEditorModal) {
  offerEditorModal.addEventListener('click', (e) => {
    if (e.target === offerEditorModal) closeOfferEditorModal();
  });
}

/**
 * Called when navigating to the Offers tab
 */
function loadOffersTable() {
  renderOffersTable();
}

/**
 * Global hook: called by admin.html Firestore onSnapshot when offers change
 */
window.darAdminUpdateOffers = function(offers) {
  if (Array.isArray(offers)) {
    offersList = offers;
    const offersTab = document.getElementById('offersTab');
    if (offersTab && offersTab.style.display !== 'none') {
      renderOffersTable();
    }
  }
};



/* ==========================================================================
   5. ORDERS LOG & INSTAPAY VERIFICATION
   ========================================================================== */
const ordersTableBody = document.getElementById('ordersTableBody');
const ordersCountSpan = document.getElementById('ordersCount');
const filterOrderStatus = document.getElementById('filterOrderStatus');
const btnClearOrders = document.getElementById('btnClearOrders');

// Receipt Modal Elements
const receiptModal = document.getElementById('receiptModal');
const btnCloseReceiptModal = document.getElementById('btnCloseReceiptModal');
const btnCloseReceiptBtn = document.getElementById('btnCloseReceiptBtn');
const receiptModalImg = document.getElementById('receiptModalImg');
const receiptModalEmpty = document.getElementById('receiptModalEmpty');
const receiptModalTitle = document.getElementById('receiptModalTitle');
const receiptModalOrderInfo = document.getElementById('receiptModalOrderInfo');
const receiptDownloadLink = document.getElementById('receiptDownloadLink');

/**
 * Load orders from localStorage cache (updated in real-time by Firestore onSnapshot in admin.html)
 */
function loadOrdersTable() {
  if (!ordersTableBody) return;

  const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
  let orders = [];
  if (raw) {
    try { orders = JSON.parse(raw); } catch {}
  }

  const statusFilter = filterOrderStatus ? filterOrderStatus.value : 'all';
  const filtered = orders.filter(o => {
    if (statusFilter === 'all') return true;
    const isConfirmed = (o.status === 'تم التأكيد / تم الدفع');
    if (statusFilter === 'confirmed') return isConfirmed;
    if (statusFilter === 'pending') return !isConfirmed;
    return true;
  });

  if (ordersCountSpan) ordersCountSpan.textContent = filtered.length;

  if (filtered.length === 0) {
    ordersTableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 40px;">
          لا توجد طلبات مسجلة في هذا القسم.
        </td>
      </tr>
    `;
    return;
  }

  ordersTableBody.innerHTML = filtered.map(o => {
    const isPaid = (o.status === 'تم التأكيد / تم الدفع');
    const statusText = isPaid ? 'تم التأكيد / تم الدفع ✓' : 'قيد التحقق من الشحن ⏳';
    const statusClass = isPaid ? 'status-confirmed' : 'status-pending';

    // Format products / cart items
    let itemsHtml = '';
    if (Array.isArray(o.items) && o.items.length > 0) {
      itemsHtml = `
        <div class="order-items-list">
          ${o.items.map(item => `
            <div class="order-item-chip">
              <span class="order-item-qty">${item.quantity || 1}×</span>
              <span class="order-item-name">${escapeHTML(item.name || '')}</span>
              <span class="order-item-price">${(Number(item.price) || 0) * (item.quantity || 1)} ج.م</span>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      itemsHtml = `
        <div class="order-item-chip">
          <span class="order-item-qty">${o.quantity || 1}×</span>
          <span class="order-item-name">${escapeHTML(o.product || 'منتج غير محدد')}</span>
        </div>
      `;
    }

    // Financial calculations
    const subtotal = Number(o.subtotal) || Number(o.itemsSubtotal) || (o.items ? o.items.reduce((s, i) => s + (Number(i.price)||0) * (i.quantity||1), 0) : 0);
    const shipping = Number(o.shippingFee) || Number(o.shippingCost) || 0;
    const total = Number(o.grandTotal) || Number(o.total) || (subtotal + shipping);

    const financialHtml = `
      <div class="order-finance-box">
        <div><small style="color: var(--text-muted);">المنتجات:</small> <span>${subtotal > 0 ? subtotal + ' ج.م' : '-'}</span></div>
        <div><small style="color: var(--text-muted);">الشحن:</small> <span style="color: var(--admin-cyan);">${shipping > 0 ? shipping + ' ج.م' : 'مجاناً'}</span></div>
        <div style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: 3px; padding-top: 3px; font-weight: 700; color: #fff;">
          <small style="color: var(--text-muted);">الإجمالي:</small> <strong>${total > 0 ? total + ' ج.م' : '-'}</strong>
        </div>
      </div>
    `;

    // WhatsApp quick link
    const cleanPhone = String(o.phone || '').replace(/\D/g, '');
    const waPhone = cleanPhone.startsWith('2') ? cleanPhone : '2' + cleanPhone;
    const waText = encodeURIComponent(`مرحباً أ/ ${o.fullName || ''}، نتواصل معك من متجر Dar Elsalam Store بخصوص طلبك رقم (${o.id}). تم استلام بياناتك وتأكيد الشحن.`);

    // Receipt Thumbnail
    const hasReceipt = Boolean(o.receiptBase64);
    const receiptHtml = hasReceipt ? `
      <div class="receipt-thumb-wrap">
        <img src="${o.receiptBase64}" alt="إيصال" class="receipt-thumb" onclick="openReceiptModal('${escapeHTML(o.id)}')">
        <button type="button" class="btn-view-receipt" onclick="openReceiptModal('${escapeHTML(o.id)}')">
          🔍 عرض
        </button>
      </div>
    ` : `<span style="color: var(--text-muted); font-size: 0.8rem;">لا يوجد إيصال</span>`;

    return `
      <tr data-order-id="${escapeHTML(o.id || '')}">
        <td>
          <strong style="color: var(--admin-cyan); font-size: 0.95rem;">${escapeHTML(o.id || '')}</strong>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px;">
            ${o.createdAt ? new Date(o.createdAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
          </div>
        </td>
        <td>
          <div style="font-weight: 700; margin-bottom: 3px; font-size: 0.95rem;">${escapeHTML(o.fullName || '')}</div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <a href="tel:${o.phone}" style="color: var(--admin-cyan); font-size: 0.88rem; font-weight: 600;">${escapeHTML(o.phone || '')}</a>
            ${cleanPhone ? `<a href="https://wa.me/${waPhone}?text=${waText}" target="_blank" rel="noopener" class="wa-order-link" title="محادثة واتساب">💬</a>` : ''}
          </div>
        </td>
        <td>
          <div style="font-weight: 700; color: #fff;">${escapeHTML(o.governorate || '')}</div>
          <div style="font-size: 0.82rem; color: var(--text-muted); max-width: 170px;">${escapeHTML(o.address || 'العنوان غير مدخل')}</div>
          ${o.notes ? `<div style="font-size: 0.75rem; color: var(--admin-warning); margin-top: 4px;">ملاحظات: ${escapeHTML(o.notes)}</div>` : ''}
        </td>
        <td>${itemsHtml}</td>
        <td>${financialHtml}</td>
        <td style="text-align: center;">${receiptHtml}</td>
        <td style="text-align: center;">
          <span class="order-status-badge ${statusClass}">
            ${statusText}
          </span>
        </td>
        <td style="text-align: center;">
          <div class="table-actions" style="justify-content: center; flex-direction: column; gap: 6px;">
            <button class="btn ${isPaid ? 'btn-secondary' : 'btn-success'} btn-sm" onclick="toggleOrderStatus('${escapeHTML(o.id)}', ${isPaid})" title="${isPaid ? 'إعادة إلى قيد التحقق' : 'تأكيد الدفع والاستلام'}">
              ${isPaid ? '↩️ قيد المراجعة' : '✓ تأكيد الدفع'}
            </button>
            <button class="btn btn-danger btn-sm" onclick="deleteOrderLocally('${escapeHTML(o.id)}')">
              🗑️ مسح
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

if (filterOrderStatus) {
  filterOrderStatus.addEventListener('change', loadOrdersTable);
}

// Receipt Modal Viewer
window.openReceiptModal = function(orderId) {
  const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
  let orders = [];
  if (raw) {
    try { orders = JSON.parse(raw); } catch {}
  }
  const order = orders.find(o => String(o.id) === String(orderId));
  if (!order || !receiptModal) return;

  if (receiptModalTitle) receiptModalTitle.textContent = `إيصال InstaPay - طلب ${order.id}`;
  if (receiptModalOrderInfo) {
    receiptModalOrderInfo.textContent = `العميل: ${order.fullName || ''} | الهاتف: ${order.phone || ''} | المحافظة: ${order.governorate || ''}`;
  }

  if (order.receiptBase64) {
    receiptModalImg.src = order.receiptBase64;
    receiptModalImg.style.display = 'block';
    if (receiptModalEmpty) receiptModalEmpty.style.display = 'none';
    if (receiptDownloadLink) {
      receiptDownloadLink.href = order.receiptBase64;
      receiptDownloadLink.download = `instapay-receipt-${order.id}.jpg`;
      receiptDownloadLink.style.display = 'inline-flex';
    }
  } else {
    receiptModalImg.style.display = 'none';
    if (receiptModalEmpty) receiptModalEmpty.style.display = 'block';
    if (receiptDownloadLink) receiptDownloadLink.style.display = 'none';
  }

  receiptModal.classList.add('open');
};

function closeReceiptModal() {
  if (receiptModal) receiptModal.classList.remove('open');
}
if (btnCloseReceiptModal) btnCloseReceiptModal.addEventListener('click', closeReceiptModal);
if (btnCloseReceiptBtn) btnCloseReceiptBtn.addEventListener('click', closeReceiptModal);
if (receiptModal) {
  receiptModal.addEventListener('click', (e) => {
    if (e.target === receiptModal) closeReceiptModal();
  });
}

// Toggle Order Status (e.g. Mark as Paid / Confirmed)
window.toggleOrderStatus = async function(orderId, currentIsPaid) {
  const newStatus = currentIsPaid ? 'قيد التحقق من الشحن' : 'تم التأكيد / تم الدفع';

  // 1. Update local cache immediately
  const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
  let orders = [];
  if (raw) {
    try { orders = JSON.parse(raw); } catch {}
  }
  const target = orders.find(o => String(o.id) === String(orderId));
  if (target) {
    target.status = newStatus;
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    loadOrdersTable();
  }

  // 2. Sync to Firestore (PRIMARY)
  if (window.darUpdateOrderStatusInFirestore) {
    try {
      await window.darUpdateOrderStatusInFirestore(orderId, newStatus);
    } catch (err) {
      console.warn('Could not sync status to Firestore:', err);
      alert('تم تحديث الحالة محلياً، وتعذر التحديث في Firestore.');
    }
  }
};

window.deleteOrderLocally = function(orderId) {
  if (confirm(`هل تريد مسح هذا الطلب (${orderId}) من السجل؟`)) {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    let orders = [];
    if (raw) {
      try { orders = JSON.parse(raw); } catch {}
    }
    orders = orders.filter(o => String(o.id) !== String(orderId));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    loadOrdersTable();
  }
};

btnClearOrders.addEventListener('click', () => {
  if (confirm('هل تريد مسح سجل الطلبات المحلي بالكامل؟ ملاحظة: لن يؤثر ذلك على البيانات المحفوظة في Firestore.')) {
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    loadOrdersTable();
  }
});

/* ==========================================================================
   6. SHIPPING RATES MANAGEMENT
   ========================================================================== */
const shippingRatesForm = document.getElementById('shippingRatesForm');
const shippingRatesGrid = document.getElementById('shippingRatesGrid');
const btnSaveShippingRatesTop = document.getElementById('btnSaveShippingRatesTop');
const btnApplyDefaultRates = document.getElementById('btnApplyDefaultRates');
const btnApplyUniformRate = document.getElementById('btnApplyUniformRate');
const uniformRateInput = document.getElementById('uniformRateInput');

let currentShippingRates = { ...DEFAULT_SHIPPING_RATES };

function loadShippingRates() {
  const raw = localStorage.getItem(STORAGE_KEYS.SHIPPING_RATES);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        currentShippingRates = { ...DEFAULT_SHIPPING_RATES, ...parsed };
      }
    } catch {}
  }
  renderShippingRatesGrid();
}

function renderShippingRatesGrid() {
  if (!shippingRatesGrid) return;

  const governorates = Object.keys(DEFAULT_SHIPPING_RATES);
  shippingRatesGrid.innerHTML = governorates.map(gov => {
    const rate = currentShippingRates[gov] !== undefined ? currentShippingRates[gov] : (DEFAULT_SHIPPING_RATES[gov] || 60);
    const region = GOVERNORATE_REGIONS[gov] || 'محافظة';
    return `
      <div class="shipping-rate-card" data-gov="${escapeHTML(gov)}">
        <div class="shipping-rate-header">
          <span class="gov-name">${escapeHTML(gov)}</span>
          <span class="gov-region-tag">${escapeHTML(region)}</span>
        </div>
        <div class="shipping-rate-input-wrap">
          <input type="number" class="form-control gov-rate-input" data-gov="${escapeHTML(gov)}" value="${rate}" min="0" step="5" required>
          <span class="currency-label">ج.م</span>
        </div>
      </div>
    `;
  }).join('');
}

function collectRatesFromInputs() {
  const inputs = document.querySelectorAll('.gov-rate-input');
  const rates = {};
  inputs.forEach(inp => {
    const gov = inp.getAttribute('data-gov');
    const val = parseInt(inp.value, 10);
    rates[gov] = isNaN(val) ? 60 : val;
  });
  return rates;
}

async function saveShippingRates() {
  const rates = collectRatesFromInputs();
  currentShippingRates = rates;

  // 1. Cache in localStorage
  try {
    localStorage.setItem(STORAGE_KEYS.SHIPPING_RATES, JSON.stringify(rates));
  } catch {}

  // 2. Save to Firestore (PRIMARY)
  if (window.darSaveShippingRatesToFirestore) {
    try {
      await window.darSaveShippingRatesToFirestore(rates);
      alert('✓ تم حفظ وتحديث أسعار الشحن في Firestore بنجاح!\nالأسعار الجديدة ستنعكس فوراً في صفحة إتمام الطلب.');
    } catch (err) {
      alert('حدث خطأ أثناء الحفظ في Firestore: ' + err.message);
    }
  } else {
    alert('✓ تم حفظ أسعار الشحن محلياً.');
  }
}

if (shippingRatesForm) {
  shippingRatesForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveShippingRates();
  });
}

if (btnSaveShippingRatesTop) {
  btnSaveShippingRatesTop.addEventListener('click', async () => {
    await saveShippingRates();
  });
}

if (btnApplyDefaultRates) {
  btnApplyDefaultRates.addEventListener('click', () => {
    if (confirm('هل تريد استعادة أسعار الشحن المقترحة لجميع المحافظات؟')) {
      currentShippingRates = { ...DEFAULT_SHIPPING_RATES };
      renderShippingRatesGrid();
    }
  });
}

if (btnApplyUniformRate) {
  btnApplyUniformRate.addEventListener('click', () => {
    const val = parseInt(uniformRateInput.value, 10);
    if (isNaN(val) || val < 0) {
      alert('من فضلك أدخل قيمة رقمية صالحة لسعر الشحن الموحد.');
      return;
    }
    const governorates = Object.keys(DEFAULT_SHIPPING_RATES);
    governorates.forEach(gov => {
      currentShippingRates[gov] = val;
    });
    renderShippingRatesGrid();
  });
}

// Hook called when Firestore onSnapshot updates shipping rates
window.darAdminUpdateShippingRates = function(remoteRates) {
  if (remoteRates && typeof remoteRates === 'object') {
    currentShippingRates = { ...DEFAULT_SHIPPING_RATES, ...remoteRates };
    const shippingTab = document.getElementById('shippingTab');
    if (shippingTab && shippingTab.style.display !== 'none') {
      renderShippingRatesGrid();
    }
  }
};

/* ==========================================================================
   7. SETTINGS & PIN MANAGEMENT
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
  // Note: PIN is managed via DEFAULT_PIN constant in admin.js (not localStorage)
  alert('لتغيير رمز المرور، يرجى تعديل ثابت DEFAULT_PIN داخل ملف admin.js مباشرةً.');
  newPinInput.value = '';
});


btnResetDefaults.addEventListener('click', async () => {
  if (confirm('تنبيه: سيتم مسح كافة التعديلات في Firestore واستعادة المنتجات الافتراضية. هل تريد المتابعة؟')) {
    productsList = [...DEFAULT_PRODUCTS];

    // Sync default products to Firestore
    if (window.darSyncProductsToFirestore) {
      await window.darSyncProductsToFirestore(productsList);
    }

    // Add a default offer to the 'offers' collection
    const defaultOfferEnd = new Date();
    defaultOfferEnd.setDate(defaultOfferEnd.getDate() + 5);
    const defaultOffer = {
      title: "باقة الافتتاح الكبرى: ساعة ذكية Ultra + AirPods Pro + شاحن 65W",
      newPrice: "1250",
      oldPrice: "1950",
      image: "images/offers/launch-offer.svg",
      expiresAt: defaultOfferEnd.toISOString()
    };

    if (window.darSaveOfferToFirestore) {
      await window.darSaveOfferToFirestore(defaultOffer);
    }

    renderProductsTable();
    alert('تمت استعادة البيانات الافتراضية بنجاح في Firestore!');
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

/* ==========================================================================
   8. GLOBAL HOOKS (Called by admin.html Firestore listeners)
   ========================================================================== */

/**
 * Called by admin.html Firestore onSnapshot when products change remotely.
 * Updates productsList and re-renders the admin table.
 */
window.darAdminUpdateProducts = function(products) {
  if (Array.isArray(products)) {
    productsList = products;
    renderProductsTable();
  }
};

// Expose loadOrdersTable globally so admin.html can call it after Firestore sync
window.loadOrdersTable = loadOrdersTable;

/* ==========================================================================
   9. INITIAL SETUP
   ========================================================================== */
function initDashboard() {
  loadProducts();
  if (Array.isArray(window._adminPendingOffers)) {
    offersList = window._adminPendingOffers;
    renderOffersTable();
  }
}

// Check auth state on boot
checkAuth();
