(function () {
  if (window.__nombaAiWidget) return;
  window.__nombaAiWidget = true;

  // Derive backend URL from this script's own src so no hardcoding is needed
  var scriptEl = document.currentScript || (function () {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();
  var BACKEND = scriptEl && scriptEl.src
    ? new URL(scriptEl.src).origin
    : 'http://localhost:8000';

  /* ── Load marked.js for markdown rendering ───────────────────── */
  var markedReady = new Promise(function (resolve) {
    if (window.marked) { resolve(); return; }
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/marked@9/marked.min.js';
    s.onload = resolve;
    document.head.appendChild(s);
  });

  /* ── Styles ─────────────────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    /* Floating button */
    '#nai-btn{position:fixed;bottom:28px;right:28px;z-index:9998;display:flex;align-items:center;gap:8px;',
    'padding:13px 22px;background:linear-gradient(135deg,#CCA300,#A38200);color:#fff;border:none;border-radius:50px;',
    'font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;letter-spacing:.01em;',
    'box-shadow:0 4px 20px rgba(204,163,0,.45);transition:transform .2s,box-shadow .2s}',
    '#nai-btn:hover{transform:translateY(-3px);box-shadow:0 8px 28px rgba(204,163,0,.55)}',
    '#nai-btn svg{flex-shrink:0}',

    /* Overlay */
    '#nai-overlay{display:none;position:fixed;inset:0;z-index:9999;',
    'background:rgba(15,15,20,.55);backdrop-filter:blur(4px);',
    'align-items:flex-end;justify-content:center;padding:16px;',
    'animation:nai-fade-in .2s ease}',
    '#nai-overlay.open{display:flex}',
    '@keyframes nai-fade-in{from{opacity:0}to{opacity:1}}',
    '@media(min-width:640px){#nai-overlay.open{align-items:center}}',

    /* Modal */
    '#nai-modal{display:flex;flex-direction:column;width:100%;max-width:640px;',
    'max-height:82vh;background:#fff;border-radius:20px;',
    'box-shadow:0 32px 80px rgba(0,0,0,.22);font-family:inherit;overflow:hidden;',
    'animation:nai-slide-up .25s cubic-bezier(.22,.68,0,1.2)}',
    '@keyframes nai-slide-up{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}',

    /* Header */
    '#nai-head{display:flex;align-items:center;justify-content:space-between;',
    'padding:16px 20px;background:linear-gradient(135deg,#CCA300 0%,#A38200 100%)}',
    '#nai-head-left{display:flex;align-items:center;gap:10px}',
    '#nai-head-logo{width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.2);',
    'display:flex;align-items:center;justify-content:center;flex-shrink:0}',
    '#nai-head-info{}',
    '#nai-head-name{font-size:15px;font-weight:700;color:#fff;line-height:1.2}',
    '#nai-head-status{display:flex;align-items:center;gap:5px;margin-top:2px}',
    '#nai-head-dot{width:7px;height:7px;border-radius:50%;background:#4ade80}',
    '#nai-head-status-txt{font-size:11px;color:rgba(255,255,255,.8)}',
    '#nai-close{background:rgba(255,255,255,.15);border:none;width:30px;height:30px;border-radius:50%;',
    'font-size:18px;line-height:1;cursor:pointer;color:#fff;display:flex;align-items:center;justify-content:center;',
    'transition:background .15s}',
    '#nai-close:hover{background:rgba(255,255,255,.3)}',

    /* Messages */
    '#nai-msgs{flex:1;overflow-y:auto;padding:20px 18px;display:flex;flex-direction:column;gap:14px;',
    'background:#F5F5F7;scrollbar-width:thin;scrollbar-color:#ddd transparent}',
    '#nai-msgs::-webkit-scrollbar{width:4px}',
    '#nai-msgs::-webkit-scrollbar-track{background:transparent}',
    '#nai-msgs::-webkit-scrollbar-thumb{background:#ddd;border-radius:4px}',

    /* Bot row (avatar + bubble) */
    '.nai-row{display:flex;align-items:flex-start;gap:8px;max-width:92%}',
    '.nai-avatar{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#CCA300,#A38200);',
    'color:#fff;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;',
    'flex-shrink:0;margin-top:2px;box-shadow:0 2px 8px rgba(204,163,0,.35)}',

    /* Message bubbles */
    '.nai-msg{padding:11px 15px;border-radius:16px;font-size:14px;line-height:1.7;word-break:break-word}',
    '.nai-msg.user{background:linear-gradient(135deg,#CCA300,#B8950A);color:#fff;',
    'align-self:flex-end;border-bottom-right-radius:4px;white-space:pre-wrap;max-width:82%;',
    'box-shadow:0 2px 12px rgba(204,163,0,.3)}',
    '.nai-msg.bot{background:#fff;color:#1a1a1a;border-radius:4px 16px 16px 16px;',
    'border:1px solid #EAEAEA;box-shadow:0 1px 4px rgba(0,0,0,.06)}',
    '.nai-msg.error{background:#fff1f1;color:#c0392b;border:1px solid #fdd;border-radius:12px}',

    /* Markdown inside bot bubbles */
    '.nai-msg.bot p{margin:0 0 8px}.nai-msg.bot p:last-child{margin:0}',
    '.nai-msg.bot h1,.nai-msg.bot h2{font-size:15px;font-weight:700;margin:10px 0 4px;color:#111}',
    '.nai-msg.bot h3,.nai-msg.bot h4{font-size:14px;font-weight:700;margin:8px 0 4px;color:#111}',
    '.nai-msg.bot ul,.nai-msg.bot ol{margin:4px 0 8px;padding-left:18px}',
    '.nai-msg.bot li{margin:3px 0}',
    '.nai-msg.bot strong{font-weight:700;color:#111}',
    '.nai-msg.bot em{font-style:italic}',
    '.nai-msg.bot code{background:#F0F0F0;border-radius:5px;padding:2px 6px;font-size:12px;font-family:monospace;color:#d63384}',
    '.nai-msg.bot pre{background:#1a1a2e;color:#e2e8f0;border-radius:10px;padding:12px 14px;',
    'overflow-x:auto;margin:8px 0;font-size:12px;line-height:1.6}',
    '.nai-msg.bot pre code{background:none;padding:0;color:inherit;font-size:inherit}',
    '.nai-msg.bot a{color:#CCA300;text-decoration:underline;font-weight:500}',
    '.nai-msg.bot hr{border:none;border-top:1px solid #eee;margin:10px 0}',
    '.nai-msg.bot blockquote{border-left:3px solid #CCA300;margin:6px 0;padding:4px 12px;',
    'color:#555;background:#FAFAF5;border-radius:0 6px 6px 0}',

    /* Typing indicator */
    '.nai-typing{display:flex;align-items:center;gap:4px;padding:14px 16px}',
    '.nai-typing span{display:inline-block;width:7px;height:7px;border-radius:50%;',
    'background:#CCA300;opacity:.6;animation:nai-bounce .9s infinite}',
    '.nai-typing span:nth-child(2){animation-delay:.18s}',
    '.nai-typing span:nth-child(3){animation-delay:.36s}',
    '@keyframes nai-bounce{0%,80%,100%{transform:translateY(0);opacity:.6}40%{transform:translateY(-7px);opacity:1}}',

    /* Footer */
    '#nai-footer{padding:12px 14px 10px;border-top:1px solid #EAEAEA;display:flex;gap:8px;',
    'align-items:flex-end;background:#fff}',
    '#nai-input{flex:1;border:1.5px solid #E8E8E8;border-radius:12px;padding:10px 14px;',
    'font-size:14px;font-family:inherit;outline:none;resize:none;line-height:1.55;',
    'max-height:110px;overflow-y:auto;background:#FAFAFA;transition:border-color .15s,background .15s;color:#1a1a1a}',
    '#nai-input:focus{border-color:#CCA300;background:#fff}',
    '#nai-input::placeholder{color:#bbb}',
    '#nai-send{background:linear-gradient(135deg,#CCA300,#A38200);color:#fff;border:none;',
    'width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;',
    'cursor:pointer;flex-shrink:0;transition:transform .15s,box-shadow .15s;',
    'box-shadow:0 2px 8px rgba(204,163,0,.4)}',
    '#nai-send:hover{transform:scale(1.08);box-shadow:0 4px 14px rgba(204,163,0,.5)}',
    '#nai-send:disabled{opacity:.45;cursor:not-allowed;transform:none;box-shadow:none}',

    /* Char count + disclaimer */
    '#nai-charcount{font-size:11px;color:#bbb;text-align:right;padding:2px 14px 0}',
    '#nai-charcount.over{color:#c0392b;font-weight:600}',
    '#nai-disclaimer{font-size:11px;color:#bbb;text-align:center;padding:4px 16px 10px;line-height:1.5}',

    /* Quota badge */
    '.nai-quota{font-size:11px;color:#999;text-align:center;padding:2px 0;',
    'display:flex;align-items:center;justify-content:center;gap:5px}',
    '.nai-quota-dot{width:6px;height:6px;border-radius:50%;background:#CCA300;opacity:.7;flex-shrink:0}',
    '.nai-quota.low{color:#e67e22}.nai-quota.low .nai-quota-dot{background:#e67e22}',
    '.nai-quota.critical{color:#c0392b}.nai-quota.critical .nai-quota-dot{background:#c0392b}',

    /* Suggestion chips */
    '#nai-suggestions{display:flex;flex-wrap:wrap;gap:7px;padding:2px 0 4px}',
    '.nai-chip{background:#fff;border:1.5px solid #E0C060;color:#8A6E00;border-radius:20px;',
    'padding:7px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;',
    'transition:all .15s;box-shadow:0 1px 4px rgba(204,163,0,.12)}',
    '.nai-chip:hover{background:linear-gradient(135deg,#CCA300,#A38200);color:#fff;',
    'border-color:transparent;transform:translateY(-2px);box-shadow:0 4px 12px rgba(204,163,0,.3)}',
  ].join('');
  document.head.appendChild(style);

  /* ── HTML ────────────────────────────────────────────────────── */
  document.body.insertAdjacentHTML('beforeend', [
    '<button id="nai-btn" aria-label="Chat with us">',
    '  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">',
    '    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    '  </svg>',
    '  <span style="display:flex;flex-direction:column;line-height:1.25;text-align:left">',
    '    <span>Chat with us</span>',
    '    <span style="font-size:11px;font-weight:500;opacity:.88">AI assisted</span>',
    '  </span>',
    '</button>',

    '<div id="nai-overlay" role="dialog" aria-modal="true" aria-label="Ask AI about Nomba Docs">',
    '  <div id="nai-modal">',

    '    <div id="nai-head">',
    '      <div id="nai-head-left">',
    '        <div id="nai-head-logo">',
    '          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">',
    '            <path d="M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2z"/><path d="M12 8v4l3 3"/>',
    '          </svg>',
    '        </div>',
    '        <div id="nai-head-info">',
    '          <div id="nai-head-name">Nomba AI Assistant</div>',
    '          <div id="nai-head-status">',
    '            <div id="nai-head-dot"></div>',
    '            <span id="nai-head-status-txt">Online</span>',
    '          </div>',
    '        </div>',
    '      </div>',
    '      <button id="nai-close" aria-label="Close">&times;</button>',
    '    </div>',

    '    <div id="nai-msgs">',
    '      <div id="nai-suggestions">',
    '        <button class="nai-chip">How do I create a virtual account?</button>',
    '        <button class="nai-chip">How do I transfer to a bank account?</button>',
    '        <button class="nai-chip">How do I create a checkout order?</button>',
    '        <button class="nai-chip">How do I verify if a bank transfer was successful?</button>',
    '      </div>',
    '      <div class="nai-row">',
    '        <div class="nai-avatar">N</div>',
    '        <div class="nai-msg bot">Hi! Ask me anything about the Nomba APIs — authentication, payments, transfers, virtual accounts and more.</div>',
    '      </div>',
    '    </div>',

    '    <div id="nai-footer">',
    '      <textarea id="nai-input" rows="1" placeholder="Ask about Nomba APIs..."></textarea>',
    '      <button id="nai-send" aria-label="Send">',
    '        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">',
    '          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
    '        </svg>',
    '      </button>',
    '    </div>',
    '    <div id="nai-charcount">0 / 100</div>',
    '    <div id="nai-disclaimer">Answers are AI-generated based on Nomba documentation. You can ask up to 10 questions per day.</div>',
    '  </div>',
    '</div>',
  ].join(''));

  /* ── Refs ────────────────────────────────────────────────────── */
  var overlay    = document.getElementById('nai-overlay');
  var msgs       = document.getElementById('nai-msgs');
  var input      = document.getElementById('nai-input');
  var sendBtn    = document.getElementById('nai-send');
  var charCount  = document.getElementById('nai-charcount');
  var disclaimer = document.getElementById('nai-disclaimer');

  /* ── Open / close ────────────────────────────────────────────── */
  document.getElementById('nai-btn').addEventListener('click', open);
  document.getElementById('nai-close').addEventListener('click', close);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  function open()  { overlay.classList.add('open'); input.focus(); }
  function close() { overlay.classList.remove('open'); }

  /* ── Suggestion chips ───────────────────────────────────────── */
  function hideSuggestions() {
    var el = document.getElementById('nai-suggestions');
    if (el) el.remove();
  }

  document.querySelectorAll('.nai-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      input.value = chip.textContent.trim();
      hideSuggestions();
      send();
    });
  });

  /* ── Auto-grow textarea + character counter ─────────────────── */
  input.addEventListener('input', function () {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 110) + 'px';
    var len = input.value.length;
    charCount.textContent = len + ' / ' + MAX_LEN;
    charCount.classList.toggle('over', len > MAX_LEN);
    sendBtn.disabled = len > MAX_LEN;
  });

  /* ── Send on Enter (Shift+Enter = newline) ───────────────────── */
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
  sendBtn.addEventListener('click', send);

  /* ── Helpers ─────────────────────────────────────────────────── */
  function renderMd(text) {
    if (!window.marked) return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return window.marked.parse(text);
  }

  function createBotBubble() {
    var row = document.createElement('div');
    row.className = 'nai-row';
    var avatar = document.createElement('div');
    avatar.className = 'nai-avatar';
    avatar.textContent = 'N';
    var bubble = document.createElement('div');
    bubble.className = 'nai-msg bot';
    row.appendChild(avatar);
    row.appendChild(bubble);
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
    return bubble;
  }

  function addMsg(text, cls) {
    if (cls === 'bot') {
      var bubble = createBotBubble();
      bubble.innerHTML = renderMd(text);
      return bubble;
    }
    var el = document.createElement('div');
    el.className = 'nai-msg ' + cls;
    el.textContent = text;
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
    return el;
  }

  function addQuotaBadge(n) {
    var el = document.createElement('div');
    el.className = 'nai-quota' + (n <= 2 ? ' critical' : n <= 5 ? ' low' : '');
    el.innerHTML = '<div class="nai-quota-dot"></div>' +
      (n === 0
        ? 'No questions remaining today'
        : n + ' question' + (n === 1 ? '' : 's') + ' remaining today');
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function addTyping() {
    var bubble = createBotBubble();
    bubble.classList.add('nai-typing');
    bubble.innerHTML = '<span></span><span></span><span></span>';
    return bubble.parentElement;
  }

  /* ── Send ────────────────────────────────────────────────────── */
  var MAX_LEN = 100;

  function send() {
    var question = input.value.trim();
    if (!question || sendBtn.disabled) return;
    if (question.length > MAX_LEN) {
      addMsg('Your question is too long. Please keep it under ' + MAX_LEN + ' characters.', 'bot error');
      return;
    }

    hideSuggestions();
    input.value = '';
    input.style.height = 'auto';
    sendBtn.disabled = true;

    addMsg(question, 'user');
    var typingEl = addTyping();

    markedReady.then(function () {
      fetch(BACKEND + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question }),
      })
        .then(function (res) {
          var remaining = res.headers.get('X-Questions-Remaining');
          var remainingN = remaining !== null ? parseInt(remaining, 10) : null;
          if (remainingN !== null) {
            disclaimer.textContent = remainingN === 0
              ? 'You have used all 10 questions for today. Come back tomorrow!'
              : 'AI-generated answers from Nomba docs. ' + remainingN + ' question' + (remainingN === 1 ? '' : 's') + ' remaining today.';
          }
          if (res.status === 429) {
            typingEl.remove();
            addMsg('You have reached your 10 questions per day limit. Please try again tomorrow.', 'bot error');
            sendBtn.disabled = false;
            input.focus();
            return Promise.reject(null);
          }
          if (!res.ok) throw new Error('Server error ' + res.status);
          typingEl.remove();
          var botEl = createBotBubble();

          var reader = res.body.getReader();
          var decoder = new TextDecoder();
          var sseBuffer = '';
          var fullText = '';

          function read() {
            reader.read().then(function (chunk) {
              if (chunk.done) {
                sendBtn.disabled = false;
                input.focus();
                if (remainingN !== null) addQuotaBadge(remainingN);
                return;
              }
              sseBuffer += decoder.decode(chunk.value, { stream: true });
              var lines = sseBuffer.split('\n');
              sseBuffer = lines.pop();
              lines.forEach(function (line) {
                if (!line.startsWith('data: ')) return;
                var payload = line.slice(6);
                if (payload === '[DONE]') return;
                try {
                  var parsed = JSON.parse(payload);
                  if (parsed.text) {
                    fullText += parsed.text;
                    botEl.innerHTML = renderMd(fullText);
                    msgs.scrollTop = msgs.scrollHeight;
                  }
                } catch (_) {}
              });
              read();
            });
          }
          read();
        })
        .catch(function (err) {
          if (err === null) return;
          typingEl.remove();
          addMsg('Something went wrong. Please try again.', 'bot error');
          sendBtn.disabled = false;
          input.focus();
        });
    });
  }
})();
