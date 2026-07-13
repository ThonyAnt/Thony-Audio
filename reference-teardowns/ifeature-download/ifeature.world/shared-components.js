

(function () {
  const TICKER_TEXT = 'NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN - NEW PLUGIN';


  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  function isActive(page) {
    if (page === 'index.html' && (currentPage === 'index.html' || currentPage === '')) return true;
    return currentPage === page;
  }


  const style = document.createElement('style');
  style.textContent = `
    /* ── Shared Header ── */
    .shared-header {
      padding: 22px 0 11px 0;
      position: relative;
      z-index: 10;
      width: 100%;
    }
    .shared-header img.logo {
      width: 331px;
      max-width: 90%;
      height: auto;
    }
    .shared-menu-wrapper {
      margin: 15px auto 30px auto;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      font-size: 13px;
      font-weight: 400;
      flex-wrap: nowrap;
    }
    .shared-menu-wrapper a {
      color: #fff;
      text-decoration: none;
      text-transform: uppercase;
      transition: color 0.2s ease;
    }
    .shared-menu-wrapper a:hover,
    .shared-menu-wrapper a.active {
      color: #ff4800;
    }
    .shared-menu-wrapper .star {
      color: #ff4800;
      font-size: 10px;
    }
    .shared-submenu {
      display: none;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      margin-top: 15px;
      animation: shared-slide-down 0.3s ease forwards;
    }
    .shared-submenu.open {
      display: flex;
    }
    .shared-submenu a {
      color: #ff4800;
      text-decoration: none;
      text-transform: uppercase;
      font-size: 14px;
    }
    .shared-submenu a:hover {
      color: #fff;
    }
    @keyframes shared-slide-down {
      from { opacity: 0; transform: translateY(-10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ── Moonbase Icons ── */
    .moonbase-icons {
      position: absolute;
      top: 20px;
      right: 30px;
      display: flex;
      gap: 20px;
      z-index: 20;
    }
    .moonbase-icons img {
      width: 28px;
      height: auto;
      cursor: pointer;
      filter: brightness(0) invert(1);
      transition: filter 0.3s ease;
    }
    .moonbase-icons img:hover {
      filter: brightness(0) saturate(100%) invert(44%) sepia(82%) saturate(5000%) hue-rotate(5deg) brightness(102%) contrast(104%);
    }

    /* ── Shared Bottom Wrapper ── */
    .shared-bottom-wrapper {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      display: flex;
      flex-direction: column;
      z-index: 9998;
      background: #000;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
      will-change: transform;
    }
    .shared-ticker-container {
      width: 100%;
      overflow: hidden;
      background-color: #ff4800;
      white-space: nowrap;
      height: 30px;
      display: flex;
      align-items: center;
    }
    .shared-ticker {
      display: flex;
      width: calc(2000px);
      animation: shared-ticker-loop 20s linear infinite;
    }
    .shared-ticker-content {
      flex: 0 0 50%;
      font-size: 14px;
      color: black;
    }
    @keyframes shared-ticker-loop {
      0%   { transform: translateX(0%); }
      100% { transform: translateX(-40%); }
    }
    .shared-footer {
      width: 100%;
      background: #000;
      color: white;
      font-size: 12px;
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      padding: 20px 30px;
      box-sizing: border-box;
      border-top: 1px solid #222;
    }
    .shared-footer-left {
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 5px;
      justify-self: start;
    }
    .shared-footer-left img {
      width: 9px;
      height: 9px;
      filter: brightness(0) invert(1);
    }
    .shared-footer-center {
      display: flex;
      gap: 16px;
      justify-self: center;
    }
    .shared-footer-center img {
      width: 18px;
      height: 18px;
      filter: brightness(0) invert(1);
      transition: filter 0.3s ease;
    }
    .shared-footer-center a:hover img {
      filter: brightness(0) saturate(100%) invert(44%) sepia(82%) saturate(5000%) hue-rotate(5deg) brightness(102%) contrast(104%);
    }
    .shared-footer-right {
      justify-self: end;
    }
    .shared-footer-right a {
      color: #fff;
      text-decoration: none;
      text-transform: uppercase;
      font-size: 12px;
      letter-spacing: 1px;
      transition: color 0.3s ease;
    }
    .shared-footer-right a:hover {
      color: #ff4800;
    }

    /* ── Mobile overrides ── */
    @media (max-width: 768px) {
      .shared-header {
        padding: 22px 0 11px 0;
      }
      .shared-header img.logo {
        width: 250px;
        max-width: 250px;
      }
      .shared-menu-wrapper {
        margin: 15px auto 30px auto;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
        font-size: 11px;
      }
      .shared-submenu {
        flex-direction: column;
        align-items: center;
      }
      .shared-footer {
        grid-template-columns: 1fr;
        padding: 20px 15px;
        text-align: center;
        gap: 10px;
      }
      .shared-footer-left,
      .shared-footer-right {
        justify-self: center;
      }
      .moonbase-icons {
        right: 10px !important;
        top: 10px !important;
        gap: 12px;
      }
      .moonbase-icons img {
        width: 24px;
        height: 24px;
      }
    }
  `;
  document.head.appendChild(style);

  // ─── INJECT HEADER ───────────────────────────────────────────────────────────
  function injectHeader() {
    // Only inject on pages that explicitly opt-in with data-shared-nav
    const header = document.querySelector('header[data-shared-nav]');
    if (!header) return;

    header.className = 'shared-header';
    header.innerHTML = `
      <div class="moonbase-icons">
        <img onclick="Moonbase.view_account()" src="Account.svg" alt="Account" id="accountBtn" />
        <img onclick="Moonbase.view_cart()" src="Basket.svg" alt="Cart" id="cartBtn" />
      </div>
      <a href="index.html"><img src="Logo.svg" alt="iFeature Logo" class="logo" /></a>
      <div class="shared-menu-wrapper">
        <a id="pluginLink" onclick="window.sharedToggleSubMenu()" style="cursor:pointer"${isActive('plugins') ? ' class="active"' : ''}>PLUGINS</a>
        <span class="star">★</span>
        <a href="download.html"${isActive('download.html') ? ' class="active"' : ''}>DOWNLOAD</a>
        <span class="star">★</span>
        <a href="shop.html"${isActive('shop.html') ? ' class="active"' : ''}>SHOP</a>
        <span class="star">★</span>
        <a href="support.html"${isActive('support.html') ? ' class="active"' : ''}>SUPPORT</a>
      </div>
      <div id="plugins-submenu" class="shared-submenu"></div>
    `;
  }

  // ─── INJECT BOTTOM WRAPPER ───────────────────────────────────────────────────
  function injectBottomWrapper() {
    const existing = document.querySelector('.bottom-wrapper');
    if (!existing) return;

    existing.className = 'shared-bottom-wrapper';
    existing.innerHTML = `
      <a href="anomaly.html" class="shared-ticker-container" 
         onclick="if(window.location.pathname.endsWith('anomaly.html')) { event.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'}); }"
         style="text-decoration: none; color: inherit; display: flex; cursor: pointer;">
        <div class="shared-ticker">
          <div class="shared-ticker-content">${TICKER_TEXT}</div>
          <div class="shared-ticker-content">${TICKER_TEXT}</div>
        </div>
      </a>
      <footer class="shared-footer">
        <div class="shared-footer-left">
          <img src="Copyright.svg" alt="©" />
          IFEATURE 2025
        </div>
        <div class="shared-footer-center">
          <a href="https://www.instagram.com/ifeaturemusic" target="_blank"><img src="Instagram.svg" alt="Instagram" /></a>
          <a href="https://x.com/iFeaturemusic" target="_blank"><img src="X.svg" alt="X" /></a>
          <a href="https://patreon.com/iFeature" target="_blank"><img src="Patreon.svg" alt="Patreon" /></a>
          <a href="https://open.spotify.com/artist/1NkeIgGpORkhxCUluCnnFT" target="_blank"><img src="Spotify.svg" alt="Spotify" /></a>
          <a href="https://youtube.com/ifeature" target="_blank"><img src="Youtube.svg" alt="YouTube" /></a>
          <a href="https://discord.gg/XxMf9s39EX" target="_blank"><img src="Discord.svg" alt="Discord" /></a>
        </div>
        <div class="shared-footer-right">
          <a href="legalhub.html">LEGAL HUB</a>
        </div>
      </footer>
    `;
  }

  window.sharedToggleSubMenu = function () {
    const submenu = document.getElementById('plugins-submenu');
    if (!submenu) return;
    submenu.classList.toggle('open');
  };


  if (document.querySelector('header[data-shared-nav]')) {
    window.toggleSubMenu = window.sharedToggleSubMenu;
  }

  function populateSubMenu() {

    if (!document.querySelector('header[data-shared-nav]')) return;

    const submenu = document.getElementById('plugins-submenu');
    if (!submenu) return;

    const plugins = [
      { name: 'ANOMALY', href: 'anomaly.html' },
      { name: 'RIVE', href: 'rive.html' },
      { name: 'RM40', href: 'rm40.html' },
      { name: 'SPECTRAL COMPRESSOR', href: 'spectralcompressor.html' },
      { name: 'FUSION', href: 'fusion.html' },
      { name: 'OBRA', href: 'obra.html' },
      { name: 'SPECTRAL GATE 2', href: 'spectralgate.html' },
    ];

    submenu.innerHTML = plugins
      .map(p => `<a href="${p.href}"${currentPage === p.href ? ' class="active"' : ''}>${p.name}</a>`)
      .join('');
  }

  // ─── INJECT META PIXEL (DYNAMICALLY ACROSS ALL PAGES) ────────────────────────
  function injectMetaPixel() {
    if (window.fbq) return;

    // Helper to get cookie values
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };

    // Create script element for fbevents.js
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);

    // Initialize fbq queue
    window.fbq = function() {
      window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments);
    };
    if (!window._fbq) window._fbq = window.fbq;
    window.fbq.push = window.fbq;
    window.fbq.loaded = true;
    window.fbq.version = '2.0';
    window.fbq.queue = [];

    // Extract first-party browser cookies for advanced matching
    const fbp = getCookie('_fbp');
    const fbc = getCookie('_fbc');
    const advancedMatching = {};
    if (fbp) advancedMatching.fbp = fbp;
    if (fbc) advancedMatching.fbc = fbc;

    // Initialize our specific Pixel ID and track PageView
    if (Object.keys(advancedMatching).length > 0) {
      window.fbq('init', '1458534412160729', advancedMatching);
    } else {
      window.fbq('init', '1458534412160729');
    }
    window.fbq('track', 'PageView');

    // Also append the noscript fallback image for extreme safety
    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.height = '1';
    img.width = '1';
    img.style.display = 'none';
    img.src = 'https://www.facebook.com/tr?id=1458534412160729&ev=PageView&noscript=1';
    noscript.appendChild(img);
    document.body.appendChild(noscript);

    console.log('[Meta Pixel] Loaded and initialized dynamically via shared-components.js (Pixel: 1458534412160729)');

    // Helper to safely extract and build Meta user matching data from Moonbase events
    const getMetaUserData = (event) => {
      const uData = {};
      
      // Try to read browser cookies again to be perfectly fresh
      const currentFbp = getCookie('_fbp');
      const currentFbc = getCookie('_fbc');
      if (currentFbp) uData.fbp = currentFbp;
      if (currentFbc) uData.fbc = currentFbc;

      // Extract PII Safely
      const customer = event.order && event.order.customer;
      const email = customer && (customer.email || customer.email_address || customer.emailAddress);
      const phone = customer && (customer.phone || customer.phone_number || customer.phoneNumber);
      const firstName = customer && (customer.first_name || customer.firstName || customer.given_name || customer.givenName);
      const lastName = customer && (customer.last_name || customer.lastName || customer.family_name || customer.familyName);

      if (email) uData.em = email.toLowerCase().trim();
      if (phone) uData.ph = phone.replace(/\D/g, '');
      if (firstName) uData.fn = firstName.toLowerCase().trim();
      if (lastName) uData.ln = lastName.toLowerCase().trim();

      return uData;
    };

    // ─── MOONBASE STOREFRONT FUNNEL TRACKING ─────────────────────────────────
    // Check periodically for global Moonbase object to register event listeners
    const registerMoonbaseListeners = () => {
      if (window.Moonbase && typeof window.Moonbase.on === 'function') {
        console.log('[Moonbase Storefront] Attaching Meta Pixel event listeners...');
        
        // 1. Add to Cart Tracking
        window.Moonbase.on('added-to-cart', event => {
          console.log('[Moonbase Event] Add to Cart:', event);
          if (window.fbq) {
            window.fbq('track', 'AddToCart', {
              currency: event.currency,
              value: event.item.price[event.currency] * event.item.quantity,
              content_ids: [event.item.product ? event.item.product.id : event.item.bundle.id],
              content_name: event.item.product ? event.item.product.name : event.item.bundle.name,
              content_type: 'product',
            });
          }
        });

        // 2. Initiate Checkout Tracking
        window.Moonbase.on('checkout-initiated', event => {
          console.log('[Moonbase Event] Initiate Checkout:', event);
          if (window.fbq) {
            // Dynamically enhance user matching data during checkout initiation
            const uData = getMetaUserData(event);
            if (Object.keys(uData).length > 0) {
              console.log('[Meta Pixel] Updating matching parameters on checkout-initiated:', Object.keys(uData));
              window.fbq('init', '1458534412160729', uData);
            }

            window.fbq('track', 'InitiateCheckout', {
              currency: event.total.currency,
              value: event.total.amount,
              num_items: event.order.items.length,
              content_ids: event.order.items.map(item => item.product ? item.product.id : item.bundle.id),
              contents: event.order.items.map(item => ({
                id: item.product ? item.product.id : item.bundle.id,
                name: item.product ? item.product.name : item.bundle.name,
                discount: item.appliedDiscount ? item.appliedDiscount.total[event.order.currency] : undefined,
                price: item.price[event.order.currency],
                quantity: item.quantity,
              }))
            }, { eventID: event.order.id });
          }
        });

        // 3. Purchase Tracking (Browser Fallback)
        window.Moonbase.on('checkout-completed', event => {
          console.log('[Moonbase Event] Purchase Completed:', event);
          if (window.fbq) {
            // Dynamically enhance user matching data during purchase completion
            const uData = getMetaUserData(event);
            if (Object.keys(uData).length > 0) {
              console.log('[Meta Pixel] Updating matching parameters on checkout-completed:', Object.keys(uData));
              window.fbq('init', '1458534412160729', uData);
            }

            window.fbq('track', 'Purchase', {
              currency: event.order.total.due.currency,
              value: event.order.total.due.amount,
              num_items: event.order.items.length,
              content_ids: event.order.items.map(item => item.product ? item.product.id : item.bundle.id),
              contents: event.order.items.map(item => ({
                id: item.product ? item.product.id : item.bundle.id,
                name: item.product ? item.product.name : item.bundle.name,
                discount: item.appliedDiscount ? item.appliedDiscount.total[event.order.currency] : undefined,
                price: item.total.due.amount,
                quantity: item.quantity,
              }))
            }, { eventID: event.order.id });
          }
        });
      } else {
        // Retry until storefront module has registered Moonbase on window
        setTimeout(registerMoonbaseListeners, 250);
      }
    };
    registerMoonbaseListeners();
  }

  function init() {
    injectMetaPixel();
    injectHeader();
    injectBottomWrapper();
    populateSubMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
