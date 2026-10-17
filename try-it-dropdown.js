(function () {
  if (window.__nombaTryItDropdown) return;
  window.__nombaTryItDropdown = true;

  var PLAYGROUND_BASE = 'https://node-sdk-playground.kudi.ai/';
  var map = window.__nombaSdkPlaygroundMap || {}; // set by /sdk-playground-map.js, loaded first

  var style = document.createElement('style');
  style.textContent = [
    '.ntr-wrap{position:relative;display:inline-flex}',
    '.ntr-caret{display:flex;align-items:center;justify-content:center;width:28px;',
    'border-left:1px solid rgba(255,255,255,.35);cursor:pointer}',
    '.ntr-menu{display:none;position:absolute;top:calc(100% + 6px);right:0;min-width:200px;',
    'background:#fff;border:1px solid #e5e5e5;border-radius:10px;',
    'box-shadow:0 8px 24px rgba(0,0,0,.25);z-index:40;overflow:hidden;font-size:13px;color:#1a1a1a}',
    '.dark .ntr-menu{background:#1f1f22;border-color:#3a3a3e;color:#f2f2f2}',
    '.ntr-menu.open{display:block}',
    '.ntr-item{display:block;width:100%;text-align:left;padding:9px 12px;background:#fff;border:none;',
    'cursor:pointer;color:inherit;font:inherit;text-decoration:none}',
    '.dark .ntr-item{background:#1f1f22;color:#f2f2f2}',
    '.ntr-item:hover{background:rgba(127,127,127,.18)}',
    '.ntr-item-sub{display:block;font-size:11px;opacity:.65;margin-top:1px}',
  ].join('');
  document.head.appendChild(style);

  // Reads the "POST / v1 / checkout / order" pill next to the button into "POST /v1/checkout/order",
  // matching openapi.json's own path syntax (including "{param}" segments) key-for-key.
  function readEndpointKey(tryItBtn) {
    var row = tryItBtn.parentElement;
    var pill = row && row.children[0];
    if (!pill) return null;
    var lines = pill.innerText.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
    var verb = lines[0];
    if (!/^(GET|POST|PUT|DELETE|PATCH)$/.test(verb)) return null;
    var segments = lines.slice(1).filter(function (s) { return s !== '/' && !/^https?:\/\//.test(s); });
    if (!segments.length) return null;
    return verb + ' /' + segments.join('/');
  }

  function buildDropdown(tryItBtn, playgroundHref) {
    tryItBtn.style.display = 'none';
    tryItBtn.setAttribute('data-ntr-wrapped', 'true');

    var wrap = document.createElement('div');
    wrap.className = 'ntr-wrap';

    var hereBtn = document.createElement('button');
    hereBtn.type = 'button';
    hereBtn.className = tryItBtn.className;
    hereBtn.style.borderTopRightRadius = '0';
    hereBtn.style.borderBottomRightRadius = '0';
    hereBtn.textContent = tryItBtn.textContent;
    hereBtn.addEventListener('click', function () { tryItBtn.click(); });

    var caret = document.createElement('button');
    caret.type = 'button';
    caret.className = tryItBtn.className + ' ntr-caret';
    caret.style.borderTopLeftRadius = '0';
    caret.style.borderBottomLeftRadius = '0';
    caret.style.paddingLeft = '0';
    caret.style.paddingRight = '0';
    caret.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';

    var menu = document.createElement('div');
    menu.className = 'ntr-menu';

    var hereItem = document.createElement('button');
    hereItem.type = 'button';
    hereItem.className = 'ntr-item';
    hereItem.innerHTML = 'Here<span class="ntr-item-sub">Try it in this page</span>';
    hereItem.addEventListener('click', function () { closeMenu(); tryItBtn.click(); });

    var sdkItem = document.createElement('a');
    sdkItem.className = 'ntr-item';
    sdkItem.href = playgroundHref;
    sdkItem.target = '_blank';
    sdkItem.rel = 'noopener noreferrer';
    sdkItem.innerHTML = 'SDK Playground<span class="ntr-item-sub">Open this method in the Node SDK Playground</span>';

    menu.appendChild(hereItem);
    menu.appendChild(sdkItem);

    function closeMenu() { menu.classList.remove('open'); }
    function toggleMenu(e) { e.stopPropagation(); menu.classList.toggle('open'); }
    caret.addEventListener('click', toggleMenu);
    document.addEventListener('click', closeMenu);

    wrap.appendChild(hereBtn);
    wrap.appendChild(caret);
    wrap.appendChild(menu);
    tryItBtn.insertAdjacentElement('afterend', wrap);
  }

  function processButton(tryItBtn) {
    if (tryItBtn.hasAttribute('data-ntr-wrapped')) return;
    var endpointKey = readEndpointKey(tryItBtn);
    var sdkRef = endpointKey && map[endpointKey];
    if (!sdkRef) return; // No SDK method for this endpoint: leave the plain "Try it" button alone.
    buildDropdown(tryItBtn, PLAYGROUND_BASE + '#' + encodeURIComponent(sdkRef));
  }

  function scan() {
    document.querySelectorAll('.tryit-button').forEach(processButton);
  }
  scan();
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
})();
