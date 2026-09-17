/**
 * ==========================================================================
 * DAR ELSALAM STORE - Official Frontend Logic (Pure Vanilla JavaScript)
 * Interactive Catalog, Live Search, Countdown Timer & WhatsApp Ordering
 * ==========================================================================
 */

'use strict';

const STORE_CONFIG = {
  name: "Dar Elsalam Store",
  phone: "01008991290",
  whatsappNumber: "201008991290",
  siteUrl: "https://dar-elsalam-store.firebaseapp.com",
  developer: {
    name: "Eng/ Mohaned Halim",
    phone: "01220702077",
    whatsapp: "https://wa.me/201220702077"
  }
};

const STORAGE_KEYS = {
  PRODUCTS: "dar_elsalam_products_v1",
  OFFER: "dar_elsalam_offer_v1",
  ORDERS: "dar_elsalam_orders_v1"
};

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
let storeProducts = [];
let currentCategory = 'all';
let searchQuery = '';
let countdownInterval = null;

/* ==========================================================================
   DOM ELEMENTS
   ========================================================================== */
const productsGrid = document.getElementById('productsGrid');
const emptyStateContainer = document.getElementById('emptyStateContainer');
const productSearchInput = document.getElementById('productSearchInput');
const categoryPillList = document.getElementById('categoryPillList');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');

// Modals
const productModal = document.getElementById('productModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalProductImg = document.getElementById('modalProductImg');
const modalProductCategory = document.getElementById('modalProductCategory');
const modalProductName = document.getElementById('modalProductName');
const modalProductPrice = document.getElementById('modalProductPrice');
const modalProductOldPrice = document.getElementById('modalProductOldPrice');
const modalProductDescription = document.getElementById('modalProductDescription');
const modalProductFeatures = document.getElementById('modalProductFeatures');
const modalOrderWhatsAppBtn = document.getElementById('modalOrderWhatsAppBtn');
const modalFillFormBtn = document.getElementById('modalFillFormBtn');

// QR Modal & Triggers
const qrModal = document.getElementById('qrModal');
const qrModalCloseBtn = document.getElementById('qrModalCloseBtn');
const openQrBtn = document.getElementById('openQrBtn');
const openQrBtnHeader = document.getElementById('openQrBtnHeader');
const navQrDropdown = document.getElementById('navQrDropdown');
const btnCopyDropdown = document.getElementById('btnCopyDropdown');
const btnCopyMobileQr = document.getElementById('btnCopyMobileQr');
const btnCopySiteUrl = document.getElementById('btnCopySiteUrl');
const btnShareQrWhatsApp = document.getElementById('btnShareQrWhatsApp');

// Navigation Drawer
const hamburgerBtn = document.getElementById('hamburgerBtn');
const closeDrawerBtn = document.getElementById('closeDrawerBtn');
const mobileNavDrawer = document.getElementById('mobileNavDrawer');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

// Floating & Utilities
const scrollTopBtn = document.getElementById('scrollTopBtn');
const toastContainer = document.getElementById('toastContainer');
const currentYearSpan = document.getElementById('currentYear');

// Order Form
const orderForm = document.getElementById('orderForm');
const orderFullName = document.getElementById('orderFullName');
const orderPhone = document.getElementById('orderPhone');
const orderProduct = document.getElementById('orderProduct');
const orderQuantity = document.getElementById('orderQuantity');
const orderGovernorate = document.getElementById('orderGovernorate');
const orderAddress = document.getElementById('orderAddress');
const orderNotes = document.getElementById('orderNotes');
const btnSubmitWhatsApp = document.getElementById('btnSubmitWhatsApp');

// Offers Elements
const openingOfferCard = document.getElementById('openingOfferCard');
const offerBannerImg = document.getElementById('offerBannerImg');
const offerTitleText = document.getElementById('offerTitleText');
const offerDescriptionText = document.getElementById('offerDescriptionText');
const offerNewPriceText = document.getElementById('offerNewPriceText');
const offerOldPriceText = document.getElementById('offerOldPriceText');
const offerDiscountText = document.getElementById('offerDiscountText');
const countdownArea = document.getElementById('countdownArea');
const offerExpiredNotice = document.getElementById('offerExpiredNotice');
const timerDays = document.getElementById('timerDays');
const timerHours = document.getElementById('timerHours');
const timerMinutes = document.getElementById('timerMinutes');
const timerSeconds = document.getElementById('timerSeconds');
const btnOfferOrder = document.getElementById('btnOfferOrder');

/* ==========================================================================
   1. PRODUCTS CATALOG & FILTERING
   ========================================================================== */
function initProducts() {
  const local = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (local) {
    try {
      storeProducts = JSON.parse(local);
    } catch {
      storeProducts = [...DEFAULT_PRODUCTS];
    }
  } else {
    storeProducts = [...DEFAULT_PRODUCTS];
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(storeProducts));
  }
  renderProducts();
}

function renderProducts() {
  if (!productsGrid) return;

  const filtered = storeProducts.filter(item => {
    const matchCat = (currentCategory === 'all' || item.category === currentCategory);
    const q = searchQuery.trim().toLowerCase();
    const matchSearch = !q || 
      (item.name && item.name.toLowerCase().includes(q)) || 
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    productsGrid.style.display = 'none';
    if (emptyStateContainer) emptyStateContainer.style.display = 'block';
    return;
  }

  productsGrid.style.display = 'grid';
  if (emptyStateContainer) emptyStateContainer.style.display = 'none';

  productsGrid.innerHTML = filtered.map(item => `
    <article class="product-card" data-id="${item.id}">
      <span class="product-badge">${escapeHTML(item.category)}</span>
      <div class="product-img-wrap">
        <img src="${escapeHTML(item.image || 'images/products/phone-repair.svg')}" alt="${escapeHTML(item.name)}" class="product-img" loading="lazy">
      </div>
      <div class="product-info">
        <span class="product-category-tag">${escapeHTML(item.category)}</span>
        <h3 class="product-title">${escapeHTML(item.name)}</h3>
        <div class="product-price-row">
          <span class="product-price">${escapeHTML(String(item.price))} ج.م</span>
          ${item.oldPrice ? `<span class="product-old-price">${escapeHTML(String(item.oldPrice))} ج.م</span>` : ''}
        </div>
        <div class="product-actions">
          <button type="button" class="btn-product-details" onclick="window.darOpenProductModal(${item.id})">
            عرض التفاصيل
          </button>
          <a href="https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(`مرحباً Dar Elsalam Store، أستفسر عن توفر منتج: ${item.name} (السعر: ${item.price} ج.م)`)}" 
             target="_blank" rel="noopener noreferrer" class="btn-product-whatsapp" title="طلب مباشر عبر واتساب">
            💬
          </a>
        </div>
      </div>
    </article>
  `).join('');
}

// Global hook for modal opener
window.darOpenProductModal = function(productId) {
  const product = storeProducts.find(p => p.id === productId);
  if (!product || !productModal) return;

  modalProductImg.src = product.image || 'images/products/phone-repair.svg';
  modalProductImg.alt = product.name;
  modalProductCategory.textContent = product.category;
  modalProductName.textContent = product.name;
  modalProductPrice.textContent = `${product.price} ج.م`;
  modalProductOldPrice.textContent = product.oldPrice ? `${product.oldPrice} ج.م` : '';
  modalProductDescription.textContent = product.description || '';

  if (modalProductFeatures) {
    if (product.features && product.features.length) {
      modalProductFeatures.innerHTML = product.features.map(f => `<li>${escapeHTML(f)}</li>`).join('');
    } else {
      modalProductFeatures.innerHTML = `<li>ضمان المتجر الرسمي المعتمد</li><li>فحص وتجربة قبل الاستلام</li>`;
    }
  }

  // WhatsApp Order from Modal
  if (modalOrderWhatsAppBtn) {
    modalOrderWhatsAppBtn.onclick = () => {
      const msg = `مرحباً Dar Elsalam Store، أود طلب وشراء المنتج التالي:\n- اسم المنتج: ${product.name}\n- السعر: ${product.price} ج.م\n- الرابط: ${window.location.href}`;
      window.open(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    };
  }

  // Quick fill form
  if (modalFillFormBtn) {
    modalFillFormBtn.onclick = () => {
      closeProductModal();
      if (orderProduct) {
        orderProduct.value = product.name;
      }
      const shippingSection = document.getElementById('shipping');
      if (shippingSection) {
        shippingSection.scrollIntoView({ behavior: 'smooth' });
      }
    };
  }

  productModal.classList.add('open');
};

function closeProductModal() {
  if (productModal) productModal.classList.remove('open');
}

if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProductModal);
if (productModal) {
  productModal.addEventListener('click', (e) => {
    if (e.target === productModal) closeProductModal();
  });
}

// Filter Pills
if (categoryPillList) {
  categoryPillList.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-pill');
    if (!btn) return;
    document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.getAttribute('data-category') || 'all';
    renderProducts();
  });
}

// Live Search
if (productSearchInput) {
  productSearchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderProducts();
  });
}

if (resetFiltersBtn) {
  resetFiltersBtn.addEventListener('click', () => {
    currentCategory = 'all';
    searchQuery = '';
    if (productSearchInput) productSearchInput.value = '';
    document.querySelectorAll('.filter-pill').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-category') === 'all');
    });
    renderProducts();
  });
}

/* ==========================================================================
   2. OPENING OFFER & COUNTDOWN TIMER
   ========================================================================== */
function initOpeningOffer() {
  const local = localStorage.getItem(STORAGE_KEYS.OFFER);
  let offer = null;
  if (local) {
    try { offer = JSON.parse(local); } catch {}
  }

  if (!offer) {
    const defaultEnd = new Date();
    defaultEnd.setDate(defaultEnd.getDate() + 5);
    offer = {
      enabled: true,
      title: "باقة الافتتاح الكبرى: ساعة ذكية Ultra + AirPods Pro + شاحن 65W",
      description: "احصل على أقوى مجموعة تكنولوجية متكاملة بسعر الافتتاح الاستثنائي! وفر أكثر من 35% مع ضمان حقيقي وشحن فوري لجميع المحافظات.",
      newPrice: "1,250",
      oldPrice: "1,950",
      discountBadge: "وفر 700 ج.م (36%-)",
      image: "images/offers/launch-offer.svg",
      expiresAt: defaultEnd.toISOString()
    };
  }

  applyOfferData(offer);
}

function applyOfferData(offer) {
  if (!openingOfferCard) return;

  if (offer.enabled === false) {
    openingOfferCard.style.display = 'none';
    return;
  }
  openingOfferCard.style.display = 'block';

  if (offerTitleText && offer.title) offerTitleText.textContent = offer.title;
  if (offerDescriptionText && offer.description) offerDescriptionText.textContent = offer.description;
  if (offerNewPriceText && offer.newPrice) offerNewPriceText.innerHTML = `${offer.newPrice} <small style="font-size: 1rem; color: #cbd5e1;">ج.م</small>`;
  if (offerOldPriceText && offer.oldPrice) offerOldPriceText.textContent = `${offer.oldPrice} ج.م`;
  if (offerDiscountText && offer.discountBadge) offerDiscountText.textContent = offer.discountBadge;
  if (offerBannerImg && offer.image) offerBannerImg.src = offer.image;

  if (btnOfferOrder) {
    btnOfferOrder.onclick = (e) => {
      e.preventDefault();
      if (orderProduct) {
        orderProduct.value = offer.title || "عرض الافتتاح الخاص";
      }
      const shippingSection = document.getElementById('shipping');
      if (shippingSection) {
        shippingSection.scrollIntoView({ behavior: 'smooth' });
      }
    };
  }

  startCountdown(offer.expiresAt);
}

function startCountdown(expiresAt) {
  if (countdownInterval) clearInterval(countdownInterval);

  const targetDate = expiresAt ? new Date(expiresAt).getTime() : (Date.now() + 5 * 86400000);

  function update() {
    const now = Date.now();
    const distance = targetDate - now;

    if (distance <= 0) {
      clearInterval(countdownInterval);
      if (countdownArea) countdownArea.style.display = 'none';
      if (offerExpiredNotice) offerExpiredNotice.style.display = 'block';
      if (btnOfferOrder) {
        btnOfferOrder.style.opacity = '0.5';
        btnOfferOrder.style.pointerEvents = 'none';
      }
      return;
    }

    if (countdownArea) countdownArea.style.display = 'block';
    if (offerExpiredNotice) offerExpiredNotice.style.display = 'none';
    if (btnOfferOrder) {
      btnOfferOrder.style.opacity = '1';
      btnOfferOrder.style.pointerEvents = 'auto';
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');
    if (timerDays) timerDays.textContent = pad(days);
    if (timerHours) timerHours.textContent = pad(hours);
    if (timerMinutes) timerMinutes.textContent = pad(minutes);
    if (timerSeconds) timerSeconds.textContent = pad(seconds);
  }

  update();
  countdownInterval = setInterval(update, 1000);
}

/* ==========================================================================
   3. QR CODE SYSTEM (Dropdown, Modal & Copy)
   ========================================================================== */
function copyStoreUrl() {
  const url = STORE_CONFIG.siteUrl;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      showToast("✓ تم نسخ رابط المتجر بنجاح إلى الحافظة!");
    }).catch(() => {
      fallbackCopyText(url);
    });
  } else {
    fallbackCopyText(url);
  }
}

function fallbackCopyText(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast("✓ تم نسخ رابط المتجر بنجاح!");
  } catch {
    prompt("انسخ الرابط يدوياً:", text);
  }
  document.body.removeChild(textArea);
}

// Nav QR button trigger
if (openQrBtn) {
  openQrBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (navQrDropdown) navQrDropdown.classList.toggle('open');
  });
}

// Header QR icon button opens modal directly
if (openQrBtnHeader) {
  openQrBtnHeader.addEventListener('click', () => {
    if (qrModal) qrModal.classList.add('open');
  });
}

// Close dropdown on outside click
document.addEventListener('click', (e) => {
  if (navQrDropdown && !navQrDropdown.contains(e.target) && e.target !== openQrBtn) {
    navQrDropdown.classList.remove('open');
  }
});

// Copy buttons
if (btnCopyDropdown) btnCopyDropdown.addEventListener('click', copyStoreUrl);
if (btnCopyMobileQr) btnCopyMobileQr.addEventListener('click', copyStoreUrl);
if (btnCopySiteUrl) btnCopySiteUrl.addEventListener('click', copyStoreUrl);

if (btnShareQrWhatsApp) {
  btnShareQrWhatsApp.addEventListener('click', () => {
    const text = `تفضل بزيارة متجر Dar Elsalam Store للإلكترونيات وصيانة الهواتف الذكية في الإسكندرية عبر الرابط:\n${STORE_CONFIG.siteUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  });
}

if (qrModalCloseBtn) {
  qrModalCloseBtn.addEventListener('click', () => {
    if (qrModal) qrModal.classList.remove('open');
  });
}

if (qrModal) {
  qrModal.addEventListener('click', (e) => {
    if (e.target === qrModal) qrModal.classList.remove('open');
  });
}

/* ==========================================================================
   4. SHIPPING & ORDER FORM HANDLING
   ========================================================================== */
function validateOrderForm() {
  let isValid = true;

  const nameVal = orderFullName ? orderFullName.value.trim() : '';
  const phoneVal = orderPhone ? orderPhone.value.trim() : '';
  const prodVal = orderProduct ? orderProduct.value.trim() : '';

  // Name
  if (!nameVal) {
    setFieldError('groupFullName', true);
    isValid = false;
  } else {
    setFieldError('groupFullName', false);
  }

  // Phone (Egyptian mobile check: 01[0125][0-9]{8})
  const phoneRegex = /^01[0125][0-9]{8}$/;
  const cleanPhone = phoneVal.replace(/[\s-]/g, '');
  if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
    setFieldError('groupPhone', true);
    isValid = false;
  } else {
    setFieldError('groupPhone', false);
  }

  // Product
  if (!prodVal) {
    setFieldError('groupProduct', true);
    isValid = false;
  } else {
    setFieldError('groupProduct', false);
  }

  return isValid;
}

function setFieldError(groupId, hasError) {
  const el = document.getElementById(groupId);
  if (el) el.classList.toggle('has-error', hasError);
}

function getOrderPayload() {
  return {
    id: 'ORD-' + Date.now().toString(36).toUpperCase(),
    createdAt: new Date().toISOString(),
    fullName: orderFullName ? orderFullName.value.trim() : '',
    phone: orderPhone ? orderPhone.value.trim() : '',
    product: orderProduct ? orderProduct.value.trim() : '',
    quantity: orderQuantity ? parseInt(orderQuantity.value, 10) || 1 : 1,
    governorate: orderGovernorate ? orderGovernorate.value : 'الإسكندرية',
    address: orderAddress ? orderAddress.value.trim() : '',
    notes: orderNotes ? orderNotes.value.trim() : ''
  };
}

function saveOrderLocally(orderData) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(orderData);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(list));
  } catch (err) {
    console.warn("Local storage order save error:", err);
  }
}

// WhatsApp Order Button
if (btnSubmitWhatsApp) {
  btnSubmitWhatsApp.addEventListener('click', () => {
    if (!validateOrderForm()) {
      showToast("⚠️ من فضلك أكمل البيانات الإلزامية برقم هاتف صحيح");
      return;
    }

    const order = getOrderPayload();
    saveOrderLocally(order);

    // Save to Firestore if available
    if (window.darSaveOrderToFirestore) {
      window.darSaveOrderToFirestore(order);
    }

    const waMsg = `📦 *طلب جديد من موقع Dar Elsalam Store*
----------------------------------
👤 *الاسم:* ${order.fullName}
📞 *الهاتف:* ${order.phone}
📱 *المنتج / الخدمة:* ${order.product}
🔢 *الكمية:* ${order.quantity}
📍 *المحافظة:* ${order.governorate}
🏠 *العنوان:* ${order.address || 'غير محدد'}
📝 *ملاحظات:* ${order.notes || 'لا يوجد'}
----------------------------------
🔗 تم الطلب عبر: ${STORE_CONFIG.siteUrl}`;

    window.open(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(waMsg)}`, '_blank');
    showToast("✓ جاري فتح محادثة الواتساب لتأكيد طلبك...");
  });
}

// Local submit
if (orderForm) {
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateOrderForm()) {
      showToast("⚠️ من فضلك تأكد من ملء الحقول المطلوبة بشكل صحيح");
      return;
    }

    const order = getOrderPayload();
    saveOrderLocally(order);

    if (window.darSaveOrderToFirestore) {
      window.darSaveOrderToFirestore(order);
    }

    showToast("✓ تم تسجيل طلبك بنجاح! سيتواصل معك فريق المتجر قريباً.");
    orderForm.reset();
  });
}

/* ==========================================================================
   5. NAVIGATION & FLOATING CONTROLS
   ========================================================================== */
// Mobile Drawer Toggles
if (hamburgerBtn && mobileNavDrawer && mobileNavOverlay) {
  hamburgerBtn.addEventListener('click', () => {
    mobileNavDrawer.classList.add('open');
    mobileNavOverlay.classList.add('open');
  });
}

function closeMobileDrawer() {
  if (mobileNavDrawer) mobileNavDrawer.classList.remove('open');
  if (mobileNavOverlay) mobileNavOverlay.classList.remove('open');
}

if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeMobileDrawer);
if (mobileNavOverlay) mobileNavOverlay.addEventListener('click', closeMobileDrawer);
mobileNavLinks.forEach(link => link.addEventListener('click', closeMobileDrawer));

// Scroll To Top
window.addEventListener('scroll', () => {
  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }
});

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Dynamic Year
if (currentYearSpan) {
  currentYearSpan.textContent = new Date().getFullYear();
}

/* ==========================================================================
   6. UTILITIES
   ========================================================================== */
function showToast(message) {
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Global hooks for external synchronization (e.g. Firebase Firestore)
window.darUpdateProductsCatalog = function(products) {
  if (Array.isArray(products) && products.length > 0) {
    storeProducts = products;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    renderProducts();
  }
};

window.darUpdateOffer = function(offer) {
  if (offer && typeof offer === 'object') {
    localStorage.setItem(STORAGE_KEYS.OFFER, JSON.stringify(offer));
    applyOfferData(offer);
  }
};

// Initial boot
document.addEventListener('DOMContentLoaded', () => {
  initProducts();
  initOpeningOffer();
});