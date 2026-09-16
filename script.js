/**
 * ==========================================================================
 * DAR ELSALAM STORE - Official Application Script (Pure Vanilla JavaScript)
 * Fully responsive Arabic E-Commerce Platform
 * ==========================================================================
 */

'use strict';

/* ==========================================================================
   1. STORE CENTRAL CONFIGURATION
   All main shop information, phone numbers, and social links can easily be
   updated right here in this single configuration object.
   ========================================================================== */
const STORE_CONFIG = {
  name: "Dar Elsalam Store",
  phone: "01008991290",
  whatsappNumber: "201008991290", // Egypt format (+20)
  email: "darelsalam.store.eg@gmail.com",
  address: "الإسكندرية، جمهورية مصر العربية",
  socialLinks: {
    facebook: "https://www.facebook.com/share/1CyNiEFztG/",
    tiktok: "https://www.tiktok.com/@dar.elsalam.store",
    instagram: "https://www.instagram.com/darre_lsalamstore?utm_source=qr&stkn=aDl4OXQ3eTl4a20=",
    whatsapp: "https://wa.me/201008991290"
  },
  
  // Storage Keys for Browser LocalStorage
  STORAGE_KEYS: {
    PRODUCTS: "dar_elsalam_products_v1",
    OFFER: "dar_elsalam_offer_v1",
    ORDERS: "dar_elsalam_orders_v1"
  },

  // Fallback Hero Image
  fallbackImage: "images/logo.jpg"
};

/* ==========================================================================
   2. INITIAL DEFAULT CATALOG & PROMOTIONS
   These will automatically populate localStorage on the first visit.
   ========================================================================== */
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

// Default Opening Offer Configuration
// Calculates a target expiry date 7 days from user's current session if not already stored
const getDefaultTargetExpiry = () => {
  const target = new Date();
  target.setDate(target.getDate() + 5);
  target.setHours(23, 59, 59, 0);
  return target.toISOString();
};

const DEFAULT_OFFER = {
  enabled: true,
  title: "باقة الافتتاح الكبرى: ساعة ذكية Ultra + AirPods Pro + شاحن 65W",
  description: "احصل على أقوى مجموعة تكنولوجية متكاملة بسعر الافتتاح الاستثنائي! وفر أكثر من 35% مع ضمان حقيقي وشحن فوري لجميع المحافظات.",
  image: "images/offers/launch-offer.svg",
  newPrice: "1250",
  oldPrice: "1950",
  discountBadge: "وفر 700 ج.م (36%-)",
  expiresAt: getDefaultTargetExpiry()
};

/* ==========================================================================
   3. DATA PERSISTENCE & LOCALSTORAGE HELPERS
   ========================================================================== */

/**
 * Retrieve all products from localStorage or initialize defaults
 */
function getStoredProducts() {
  try {
    const raw = localStorage.getItem(STORE_CONFIG.STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORE_CONFIG.STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
      return DEFAULT_PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PRODUCTS;
  } catch (err) {
    console.error("Failed to read products from localStorage:", err);
    return DEFAULT_PRODUCTS;
  }
}

/**
 * Save products array to localStorage
 */
function saveStoredProducts(products) {
  try {
    localStorage.setItem(STORE_CONFIG.STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (err) {
    console.error("Failed to save products to localStorage:", err);
  }
}

/**
 * Retrieve current opening offer configuration
 */
function getStoredOffer() {
  try {
    const raw = localStorage.getItem(STORE_CONFIG.STORAGE_KEYS.OFFER);
    if (!raw) {
      localStorage.setItem(STORE_CONFIG.STORAGE_KEYS.OFFER, JSON.stringify(DEFAULT_OFFER));
      return DEFAULT_OFFER;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read offer from localStorage:", err);
    return DEFAULT_OFFER;
  }
}

/**
 * Save orders locally (backend integration placeholder)
 */
function saveCustomerOrder(orderData) {
  try {
    const raw = localStorage.getItem(STORE_CONFIG.STORAGE_KEYS.ORDERS) || "[]";
    const orders = JSON.parse(raw);
    orders.unshift({
      ...orderData,
      id: "ORD-" + Date.now(),
      createdAt: new Date().toISOString()
    });
    localStorage.setItem(STORE_CONFIG.STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  } catch (err) {
    console.error("Failed to record order locally:", err);
  }
}

/* ==========================================================================
   4. DOM ELEMENTS CACHE
   ========================================================================== */
const DOM = {
  header: document.getElementById('siteHeader'),
  hamburgerBtn: document.getElementById('hamburgerBtn'),
  closeDrawerBtn: document.getElementById('closeDrawerBtn'),
  mobileDrawer: document.getElementById('mobileNavDrawer'),
  mobileOverlay: document.getElementById('mobileNavOverlay'),
  mobileNavLinks: document.querySelectorAll('.mobile-nav-link'),
  
  productsGrid: document.getElementById('productsGrid'),
  searchInput: document.getElementById('productSearchInput'),
  categoryPills: document.querySelectorAll('.filter-pill'),
  emptyState: document.getElementById('emptyStateContainer'),
  resetFiltersBtn: document.getElementById('resetFiltersBtn'),

  // Modal elements
  productModal: document.getElementById('productModal'),
  modalCloseBtn: document.getElementById('modalCloseBtn'),
  modalImg: document.getElementById('modalProductImg'),
  modalCategory: document.getElementById('modalProductCategory'),
  modalTitle: document.getElementById('modalProductName'),
  modalPrice: document.getElementById('modalProductPrice'),
  modalOldPrice: document.getElementById('modalProductOldPrice'),
  modalStock: document.getElementById('modalProductStock'),
  modalDesc: document.getElementById('modalProductDescription'),
  modalFeatures: document.getElementById('modalProductFeatures'),
  modalOrderWhatsAppBtn: document.getElementById('modalOrderWhatsAppBtn'),
  modalFillFormBtn: document.getElementById('modalFillFormBtn'),

  // Offers elements
  offerCard: document.getElementById('openingOfferCard'),
  offerBannerImg: document.getElementById('offerBannerImg'),
  offerTitleText: document.getElementById('offerTitleText'),
  offerDescText: document.getElementById('offerDescriptionText'),
  offerNewPriceText: document.getElementById('offerNewPriceText'),
  offerOldPriceText: document.getElementById('offerOldPriceText'),
  offerDiscountText: document.getElementById('offerDiscountText'),
  timerDays: document.getElementById('timerDays'),
  timerHours: document.getElementById('timerHours'),
  timerMinutes: document.getElementById('timerMinutes'),
  timerSeconds: document.getElementById('timerSeconds'),
  offerExpiredNotice: document.getElementById('offerExpiredNotice'),
  btnOfferOrder: document.getElementById('btnOfferOrder'),

  // Shipping Order Form
  orderForm: document.getElementById('orderForm'),
  inputFullName: document.getElementById('orderFullName'),
  inputPhone: document.getElementById('orderPhone'),
  inputEmail: document.getElementById('orderEmail'),
  inputQuantity: document.getElementById('orderQuantity'),
  inputProduct: document.getElementById('orderProduct'),
  selectGov: document.getElementById('orderGovernorate'),
  inputAddress: document.getElementById('orderAddress'),
  inputNotes: document.getElementById('orderNotes'),
  btnSubmitWhatsApp: document.getElementById('btnSubmitWhatsApp'),

  // Floating & UI
  scrollTopBtn: document.getElementById('scrollTopBtn'),
  toastContainer: document.getElementById('toastContainer'),
  currentYearSpan: document.getElementById('currentYear')
};

/* ==========================================================================
   5. UI STATE & FILTERING
   ========================================================================== */
let allProducts = [];
let activeCategory = "all";
let searchQuery = "";
let countdownInterval = null;
let currentSelectedProduct = null;

/* ==========================================================================
   6. DYNAMIC CATALOG RENDERING
   ========================================================================== */

/**
 * Filter and render products in the catalog grid
 */
function renderCatalog() {
  if (!DOM.productsGrid) return;

  // Filter products based on search term & active category
  const filtered = allProducts.filter(item => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q || 
      item.name.toLowerCase().includes(q) || 
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  // Handle empty state
  if (filtered.length === 0) {
    DOM.productsGrid.innerHTML = "";
    DOM.emptyState.style.display = "block";
    return;
  }

  DOM.emptyState.style.display = "none";

  // Build cards HTML
  const cardsHtml = filtered.map(product => {
    const isAvailable = product.available !== false;
    const hasDiscount = product.oldPrice && parseFloat(product.oldPrice) > parseFloat(product.price);
    const discountPercent = hasDiscount 
      ? Math.round(((parseFloat(product.oldPrice) - parseFloat(product.price)) / parseFloat(product.oldPrice)) * 100) 
      : 0;

    return `
      <article class="product-card" data-id="${product.id}">
        <div class="product-thumb-wrap">
          <img 
            src="${product.image || STORE_CONFIG.fallbackImage}" 
            alt="${product.name}" 
            class="product-thumb" 
            loading="lazy"
            onerror="this.onerror=null; this.src='images/products/phone-repair.svg';"
          >
          <div class="product-badges">
            ${hasDiscount ? `<span class="badge-discount">خصم ${discountPercent}%-</span>` : `<span></span>`}
            <span class="badge-stock ${isAvailable ? 'in-stock' : 'out-of-stock'}">
              ${isAvailable ? 'متوفر' : 'نفد مؤقتاً'}
            </span>
          </div>
        </div>

        <div class="product-content">
          <span class="product-category-tag">${product.category || 'إلكترونيات'}</span>
          <h3 class="product-name">${escapeHTML(product.name)}</h3>
          <p class="product-short-desc">${escapeHTML(product.description || '')}</p>

          <div class="product-price-box">
            ${product.price ? `
              <span class="current-price">${product.price} <small>ج.م</small></span>
            ` : `<span class="current-price" style="font-size: 1.05rem;">تواصل للسعر</span>`}
            
            ${hasDiscount ? `
              <span class="old-price">${product.oldPrice} ج.م</span>
            ` : ''}
          </div>

          <div class="product-actions">
            <button type="button" class="btn-details" onclick="openProductModal(${product.id})">
              عرض التفاصيل
            </button>
            <button 
              type="button" 
              class="btn-quick-order" 
              onclick="orderViaWhatsAppDirect(${product.id})" 
              title="طلب سريع عبر واتساب"
              aria-label="طلب عبر واتساب"
            >
              💬
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  DOM.productsGrid.innerHTML = cardsHtml;
}

/**
 * Sanitize string to prevent basic XSS
 */
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

/* ==========================================================================
   7. PRODUCT DETAILS MODAL LOGIC
   ========================================================================== */

/**
 * Open modal for a specific product
 */
window.openProductModal = function(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  currentSelectedProduct = product;

  DOM.modalImg.src = product.image || STORE_CONFIG.fallbackImage;
  DOM.modalImg.alt = product.name;
  DOM.modalCategory.textContent = product.category || 'منتج إلكتروني';
  DOM.modalTitle.textContent = product.name;
  
  if (product.price) {
    DOM.modalPrice.innerHTML = `${product.price} <small style="font-size: 1rem; color: #cbd5e1;">ج.م</small>`;
  } else {
    DOM.modalPrice.textContent = 'تواصل للاستفسار';
  }

  if (product.oldPrice && parseFloat(product.oldPrice) > parseFloat(product.price)) {
    DOM.modalOldPrice.textContent = `${product.oldPrice} ج.م`;
    DOM.modalOldPrice.style.display = 'inline';
  } else {
    DOM.modalOldPrice.style.display = 'none';
  }

  const isAvailable = product.available !== false;
  DOM.modalStock.className = `badge-stock ${isAvailable ? 'in-stock' : 'out-of-stock'}`;
  DOM.modalStock.textContent = isAvailable ? 'متوفر وجاهز للتسليم والشحن' : 'غير متوفر حالياً';

  DOM.modalDesc.textContent = product.description || 'لا يوجد وصف إضافي.';

  // Populate features list
  if (Array.isArray(product.features) && product.features.length > 0) {
    DOM.modalFeatures.innerHTML = product.features.map(f => `<li>${escapeHTML(f)}</li>`).join('');
  } else {
    DOM.modalFeatures.innerHTML = `
      <li>منتج أصلي خاضع للفحص المباشر</li>
      <li>ضمان معتمد من متجر Dar Elsalam Store</li>
      <li>إمكانية المعاينة قبل الاستلام</li>
    `;
  }

  DOM.productModal.classList.add('open');
  DOM.productModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
};

/**
 * Close modal
 */
function closeProductModal() {
  if (!DOM.productModal) return;
  DOM.productModal.classList.remove('open');
  DOM.productModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  currentSelectedProduct = null;
}

/**
 * Direct WhatsApp button from inside modal
 */
function handleModalWhatsAppOrder() {
  if (!currentSelectedProduct) return;
  const message = `مرحباً Dar Elsalam Store 👋\nأود الاستفسار وطلب هذا المنتج:\n- الاسم: ${currentSelectedProduct.name}\n- السعر: ${currentSelectedProduct.price ? currentSelectedProduct.price + ' ج.م' : 'استفسار'}\n- التصنيف: ${currentSelectedProduct.category}\nهل هو متوفر حالياً لتأكيد الشحن؟`;
  const url = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Quick fill into shipping form from inside modal
 */
function handleModalFillShippingForm() {
  if (!currentSelectedProduct) return;
  closeProductModal();
  DOM.inputProduct.value = currentSelectedProduct.name;
  
  // Smooth scroll to shipping form
  const shippingSection = document.getElementById('shipping');
  if (shippingSection) {
    shippingSection.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      DOM.inputFullName.focus();
    }, 600);
  }
}

/**
 * Quick direct WhatsApp order button from catalog card
 */
window.orderViaWhatsAppDirect = function(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  const message = `مرحباً Dar Elsalam Store 👋\nأود طلب المنتج التالي:\n- المنتج: ${product.name}\n- السعر: ${product.price || 'حسب التوفر'} ج.م\nأرجو إفادتي بتفاصيل الشحن والتأكيد.`;
  const url = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

/* ==========================================================================
   8. OPENING OFFERS & COUNTDOWN TIMER
   ========================================================================== */

/**
 * Initialize and run live countdown for the opening offer
 */
function initOpeningOffer() {
  const offer = getStoredOffer();
  if (!offer) return;

  // Apply offer details to DOM
  if (DOM.offerTitleText) DOM.offerTitleText.textContent = offer.title || DEFAULT_OFFER.title;
  if (DOM.offerDescText) DOM.offerDescText.textContent = offer.description || DEFAULT_OFFER.description;
  if (DOM.offerNewPriceText) DOM.offerNewPriceText.innerHTML = `${offer.newPrice} <small style="font-size: 1rem; color: #cbd5e1;">ج.م</small>`;
  if (DOM.offerOldPriceText) DOM.offerOldPriceText.textContent = `${offer.oldPrice} ج.م`;
  if (DOM.offerDiscountText) DOM.offerDiscountText.textContent = offer.discountBadge || "عرض حصري";
  if (DOM.offerBannerImg && offer.image) DOM.offerBannerImg.src = offer.image;

  // If offer is explicitly disabled by owner
  if (offer.enabled === false) {
    markOfferExpired("تم إيقاف العرض مؤقتاً");
    return;
  }

  // Calculate countdown
  const targetDate = new Date(offer.expiresAt).getTime();
  if (isNaN(targetDate)) {
    markOfferExpired("تاريخ انتهاء غير محدد");
    return;
  }

  // Clear previous interval if active
  if (countdownInterval) clearInterval(countdownInterval);

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      clearInterval(countdownInterval);
      markOfferExpired("انتهى العرض");
      return;
    }

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    DOM.timerDays.textContent = String(days).padStart(2, '0');
    DOM.timerHours.textContent = String(hours).padStart(2, '0');
    DOM.timerMinutes.textContent = String(minutes).padStart(2, '0');
    DOM.timerSeconds.textContent = String(seconds).padStart(2, '0');
  };

  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
}

/**
 * Handle expired offer state
 */
function markOfferExpired(reasonText) {
  if (DOM.offerCard) DOM.offerCard.classList.add('expired');
  if (DOM.offerExpiredNotice) {
    DOM.offerExpiredNotice.querySelector('strong').textContent = reasonText || "انتهى العرض";
    DOM.offerExpiredNotice.style.display = 'block';
  }
}

/* ==========================================================================
   9. SHIPPING & ORDER FORM VALIDATION + WHATSAPP SUBMISSION
   ========================================================================== */

/**
 * Validates Egyptian mobile phone number or general international numbers
 */
function isValidPhone(phone) {
  const clean = phone.trim().replace(/[\s\-\(\)]/g, '');
  // Egyptian mobile regex: starts with 010, 011, 012, 015, or +201...
  const egPattern = /^(01[0125][0-9]{8}|(\+?20)1[0125][0-9]{8})$/;
  return egPattern.test(clean) || clean.length >= 8;
}

/**
 * Validates Email syntax
 */
function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email.trim());
}

/**
 * Validate form inputs and toggle Arabic error messages
 */
function validateOrderForm() {
  let isValid = true;

  // 1. Full Name (Required)
  const nameVal = DOM.inputFullName.value.trim();
  const groupName = document.getElementById('groupFullName');
  if (!nameVal || nameVal.length < 2) {
    groupName.classList.add('has-error');
    DOM.inputFullName.classList.add('error');
    isValid = false;
  } else {
    groupName.classList.remove('has-error');
    DOM.inputFullName.classList.remove('error');
  }

  // 2. Phone (Required)
  const phoneVal = DOM.inputPhone.value.trim();
  const groupPhone = document.getElementById('groupPhone');
  if (!isValidPhone(phoneVal)) {
    groupPhone.classList.add('has-error');
    DOM.inputPhone.classList.add('error');
    isValid = false;
  } else {
    groupPhone.classList.remove('has-error');
    DOM.inputPhone.classList.remove('error');
  }

  // 3. Email (Required)
  const emailVal = DOM.inputEmail.value.trim();
  const groupEmail = document.getElementById('groupEmail');
  if (!isValidEmail(emailVal)) {
    groupEmail.classList.add('has-error');
    DOM.inputEmail.classList.add('error');
    isValid = false;
  } else {
    groupEmail.classList.remove('has-error');
    DOM.inputEmail.classList.remove('error');
  }

  // 4. Product (Required)
  const productVal = DOM.inputProduct.value.trim();
  const groupProduct = document.getElementById('groupProduct');
  if (!productVal) {
    groupProduct.classList.add('has-error');
    DOM.inputProduct.classList.add('error');
    isValid = false;
  } else {
    groupProduct.classList.remove('has-error');
    DOM.inputProduct.classList.remove('error');
  }

  return isValid;
}

/**
 * Collect all data from the order form
 */
function getFormData() {
  return {
    fullName: DOM.inputFullName.value.trim(),
    phone: DOM.inputPhone.value.trim(),
    email: DOM.inputEmail.value.trim(),
    quantity: DOM.inputQuantity.value || "1",
    product: DOM.inputProduct.value.trim(),
    governorate: DOM.selectGov.value,
    address: DOM.inputAddress.value.trim() || "غير محدد",
    notes: DOM.inputNotes.value.trim() || "لا توجد ملاحظات"
  };
}

/**
 * Generate formatted WhatsApp message and open link
 */
function submitViaWhatsApp() {
  if (!validateOrderForm()) {
    showToast("يرجى التأكد من استكمال البيانات الإلزامية المطلوبة", "error");
    return;
  }

  const data = getFormData();
  saveCustomerOrder(data);

  const message = 
    `🛍️ *طلب جديد عبر موقع Dar Elsalam Store*\n` +
    `----------------------------------\n` +
    `👤 *اسم العميل:* ${data.fullName}\n` +
    `📱 *رقم الهاتف:* ${data.phone}\n` +
    `✉️ *البريد الإلكتروني:* ${data.email}\n` +
    `📦 *المنتج المطلوب:* ${data.product}\n` +
    `🔢 *الكمية:* ${data.quantity}\n` +
    `📍 *المحافظة:* ${data.governorate}\n` +
    `🏠 *العنوان:* ${data.address}\n` +
    `📝 *الملاحظات:* ${data.notes}\n` +
    `----------------------------------\n` +
    `يرجى تأكيد استلام الطلب وموعد التوصيل. شكراً لك!`;

  const waUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');

  showToast("تم فتح محادثة الواتساب لتأكيد طلبك بنجاح! 🚀", "success");
}

/**
 * Submit locally (mock backend submission)
 */
function submitLocalOrder(e) {
  e.preventDefault();
  if (!validateOrderForm()) {
    showToast("يرجى ملء كافة الحقول المطلوبة بشكل صحيح", "error");
    return;
  }

  const data = getFormData();
  saveCustomerOrder(data);

  showToast(`شكراً لك يا ${data.fullName}، تم تسجيل طلبك بنجاح وسيتواصل معك مندوبنا قريباً!`, "success");
  DOM.orderForm.reset();
  DOM.selectGov.value = "الإسكندرية";
  DOM.inputQuantity.value = "1";
}

/* ==========================================================================
   10. TOAST NOTIFICATIONS HELPER
   ========================================================================== */
function showToast(message, type = "success") {
  if (!DOM.toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : '⚠️'}</span>
    <span>${escapeHTML(message)}</span>
  `;

  DOM.toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 4000);
}

/* ==========================================================================
   11. NAVIGATION & MOBILE DRAWER
   ========================================================================== */
function toggleMobileDrawer(open) {
  if (open) {
    DOM.mobileDrawer.classList.add('open');
    DOM.mobileOverlay.classList.add('open');
    DOM.hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  } else {
    DOM.mobileDrawer.classList.remove('open');
    DOM.mobileOverlay.classList.remove('open');
    DOM.hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   12. EVENT LISTENERS SETUP
   ========================================================================== */
function setupEventListeners() {
  // Sticky Header on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      DOM.header.classList.add('scrolled');
    } else {
      DOM.header.classList.remove('scrolled');
    }

    // Scroll to top button visibility
    if (window.scrollY > 450) {
      DOM.scrollTopBtn.classList.add('visible');
    } else {
      DOM.scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  // Scroll to top action
  DOM.scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Mobile Drawer toggles
  DOM.hamburgerBtn.addEventListener('click', () => toggleMobileDrawer(true));
  DOM.closeDrawerBtn.addEventListener('click', () => toggleMobileDrawer(false));
  DOM.mobileOverlay.addEventListener('click', () => toggleMobileDrawer(false));

  // Close mobile drawer when clicking any link
  DOM.mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileDrawer(false));
  });

  // Search input live filtering
  DOM.searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderCatalog();
  });

  // Category filter pills
  DOM.categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      DOM.categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-category');
      renderCatalog();
    });
  });

  // Reset filter button in empty state
  if (DOM.resetFiltersBtn) {
    DOM.resetFiltersBtn.addEventListener('click', () => {
      DOM.searchInput.value = '';
      searchQuery = '';
      activeCategory = 'all';
      DOM.categoryPills.forEach(p => {
        if (p.getAttribute('data-category') === 'all') p.classList.add('active');
        else p.classList.remove('active');
      });
      renderCatalog();
    });
  }

  // Modal interactions
  DOM.modalCloseBtn.addEventListener('click', closeProductModal);
  DOM.productModal.addEventListener('click', (e) => {
    if (e.target === DOM.productModal) closeProductModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && DOM.productModal.classList.contains('open')) {
      closeProductModal();
    }
  });

  DOM.modalOrderWhatsAppBtn.addEventListener('click', handleModalWhatsAppOrder);
  DOM.modalFillFormBtn.addEventListener('click', handleModalFillShippingForm);

  // Offer CTA button: prefill shipping form
  if (DOM.btnOfferOrder) {
    DOM.btnOfferOrder.addEventListener('click', (e) => {
      const offer = getStoredOffer();
      if (offer && offer.title) {
        DOM.inputProduct.value = offer.title;
      }
    });
  }

  // Order Form handlers
  DOM.btnSubmitWhatsApp.addEventListener('click', submitViaWhatsApp);
  DOM.orderForm.addEventListener('submit', submitLocalOrder);

  // Dynamic Year in footer
  if (DOM.currentYearSpan) {
    DOM.currentYearSpan.textContent = new Date().getFullYear();
  }

  // Listen to Storage events (synchronize across open tabs if admin makes changes)
  window.addEventListener('storage', (e) => {
    if (e.key === STORE_CONFIG.STORAGE_KEYS.PRODUCTS) {
      allProducts = getStoredProducts();
      renderCatalog();
    }
    if (e.key === STORE_CONFIG.STORAGE_KEYS.OFFER) {
      initOpeningOffer();
    }
  });
}

/* ==========================================================================
   13. INITIALIZATION ON DOM READY
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Load products
  allProducts = getStoredProducts();
  
  // Render catalog
  renderCatalog();

  // Initialize countdown offer
  initOpeningOffer();

  // Setup UI listeners
  setupEventListeners();

  console.log(`%c🚀 ${STORE_CONFIG.name} Store loaded successfully.`, "color: #00e5ff; font-weight: bold; font-size: 14px;");
});
