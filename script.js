/**
 * ==========================================================================
 * DAR ELSALAM STORE - Official Frontend Logic (Pure Vanilla JavaScript)
 * Firebase Firestore is the PRIMARY data source.
 * localStorage is used only as an offline cache / fallback.
 * Interactive Catalog, Live Search, Countdown Timer & WhatsApp Ordering
 * ==========================================================================
 */

'use strict';

const STORE_CONFIG = {
  name: "Dar Elsalam Store",
  phone: "01008991290",
  whatsappNumber: "201008991290",
  instapayNumber: "+201210824115",
  siteUrl: "https://mohanedhalim42-star.github.io/MohanedMohamed/",
  developer: {
    name: "Eng/ Mohaned Halim",
    phone: "01220702077",
    whatsapp: "https://wa.me/201220702077"
  }
};

const STORAGE_KEYS = {
  PRODUCTS: "dar_elsalam_products_v1",
  OFFERS: "dar_elsalam_offers_v1",
  OFFER: "dar_elsalam_offer_v1",
  ORDERS: "dar_elsalam_orders_v1",
  CART: "dar_elsalam_cart_v1",
  SHIPPING_RATES: "dar_elsalam_shipping_rates_v1"
};

// Default shipping rates for all 27 Egyptian governorates (used as baseline and fallback)
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
const offerTimerIntervals = new Map();
let cartItems = [];
let receiptBase64Buffer = "";

/* ==========================================================================
   DOM ELEMENTS
   ========================================================================== */
// Cart Elements
const openCartBtn = document.getElementById('openCartBtn');
const openCartMobileBtn = document.getElementById('openCartMobileBtn');
const cartOverlay = document.getElementById('cartOverlay');
const cartDrawer = document.getElementById('cartDrawer');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartCountBadge = document.getElementById('cartCountBadge');
const cartCountMobileBadge = document.getElementById('cartCountMobileBadge');
const cartDrawerCount = document.getElementById('cartDrawerCount');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartSubtotal = document.getElementById('cartSubtotal');
const btnProceedCheckout = document.getElementById('btnProceedCheckout');
const btnClearCart = document.getElementById('btnClearCart');
const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');

// Checkout & InstaPay Elements
const checkoutCartSummary = document.getElementById('checkoutCartSummary');
const checkoutItemsCount = document.getElementById('checkoutItemsCount');
const checkoutItemsList = document.getElementById('checkoutItemsList');
const btnEditCartFromCheckout = document.getElementById('btnEditCartFromCheckout');
const summaryProductsTotal = document.getElementById('summaryProductsTotal');
const summaryGovName = document.getElementById('summaryGovName');
const summaryShippingFee = document.getElementById('summaryShippingFee');
const summaryGrandTotal = document.getElementById('summaryGrandTotal');
const btnCopyInstapay = document.getElementById('btnCopyInstapay');
const copyInstapayIcon = document.getElementById('copyInstapayIcon');
const copyInstapayText = document.getElementById('copyInstapayText');
const instapayPhoneDisplay = document.getElementById('instapayPhoneDisplay');
const receiptFileInput = document.getElementById('receiptFileInput');
const receiptDropzone = document.getElementById('receiptDropzone');
const dropzonePrompt = document.getElementById('dropzonePrompt');
const receiptPreviewBox = document.getElementById('receiptPreviewBox');
const receiptPreviewImg = document.getElementById('receiptPreviewImg');
const receiptFileNameDisplay = document.getElementById('receiptFileNameDisplay');
const btnRemoveReceipt = document.getElementById('btnRemoveReceipt');
const receiptErrorMsg = document.getElementById('receiptErrorMsg');
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

// Offers Elements (Multi-Offer System)
const offersContainer = document.getElementById('offersContainer');
const offersLoadingState = document.getElementById('offersLoadingState');
const offersEmptyState = document.getElementById('offersEmptyState');

/* ==========================================================================
   1. PRODUCTS CATALOG & FILTERING
   ========================================================================== */

/**
 * Initialize products – displays loading state and waits for Firestore onSnapshot.
 * ZERO reliance on LocalStorage to prevent ghost/flickering products.
 */
function initProducts() {
  // If Firestore onSnapshot already arrived before DOMContentLoaded
  if (window._pendingFirestoreProducts) {
    storeProducts = window._pendingFirestoreProducts;
    renderProducts();
    return;
  }

  // Display clean loading state in productsGrid until onSnapshot responds
  if (productsGrid) {
    productsGrid.innerHTML = `
      <div class="products-loading-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
        <div class="loading-spinner" style="width: 44px; height: 44px; border: 3px solid rgba(0, 229, 255, 0.2); border-top-color: var(--accent-cyan); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="color: var(--text-secondary); font-size: 1.05rem;">جاري تحميل المنتجات مباشرة من قاعدة البيانات...</p>
      </div>
    `;
    productsGrid.style.display = 'grid';
    if (emptyStateContainer) emptyStateContainer.style.display = 'none';
  }
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
    if (emptyStateContainer) {
      const emptyTitle = emptyStateContainer.querySelector('.empty-title');
      const emptyDesc = emptyStateContainer.querySelector('.empty-desc');
      if (storeProducts.length === 0) {
        if (emptyTitle) emptyTitle.textContent = "لا توجد منتجات متوفرة حالياً";
        if (emptyDesc) emptyDesc.textContent = "سيتم إضافة منتجات جديدة قريباً، تفضل بالتواصل معنا عبر واتساب للاستفسار.";
      } else {
        if (emptyTitle) emptyTitle.textContent = "لم نجد منتجات مطابقة لبحثك";
        if (emptyDesc) emptyDesc.textContent = "جرب استخدام كلمات بحث مختلفة أو اضغط على تصنيف \"الكل\".";
      }
      emptyStateContainer.style.display = 'block';
    }
    return;
  }

  productsGrid.style.display = 'grid';
  if (emptyStateContainer) emptyStateContainer.style.display = 'none';

  productsGrid.innerHTML = filtered.map(item => `
    <article class="product-card" data-id="${escapeHTML(String(item.id))}">
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
          <button type="button" class="btn-product-cart" onclick="window.darAddToCart('${escapeHTML(String(item.id))}', 1, event)" title="إضافة لعربة التسوق">
            <span>أضف للسلة</span> 🛒
          </button>
          <button type="button" class="btn-product-details" onclick="window.darOpenProductModal('${escapeHTML(String(item.id))}')" title="عرض التفاصيل والمواصفات">
            التفاصيل
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
  const product = storeProducts.find(p => String(p.id) === String(productId));
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

  // Add to Cart from Details Modal
  if (modalAddToCartBtn) {
    modalAddToCartBtn.onclick = (e) => {
      window.darAddToCart(product, 1, e);
      closeProductModal();
    };
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
      window.darAddToCart(product, 1);
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
   2. MULTI-OFFERS RENDERER & COUNTDOWN TIMERS
   ========================================================================== */

/**
 * Clear all active offer countdown timers to prevent memory leaks
 */
function clearAllOfferTimers() {
  offerTimerIntervals.forEach((intervalId) => clearInterval(intervalId));
  offerTimerIntervals.clear();
}

/**
 * Start an individual countdown timer for a specific offer card
 */
function startOfferCountdown(offerId, expiresAt) {
  const timerEl = document.getElementById(`offerTimer-${offerId}`);
  const expiredEl = document.getElementById(`offerExpired-${offerId}`);
  const countdownEl = document.getElementById(`offerCountdown-${offerId}`);
  const orderBtnEl = document.getElementById(`offerOrderBtn-${offerId}`);

  if (!timerEl) return;

  const targetTime = expiresAt ? new Date(expiresAt).getTime() : (Date.now() + 7 * 86400000);

  function update() {
    const distance = targetTime - Date.now();
    const pad = n => String(Math.max(0, n)).padStart(2, '0');

    if (distance <= 0) {
      if (offerTimerIntervals.has(offerId)) {
        clearInterval(offerTimerIntervals.get(offerId));
        offerTimerIntervals.delete(offerId);
      }
      if (countdownEl) countdownEl.style.display = 'none';
      if (expiredEl) expiredEl.style.display = 'block';
      if (orderBtnEl) {
        orderBtnEl.style.opacity = '0.5';
        orderBtnEl.style.pointerEvents = 'none';
      }
      return;
    }

    if (countdownEl) countdownEl.style.display = 'block';
    if (expiredEl) expiredEl.style.display = 'none';
    if (orderBtnEl) {
      orderBtnEl.style.opacity = '1';
      orderBtnEl.style.pointerEvents = 'auto';
    }

    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);

    timerEl.innerHTML = `
      <div class="offer-multi-timer-box"><div class="offer-multi-timer-num">${pad(days)}</div><div class="offer-multi-timer-unit">الأيام</div></div>
      <div class="offer-multi-timer-box"><div class="offer-multi-timer-num">${pad(hours)}</div><div class="offer-multi-timer-unit">الساعات</div></div>
      <div class="offer-multi-timer-box"><div class="offer-multi-timer-num">${pad(minutes)}</div><div class="offer-multi-timer-unit">الدقائق</div></div>
      <div class="offer-multi-timer-box"><div class="offer-multi-timer-num">${pad(seconds)}</div><div class="offer-multi-timer-unit">الثواني</div></div>
    `;
  }

  update();
  const intervalId = setInterval(update, 1000);
  offerTimerIntervals.set(offerId, intervalId);
}

/**
 * Render all offers dynamically into offersContainer
 */
function renderOffers(offers) {
  if (!offersContainer) return;

  // Hide loading indicator
  if (offersLoadingState) offersLoadingState.style.display = 'none';

  // Clear running timers
  clearAllOfferTimers();

  const validOffers = Array.isArray(offers) ? offers : [];

  if (validOffers.length === 0) {
    if (offersEmptyState) offersEmptyState.style.display = 'block';
    const existingCards = offersContainer.querySelectorAll('.offer-card-multi');
    existingCards.forEach(el => el.remove());
    return;
  }

  if (offersEmptyState) offersEmptyState.style.display = 'none';

  // Remove existing offer cards (keep loading/empty containers)
  const existingCards = offersContainer.querySelectorAll('.offer-card-multi');
  existingCards.forEach(el => el.remove());

  validOffers.forEach(offer => {
    const safeId = escapeHTML(String(offer.id));
    const isExpired = offer.expiresAt && new Date(offer.expiresAt).getTime() <= Date.now();

    // Discount percentage calculation
    let discountBadge = '';
    const numOld = Number(offer.oldPrice);
    const numNew = Number(offer.newPrice);
    if (numOld > 0 && numNew > 0 && numOld > numNew) {
      const discountPercent = Math.round((1 - (numNew / numOld)) * 100);
      const savings = numOld - numNew;
      discountBadge = `وفر ${savings} ج.م (${discountPercent}%-)`;
    }

    const waMsg = encodeURIComponent(`مرحباً Dar Elsalam Store، أريد الاستفادة من العرض: ${offer.title} (بسعر: ${offer.newPrice} ج.م)`);

    const cardEl = document.createElement('article');
    cardEl.className = 'offer-card-multi';
    cardEl.dataset.offerId = String(offer.id);

    cardEl.innerHTML = `
      <div class="offer-card-multi-img-wrap">
        <img src="${escapeHTML(offer.image || 'images/offers/launch-offer.svg')}"
             alt="${escapeHTML(offer.title)}"
             class="offer-card-multi-img"
             loading="lazy"
             onerror="this.src='images/offers/launch-offer.svg'">
      </div>
      <div class="offer-card-multi-content">
        <div class="offer-multi-badge">🔥 عرض افتتاح حصري لفترة محدودة</div>
        <h3 class="offer-multi-title">${escapeHTML(offer.title)}</h3>
        <div class="offer-multi-price-row">
          <span class="offer-multi-new-price">${escapeHTML(String(offer.newPrice))} <small style="font-size: 1rem; color: #cbd5e1;">ج.م</small></span>
          ${offer.oldPrice ? `<span class="offer-multi-old-price">${escapeHTML(String(offer.oldPrice))} ج.م</span>` : ''}
          ${discountBadge ? `<span class="offer-multi-discount-badge">${escapeHTML(discountBadge)}</span>` : ''}
        </div>
        <div class="offer-multi-countdown" id="offerCountdown-${safeId}" ${isExpired ? 'style="display:none"' : ''}>
          <div class="offer-multi-countdown-label">⏱️ ينتهي هذا العرض خلال:</div>
          <div class="offer-multi-timer" id="offerTimer-${safeId}"></div>
        </div>
        <div class="offer-multi-expired" id="offerExpired-${safeId}" ${!isExpired ? 'style="display:none"' : ''}>
          ⏳ انتهى هذا العرض — ترقبوا عروضنا القادمة قريباً
        </div>
        <div class="offer-multi-actions">
          <a href="#shipping" class="btn btn-primary" id="offerOrderBtn-${safeId}"
             style="background: linear-gradient(135deg, #ff416c, #ff4b2b); box-shadow: var(--glow-fire); ${isExpired ? 'opacity:0.5;pointer-events:none;' : ''}">
            <span>اطلب هذا العرض الآن</span>
            <span>⚡</span>
          </a>
          <a href="https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${waMsg}"
             target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">
            <span>حجز عبر واتساب</span>
          </a>
        </div>
      </div>
    `;

    // Hook order button click to pre-fill orderProduct and scroll
    const orderBtn = cardEl.querySelector(`#offerOrderBtn-${safeId}`);
    if (orderBtn) {
      orderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (orderProduct) {
          orderProduct.value = offer.title || "عرض الافتتاح الخاص";
        }
        const shippingSection = document.getElementById('shipping');
        if (shippingSection) {
          shippingSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    offersContainer.appendChild(cardEl);

    // Start timer if not expired
    if (!isExpired) {
      startOfferCountdown(offer.id, offer.expiresAt);
    }
  });
}

/**
 * Initialize offers – checks pending snapshot or localStorage fallback
 */
function initOffers() {
  if (Array.isArray(window._pendingFirestoreOffers)) {
    renderOffers(window._pendingFirestoreOffers);
    return;
  }

  const cached = localStorage.getItem(STORAGE_KEYS.OFFERS);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        renderOffers(parsed);
      }
    } catch { /* ignore */ }
  }
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
   4. SHOPPING CART SYSTEM & CHECKOUT FLOW
   ========================================================================== */

/**
 * Initialize Cart from LocalStorage
 */
function initCart() {
  const raw = localStorage.getItem(STORAGE_KEYS.CART);
  if (raw) {
    try {
      cartItems = JSON.parse(raw);
      if (!Array.isArray(cartItems)) cartItems = [];
    } catch {
      cartItems = [];
    }
  } else {
    cartItems = [];
  }
  renderCartUI();
  setupCartEventListeners();
  setupCheckoutEventListeners();
}

/**
 * Save Cart to LocalStorage and update UI
 */
function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
  } catch (err) {
    console.warn("Could not save cart to localStorage:", err);
  }
  renderCartUI();
}

/**
 * Total quantity of items in cart
 */
function getCartCount() {
  return cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
}

/**
 * Total price of items in cart
 */
function getCartSubtotal() {
  return cartItems.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 1;
    return sum + (price * qty);
  }, 0);
}

/**
 * Open Cart Drawer
 */
function openCartDrawer() {
  if (cartDrawer && cartOverlay) {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Close Cart Drawer
 */
function closeCartDrawer() {
  if (cartDrawer && cartOverlay) {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/**
 * Add Product to Cart
 */
window.darAddToCart = function(productOrId, qty = 1, event) {
  if (event) {
    event.stopPropagation();
    const btn = event.currentTarget;
    if (btn) {
      btn.classList.add('btn-added-pop');
      setTimeout(() => btn.classList.remove('btn-added-pop'), 400);
    }
  }

  let product = null;
  if (typeof productOrId === 'object' && productOrId !== null) {
    product = productOrId;
  } else {
    product = storeProducts.find(p => String(p.id) === String(productOrId));
  }

  if (!product) return;

  const existingIndex = cartItems.findIndex(item => String(item.id) === String(product.id));
  if (existingIndex !== -1) {
    cartItems[existingIndex].quantity = (Number(cartItems[existingIndex].quantity) || 1) + qty;
  } else {
    cartItems.push({
      id: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      image: product.image || 'images/products/phone-repair.svg',
      category: product.category || 'إلكترونيات',
      quantity: qty
    });
  }

  saveCart();
  showToast(`✓ تمت إضافة "${product.name.slice(0, 26)}..." إلى عربة التسوق`);
  
  // Animate badge
  if (cartCountBadge) {
    cartCountBadge.classList.add('badge-bounce');
    setTimeout(() => cartCountBadge.classList.remove('badge-bounce'), 500);
  }
};

/**
 * Update Cart Item Quantity
 */
window.darUpdateCartItemQty = function(productId, delta) {
  const index = cartItems.findIndex(item => String(item.id) === String(productId));
  if (index === -1) return;

  cartItems[index].quantity = (Number(cartItems[index].quantity) || 1) + delta;
  if (cartItems[index].quantity <= 0) {
    cartItems.splice(index, 1);
  }
  saveCart();
};

/**
 * Remove Item from Cart
 */
window.darRemoveFromCart = function(productId) {
  cartItems = cartItems.filter(item => String(item.id) !== String(productId));
  saveCart();
};

/**
 * Clear Entire Cart
 */
function clearCart() {
  if (cartItems.length === 0) return;
  if (confirm('هل أنت متأكد من تفريغ جميع محتويات عربة التسوق؟')) {
    cartItems = [];
    saveCart();
    showToast('تم تفريغ عربة التسوق بنجاح');
  }
}

/**
 * Render Cart UI (Drawer & Checkout Sync)
 */
function renderCartUI() {
  const count = getCartCount();
  const subtotal = getCartSubtotal();

  // Badges
  if (cartCountBadge) cartCountBadge.textContent = count;
  if (cartCountMobileBadge) cartCountMobileBadge.textContent = count;
  if (cartDrawerCount) cartDrawerCount.textContent = count;
  if (checkoutItemsCount) checkoutItemsCount.textContent = count;

  // Drawer Subtotal
  if (cartSubtotal) cartSubtotal.textContent = `${subtotal} ج.م`;

  // Drawer Items Container
  if (cartItemsContainer) {
    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <span class="cart-empty-icon">🛒</span>
          <h4>عربة التسوق فارغة حالياً</h4>
          <p>تصفح كتالوج المنتجات واختر ما يناسبك لتتمكن من إتمام الطلب والشحن.</p>
          <button type="button" class="btn btn-cyan" onclick="closeCartDrawer(); document.getElementById('products').scrollIntoView({behavior:'smooth'});" style="margin-top: 14px;">
            تصفح المنتجات الآن
          </button>
        </div>
      `;
    } else {
      cartItemsContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item-card" data-id="${escapeHTML(String(item.id))}">
          <img src="${escapeHTML(item.image || 'images/products/phone-repair.svg')}" alt="${escapeHTML(item.name)}" class="cart-item-img" onerror="this.src='images/products/phone-repair.svg'">
          <div class="cart-item-details">
            <h5 class="cart-item-title">${escapeHTML(item.name)}</h5>
            <div class="cart-item-price-unit">${Number(item.price) || 0} ج.م</div>
            <div class="cart-item-qty-row">
              <div class="cart-qty-ctrl">
                <button type="button" class="btn-qty-dec" onclick="window.darUpdateCartItemQty('${escapeHTML(String(item.id))}', -1)">−</button>
                <span class="cart-qty-num">${item.quantity || 1}</span>
                <button type="button" class="btn-qty-inc" onclick="window.darUpdateCartItemQty('${escapeHTML(String(item.id))}', 1)">+</button>
              </div>
              <div class="cart-item-total-price">${(Number(item.price) || 0) * (item.quantity || 1)} ج.م</div>
            </div>
          </div>
          <button type="button" class="btn-cart-remove" onclick="window.darRemoveFromCart('${escapeHTML(String(item.id))}')" title="حذف من السلة">✕</button>
        </div>
      `).join('');
    }
  }

  // Sync Checkout Items Summary
  renderCheckoutSummary();
}

/**
 * Render Cart Summary inside Checkout Form Section
 */
function renderCheckoutSummary() {
  if (!checkoutCartSummary) return;

  if (cartItems.length === 0) {
    if (checkoutItemsList) {
      checkoutItemsList.innerHTML = `
        <div class="checkout-empty-cart-hint">
          <span>العربة فارغة حالياً. يرجى اختيار منتج أولاً لإتمام الشراء.</span>
          <a href="#products" class="btn btn-secondary btn-sm" style="margin-right: 8px;">تصفح الكتالوج ↗</a>
        </div>
      `;
    }
  } else {
    if (checkoutItemsList) {
      checkoutItemsList.innerHTML = cartItems.map(item => `
        <div class="checkout-item-row">
          <div class="checkout-item-title-wrap">
            <span class="checkout-item-qty-pill">${item.quantity || 1}×</span>
            <span class="checkout-item-name">${escapeHTML(item.name)}</span>
          </div>
          <span class="checkout-item-subtotal">${(Number(item.price) || 0) * (item.quantity || 1)} ج.م</span>
        </div>
      `).join('');
    }
  }

  updateCheckoutTotals();
}

/**
 * Update Financial Calculations in Checkout Card
 */
function updateCheckoutTotals() {
  const subtotal = getCartSubtotal();
  const gov = orderGovernorate ? orderGovernorate.value : 'الإسكندرية';
  const shippingFee = getShippingRateForGov(gov);
  const grandTotal = subtotal + shippingFee;

  if (summaryProductsTotal) summaryProductsTotal.textContent = `${subtotal} ج.م`;
  if (summaryGovName) summaryGovName.textContent = gov;
  if (summaryShippingFee) summaryShippingFee.textContent = `${shippingFee} ج.م`;
  if (summaryGrandTotal) summaryGrandTotal.textContent = `${grandTotal} ج.م`;
}

/**
 * Get Shipping Rate for Governorate (prefers realtime Firestore sync -> cache -> default)
 */
function getShippingRateForGov(govName) {
  if (window.darShippingRates && window.darShippingRates[govName] !== undefined) {
    return Number(window.darShippingRates[govName]) || 0;
  }
  const cached = localStorage.getItem(STORAGE_KEYS.SHIPPING_RATES);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed && parsed[govName] !== undefined) {
        return Number(parsed[govName]) || 0;
      }
    } catch {}
  }
  return DEFAULT_SHIPPING_RATES[govName] !== undefined ? DEFAULT_SHIPPING_RATES[govName] : 60;
}

// Hook called when Firestore shipping rates are updated in realtime
window.darUpdateShippingRatesUI = function(newRates) {
  updateCheckoutTotals();
};

/**
 * Setup Cart Event Listeners
 */
function setupCartEventListeners() {
  if (openCartBtn) openCartBtn.addEventListener('click', openCartDrawer);
  if (openCartMobileBtn) {
    openCartMobileBtn.addEventListener('click', () => {
      closeMobileDrawer();
      openCartDrawer();
    });
  }
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);
  if (btnClearCart) btnClearCart.addEventListener('click', clearCart);

  if (btnProceedCheckout) {
    btnProceedCheckout.addEventListener('click', () => {
      closeCartDrawer();
    });
  }

  if (btnEditCartFromCheckout) {
    btnEditCartFromCheckout.addEventListener('click', openCartDrawer);
  }
}

/**
 * Setup Checkout, InstaPay, and Receipt Listeners
 */
function setupCheckoutEventListeners() {
  // Governorate change -> update shipping rate live
  if (orderGovernorate) {
    orderGovernorate.addEventListener('change', updateCheckoutTotals);
  }

  // InstaPay quick copy
  if (btnCopyInstapay) {
    btnCopyInstapay.addEventListener('click', () => {
      const number = STORE_CONFIG.instapayNumber || "+201210824115";
      const copySuccess = () => {
        if (copyInstapayIcon) copyInstapayIcon.textContent = "✓";
        if (copyInstapayText) copyInstapayText.textContent = "تم النسخ!";
        btnCopyInstapay.classList.add('copied');
        showToast("✓ تم نسخ رقم InstaPay بنجاح (+201210824115)");
        setTimeout(() => {
          if (copyInstapayIcon) copyInstapayIcon.textContent = "📋";
          if (copyInstapayText) copyInstapayText.textContent = "نسخ الرقم";
          btnCopyInstapay.classList.remove('copied');
        }, 2500);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(number).then(copySuccess).catch(() => {
          fallbackCopyText(number);
          copySuccess();
        });
      } else {
        fallbackCopyText(number);
        copySuccess();
      }
    });
  }

  // Receipt File Upload with Canvas Compression
  if (receiptFileInput) {
    receiptFileInput.addEventListener('change', handleReceiptUpload);
  }

  if (btnRemoveReceipt) {
    btnRemoveReceipt.addEventListener('click', () => {
      receiptBase64Buffer = "";
      if (receiptFileInput) receiptFileInput.value = "";
      if (receiptPreviewBox) receiptPreviewBox.style.display = "none";
      if (dropzonePrompt) dropzonePrompt.style.display = "flex";
      if (receiptErrorMsg) receiptErrorMsg.style.display = "none";
    });
  }
}

/**
 * Process receipt image: read as DataURL and compress via Canvas to fit Firestore limits
 */
function handleReceiptUpload(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('يرجى اختيار ملف صورة صالح (JPG, PNG, WEBP).');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      // Compress image using Canvas
      const maxDim = 1000;
      let width = img.width;
      let height = img.height;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Quality 0.75 produces crisp receipts around 60-120KB
      receiptBase64Buffer = canvas.toDataURL('image/jpeg', 0.75);

      // Show preview
      if (receiptPreviewImg) receiptPreviewImg.src = receiptBase64Buffer;
      if (receiptFileNameDisplay) receiptFileNameDisplay.textContent = `✓ ${file.name} (${Math.round(file.size / 1024)} KB)`;
      if (receiptPreviewBox) receiptPreviewBox.style.display = "flex";
      if (dropzonePrompt) dropzonePrompt.style.display = "none";
      if (receiptErrorMsg) receiptErrorMsg.style.display = "none";
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

/**
 * Validate Checkout Form
 */
function validateOrderForm() {
  let isValid = true;

  const nameVal = orderFullName ? orderFullName.value.trim() : '';
  const phoneVal = orderPhone ? orderPhone.value.trim() : '';
  const addressVal = orderAddress ? orderAddress.value.trim() : '';

  // Name
  if (!nameVal) {
    setFieldError('groupFullName', true);
    isValid = false;
  } else {
    setFieldError('groupFullName', false);
  }

  // Phone (Egyptian mobile check)
  const phoneRegex = /^01[0125][0-9]{8}$/;
  const cleanPhone = phoneVal.replace(/[\s-]/g, '');
  if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
    setFieldError('groupPhone', true);
    isValid = false;
  } else {
    setFieldError('groupPhone', false);
  }

  // Address
  if (!addressVal) {
    setFieldError('groupAddress', true);
    isValid = false;
  } else {
    setFieldError('groupAddress', false);
  }

  // Cart must not be empty
  if (cartItems.length === 0) {
    showToast("⚠️ عربة التسوق فارغة! من فضلك أضف منتجات قبل إتمام الشراء.");
    isValid = false;
  }

  // Mandatory Receipt Check
  if (!receiptBase64Buffer) {
    if (receiptErrorMsg) receiptErrorMsg.style.display = 'block';
    const dropzone = document.getElementById('receiptDropzone');
    if (dropzone) dropzone.scrollIntoView({ behavior: 'smooth', block: 'center' });
    isValid = false;
  } else {
    if (receiptErrorMsg) receiptErrorMsg.style.display = 'none';
  }

  return isValid;
}

function setFieldError(groupId, hasError) {
  const el = document.getElementById(groupId);
  if (el) el.classList.toggle('has-error', hasError);
}

function getOrderPayload() {
  const subtotal = getCartSubtotal();
  const gov = orderGovernorate ? orderGovernorate.value : 'الإسكندرية';
  const shipping = getShippingRateForGov(gov);
  const grandTotal = subtotal + shipping;

  return {
    id: 'ORD-' + Date.now().toString(36).toUpperCase(),
    createdAt: new Date().toISOString(),
    fullName: orderFullName ? orderFullName.value.trim() : '',
    phone: orderPhone ? orderPhone.value.trim() : '',
    governorate: gov,
    address: orderAddress ? orderAddress.value.trim() : '',
    notes: orderNotes ? orderNotes.value.trim() : '',
    items: [...cartItems],
    itemsSubtotal: subtotal,
    shippingFee: shipping,
    grandTotal: grandTotal,
    receiptBase64: receiptBase64Buffer,
    paymentMethod: "InstaPay (تم تحويل مصاريف الشحن مسبقاً)",
    status: "قيد التحقق من الشحن"
  };
}

/**
 * Save order locally to localStorage as a cache backup
 */
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

// Local submit (Order confirmation)
if (orderForm) {
  orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateOrderForm()) {
      showToast("⚠️ من فضلك أكمل جميع البيانات المطلوبة وأرفق صورة إيصال InstaPay");
      return;
    }

    const order = getOrderPayload();

    // Disable submit button during processing
    const submitBtn = document.getElementById('btnSubmitLocal');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'جاري إرسال وتأكيد طلبك...';
    }

    try {
      // 1. Save to Firestore (PRIMARY)
      if (window.darSaveOrderToFirestore) {
        await window.darSaveOrderToFirestore(order);
      }

      // 2. Cache locally as backup
      saveOrderLocally(order);

      // 3. Clear cart
      cartItems = [];
      saveCart();

      // 4. Reset form & receipt
      orderForm.reset();
      receiptBase64Buffer = "";
      if (receiptFileInput) receiptFileInput.value = "";
      if (receiptPreviewBox) receiptPreviewBox.style.display = "none";
      if (dropzonePrompt) dropzonePrompt.style.display = "flex";

      showToast("✓ تم تأكيد طلبك بنجاح وجاري مراجعة إيصال التحويل! سيتواصل معك المندوب قريباً.");
      alert(`🎉 تم استلام طلبك بنجاح!\nرقم الطلب: ${order.id}\nتم إرفاق إيصال تحويل مصاريف الشحن بنجاح.\nسيتواصل معك فريق متجر دار السلام لتأكيد موعد التسليم.`);

    } catch (err) {
      console.error("Order submission error:", err);
      // Still save locally
      saveOrderLocally(order);
      showToast("✓ تم تسجيل الطلب محلياً وجاري المتابعة.");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>تأكيد الطلب وإرسال إيصال التحويل</span> <span>✓</span>';
      }
    }
  });
}

// WhatsApp Order Button
if (btnSubmitWhatsApp) {
  btnSubmitWhatsApp.addEventListener('click', async () => {
    if (!validateOrderForm()) {
      showToast("⚠️ من فضلك أكمل البيانات الإلزامية برقم هاتف صحيح وصورة إيصال التحويل");
      return;
    }

    const order = getOrderPayload();

    // Save to Firestore (PRIMARY)
    if (window.darSaveOrderToFirestore) {
      try {
        await window.darSaveOrderToFirestore(order);
      } catch {}
    }

    // Cache locally as backup
    saveOrderLocally(order);

    // Format items list for WhatsApp
    const itemsText = order.items.map(i => `• ${i.name} (الكمية: ${i.quantity}) - ${i.price * i.quantity} ج.م`).join('\n');

    const waMsg = `📦 *طلب شراء جديد من متجر دار السلام*
----------------------------------
🔢 *رقم الطلب:* ${order.id}
👤 *الاسم:* ${order.fullName}
📞 *الهاتف:* ${order.phone}
📍 *المحافظة:* ${order.governorate}
🏠 *العنوان:* ${order.address}
📝 *ملاحظات:* ${order.notes || 'لا يوجد'}
----------------------------------
🛒 *محتويات الطلب:*
${itemsText}
----------------------------------
💵 *إجمالي المنتجات:* ${order.itemsSubtotal} ج.م
🚚 *مصاريف الشحن (${order.governorate}):* ${order.shippingFee} ج.م
💰 *الإجمالي الكلي:* ${order.grandTotal} ج.م
⚡ *حالة الشحن:* تم تحويل مصاريف الشحن عبر InstaPay ورفع الإيصال في الموقع
----------------------------------
🔗 رابط المتجر: ${STORE_CONFIG.siteUrl}`;

    window.open(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(waMsg)}`, '_blank');
    showToast("✓ جاري فتح محادثة الواتساب لتأكيد طلبك مباشرة...");
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

/* ==========================================================================
   7. GLOBAL FIRESTORE HOOKS
   Called by the Firestore onSnapshot listeners defined in index.html
   ========================================================================== */

/**
 * Called by Firestore onSnapshot when products collection changes.
 * Updates storeProducts and directly renders the DOM.
 * ZERO reliance on LocalStorage to guarantee real-time sync across all devices.
 */
window.darUpdateProductsCatalog = function(products) {
  storeProducts = Array.isArray(products) ? products : [];
  renderProducts();
};

/**
 * Called when Firestore onSnapshot encounters a connection or query error.
 */
window.darProductsLoadError = function(error) {
  console.warn("Firestore products sync error:", error);
  if (productsGrid && storeProducts.length === 0) {
    productsGrid.innerHTML = `
      <div class="products-error-state" style="grid-column: 1 / -1; text-align: center; padding: 40px 20px;">
        <p style="color: #ff6b81; font-size: 1.1rem; margin-bottom: 8px;">⚠️ تعذر تحميل المنتجات حالياً</p>
        <p style="color: var(--text-secondary); font-size: 0.95rem;">يرجى التحقق من اتصال الإنترنت أو المحاولة لاحقاً.</p>
      </div>
    `;
    productsGrid.style.display = 'grid';
    if (emptyStateContainer) emptyStateContainer.style.display = 'none';
  }
};

/**
 * Called by Firestore onSnapshot when 'offers' collection changes.
 * Updates the multi-offers list and individual countdown timers.
 */
window.darUpdateOffers = function(offers) {
  if (Array.isArray(offers)) {
    try {
      localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
    } catch { /* ignore quota errors */ }
    renderOffers(offers);
  }
};

// Backwards compatibility hook
window.darUpdateOffer = function(offer) {
  if (offer && typeof offer === 'object') {
    window.darUpdateOffers([offer]);
  }
};

/* ==========================================================================
   8. INITIAL BOOT
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initProducts();
  initOffers();
  initCart();
});