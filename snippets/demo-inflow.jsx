export const DemoInflow = () => {
  const CSS = `:where(.dmi-root), :where(.dmi-root) * { box-sizing: border-box; margin: 0; padding: 0; }
:where(.dmi-root) button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }
:where(.dmi-root) input, :where(.dmi-root) select { font: inherit; color: inherit; }
.dmi-root {
  --yellow: #FFCC00; --yellow-hover: #E6B000; --cream: #FFFCF0;
  --black: #0D0D0D; --white: #FFFFFF; --bg: #F3F3F3; --grey: #F5F5F5; --grey-2: #EBEBEB;
  --muted: #8A8A8A; --text-2: #5C5C5C; --border: #E6E6E6;
  --green: #189144; --red: #E5484D;
  --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  --ease: cubic-bezier(.25,.46,.45,.94);
  container-type: inline-size; font-family: var(--font); font-size: 16px; line-height: normal; color: var(--black);
  background: #1A1A1A; border-radius: 16px; padding: 32px 16px; margin: 24px 0; display: flex; justify-content: center;
  -webkit-font-smoothing: antialiased; text-align: left;
}

.dmi-phone {
  position: relative; width: 390px; height: 844px; background: var(--bg); border-radius: 44px; overflow: hidden;
  box-shadow: 0 0 0 10px #000, 0 30px 80px rgba(0,0,0,.5); flex: none;
}
.dmi-statusbar {
  position: absolute; top: 0; left: 0; right: 0; height: 47px; z-index: 30; display: flex; align-items: center;
  justify-content: space-between; padding: 6px 30px 0 34px; font-size: 15px; font-weight: 600; pointer-events: none;
}
.dmi-statusbar .dmi-icons { display: flex; gap: 6px; align-items: center; }
.dmi-home-indicator { position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); width: 134px; height: 5px; border-radius: 3px; background: var(--black); z-index: 60; pointer-events: none; }

.dmi-screen { position: absolute; inset: 0; display: flex; flex-direction: column; background: var(--bg); animation: dmi-slide .28s var(--ease); }
@keyframes dmi-slide { from { transform: translateX(24px); opacity: .4; } to { transform: none; opacity: 1; } }
.dmi-scroll { flex: 1; overflow-y: auto; scrollbar-width: none; }
.dmi-scroll::-webkit-scrollbar { display: none; }

.dmi-nav { padding: 52px 16px 12px; display: grid; grid-template-columns: 40px 1fr 40px; align-items: center; background: var(--white); }
.dmi-nav h1 { font-size: 17px; font-weight: 600; text-align: center; display: flex; align-items: center; justify-content: center; gap: 8px; color: var(--black); }
.dmi-icon-btn { width: 40px; height: 40px; display: grid; place-items: center; border-radius: 50%; }
.dmi-country { display: inline-flex; align-items: center; gap: 6px; background: var(--grey); border-radius: 999px; padding: 5px 10px 5px 6px; font-size: 13px; font-weight: 500; }
.dmi-flag-ng { width: 20px; height: 20px; border-radius: 50%; background: linear-gradient(90deg,#008751 33%,#fff 33% 66%,#008751 66%); box-shadow: inset 0 0 0 1px rgba(0,0,0,.06); display: inline-block; }

.dmi-btn { height: 52px; width: 100%; border-radius: 12px; font-weight: 600; font-size: 15px; transition: background .15s var(--ease), opacity .15s; }
.dmi-btn-primary { background: var(--yellow); color: var(--black); }
.dmi-btn-primary:hover { background: var(--yellow-hover); }
.dmi-btn-primary:disabled { background: #E4E4E4; color: #A3A3A3; cursor: not-allowed; }
.dmi-btn-outline { background: var(--white); border: 1px solid var(--border); }
.dmi-footer { padding: 12px 16px 34px; background: var(--white); }

.dmi-hero {
  position: relative; overflow: hidden; padding: 56px 16px 20px;
  background: linear-gradient(180deg, #FFCC00 0%, #FFCC00 55%, #FFE57A 82%, var(--bg) 100%);
}
.dmi-hero .dmi-swirl { position: absolute; border-radius: 50%; border: 56px solid rgba(255,255,255,.14); pointer-events: none; }
.dmi-hero .dmi-s1 { width: 420px; height: 420px; right: -230px; top: 30px; }
.dmi-hero .dmi-s2 { width: 300px; height: 300px; left: -190px; top: 210px; }
.dmi-hero-top { position: relative; display: flex; justify-content: space-between; align-items: center; }
.dmi-avatar { width: 40px; height: 40px; border-radius: 50%; background: rgba(13,13,13,.32); color: var(--white); display: grid; place-items: center; font-size: 14px; font-weight: 600; }
.dmi-round-dark { width: 40px; height: 40px; border-radius: 50%; background: rgba(13,13,13,.32); display: grid; place-items: center; }
.dmi-bal { position: relative; text-align: center; margin-top: 40px; }
.dmi-acct-type { font-size: 14px; font-weight: 500; color: rgba(13,13,13,.75); display: inline-flex; align-items: center; gap: 6px; }
.dmi-amount { display: flex; align-items: baseline; justify-content: center; gap: 8px; margin-top: 10px; }
.dmi-amount strong { font-size: 38px; font-weight: 700; letter-spacing: -.03em; font-variant-numeric: tabular-nums; }
.dmi-amount strong small { font-size: 22px; font-weight: 600; letter-spacing: 0; }
.dmi-eye { width: 22px; height: 22px; border-radius: 50%; background: rgba(13,13,13,.15); display: grid; place-items: center; align-self: center; }
.dmi-acct-chip { display: inline-flex; align-items: center; gap: 8px; margin-top: 12px; background: rgba(255,255,255,.35); border-radius: 999px; padding: 7px 14px; font-size: 15px; font-weight: 500; }
.dmi-dots { display: flex; justify-content: center; gap: 4px; margin-top: 26px; }
.dmi-dots i { width: 6px; height: 6px; border-radius: 3px; background: rgba(13,13,13,.25); }
.dmi-dots i:first-child { width: 14px; background: rgba(13,13,13,.6); }
.dmi-actions { position: relative; display: grid; grid-template-columns: repeat(4,1fr); margin-top: 22px; }
.dmi-action { display: flex; flex-direction: column; align-items: center; gap: 8px; font-size: 14px; font-weight: 500; }
.dmi-action .dmi-circle { width: 50px; height: 50px; border-radius: 50%; background: rgba(110,92,18,.62); display: grid; place-items: center; transition: transform .15s; }
.dmi-action:active .dmi-circle { transform: scale(.94); }
.dmi-live { font-weight: 700; }
.dmi-live .dmi-circle { position: relative; background: var(--black); box-shadow: 0 6px 16px rgba(13,13,13,.35); }
.dmi-live .dmi-circle::after { content: ''; position: absolute; inset: -6px; border-radius: 50%; border: 2px solid var(--black); opacity: 0; animation: dmi-pulse 2s var(--ease) infinite; }
.dmi-live:hover .dmi-circle { transform: translateY(-2px); }
@keyframes dmi-pulse { 0% { transform: scale(.9); opacity: .5; } 70%, 100% { transform: scale(1.25); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .dmi-live .dmi-circle::after { animation: none; } }
.dmi-root [data-soon], .dmi-keypad .dmi-bio { opacity: .4; filter: grayscale(1); cursor: not-allowed; }
.dmi-root [data-soon]:active .dmi-circle { transform: none; }

.dmi-home-body { padding: 0 12px 110px; display: flex; flex-direction: column; gap: 12px; margin-top: -6px; position: relative; }
.dmi-banner { background: var(--cream); border-radius: 14px; padding: 14px 14px 18px; display: flex; gap: 12px; align-items: flex-start; position: relative; }
.dmi-banner .dmi-emoji { width: 36px; height: 36px; border-radius: 10px; background: var(--yellow); display: grid; place-items: center; flex: none; }
.dmi-banner b { font-size: 14px; font-weight: 600; display: block; }
.dmi-banner p { font-size: 13px; color: var(--text-2); margin-top: 3px; line-height: 18px; }
.dmi-card { background: var(--white); border-radius: 16px; padding: 16px; }
.dmi-card h3 { font-size: 16px; font-weight: 600; margin-bottom: 14px; color: var(--black); }
.dmi-sugg { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; }
.dmi-sugg button { background: var(--grey); border-radius: 12px; padding: 12px 4px 10px; display: flex; flex-direction: column; align-items: center; gap: 8px; font-size: 12px; font-weight: 500; }
.dmi-activity-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--grey-2); width: 100%; text-align: left; }
.dmi-activity-item:last-child { border-bottom: 0; padding-bottom: 0; }
.dmi-meta { flex: 1; min-width: 0; }
.dmi-activity-item b { font-size: 14px; font-weight: 600; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dmi-activity-item small { font-size: 12px; color: var(--muted); }
.dmi-activity-item .dmi-amt { font-size: 14px; font-weight: 600; font-variant-numeric: tabular-nums; }
.dmi-activity-item .dmi-in { color: var(--green); }

.dmi-tabbar {
  position: absolute; bottom: 0; left: 0; right: 0; height: 88px; padding: 10px 8px 0; z-index: 5;
  background: rgba(255,255,255,.88); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  display: grid; grid-template-columns: repeat(5,1fr); border-top: 1px solid var(--grey-2);
}
.dmi-tabbar button { display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 12px; color: #9A9A9A; font-weight: 500; }
.dmi-tabbar .dmi-on { color: var(--black); }

.dmi-bank-av { width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; flex: none; color: #fff; font-weight: 700; font-size: 13px; box-shadow: 0 0 0 3px var(--ring, #eee); }
.dmi-mark { background: url("data:image/png;base64,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") 0 50% / auto 100% no-repeat; }

.dmi-send-top { background: var(--white); padding: 4px 16px 20px; display: flex; flex-direction: column; gap: 16px; }
.dmi-segment { background: var(--grey); border-radius: 14px; padding: 4px; display: grid; grid-template-columns: 1fr 1fr; }
.dmi-segment button { height: 42px; border-radius: 11px; font-size: 15px; font-weight: 500; color: #A3A3A3; }
.dmi-segment .dmi-on { background: var(--white); color: var(--black); box-shadow: 0 1px 2px rgba(0,0,0,.06); }
.dmi-label { font-size: 14px; font-weight: 500; margin-bottom: 8px; display: block; }
.dmi-input-wrap { position: relative; }
.dmi-input {
  width: 100%; height: 52px; border: 1px solid var(--border); border-radius: 12px; background: var(--white);
  padding: 0 48px 0 16px; font-size: 15px; outline: none; transition: border-color .15s, box-shadow .15s;
}
.dmi-input::placeholder { color: #B0B0B0; }
.dmi-input:focus { border-color: var(--yellow); box-shadow: 0 0 0 3px rgba(255,204,0,.2); }
.dmi-trail { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); pointer-events: none; display: flex; }
.dmi-row-btn { display: flex; align-items: center; gap: 12px; width: 100%; border: 1px solid var(--border); border-radius: 14px; padding: 12px 14px; font-size: 16px; font-weight: 500; text-align: left; }
.dmi-row-btn .dmi-ic { width: 40px; height: 40px; border-radius: 50%; background: var(--grey); display: grid; place-items: center; flex: none; }
.dmi-row-btn .dmi-grow { flex: 1; }
.dmi-list-card { margin: 20px 16px 40px; background: var(--white); border-radius: 16px; border: 1px solid var(--grey-2); overflow: hidden; }
.dmi-tabs { display: flex; gap: 16px; padding: 18px 18px 14px; font-size: 16px; font-weight: 600; background: var(--grey); }
.dmi-tabs button { color: #B5B5B5; } .dmi-tabs .dmi-on { color: var(--black); }
.dmi-person { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid var(--grey-2); width: 100%; text-align: left; }
.dmi-person:last-child { border-bottom: 0; }
.dmi-person b { font-size: 15px; font-weight: 600; display: block; }
.dmi-person small { font-size: 12px; color: var(--muted); display: flex; align-items: center; gap: 6px; margin-top: 3px; }
.dmi-person small i { width: 3px; height: 3px; border-radius: 50%; background: var(--muted); }
.dmi-empty { padding: 28px 16px; text-align: center; color: var(--muted); font-size: 14px; }

.dmi-pad { padding: 16px; background: var(--white); }
.dmi-grey-card { background: var(--grey); border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 6px; }
.dmi-grey-card .dmi-label { font-size: 13px; color: var(--text-2); margin: 8px 0 6px; }
.dmi-grey-card .dmi-label:first-child { margin-top: 0; }
.dmi-grey-card .dmi-input { border-color: transparent; }
.dmi-select { appearance: none; cursor: pointer; }
.dmi-resolved { margin-top: 10px; font-size: 13px; color: var(--text-2); }
.dmi-resolved b { display: flex; align-items: center; gap: 6px; font-size: 15px; color: var(--black); font-weight: 600; margin-top: 6px; }
.dmi-err b { color: var(--red); font-weight: 500; font-size: 14px; }
.dmi-spin { width: 16px; height: 16px; border: 2px solid rgba(13,13,13,.15); border-top-color: var(--black); border-radius: 50%; animation: dmi-spin .7s linear infinite; display: inline-block; }
@keyframes dmi-spin { to { transform: rotate(360deg); } }

.dmi-bal-pill { margin: 4px auto 14px; display: flex; align-items: center; gap: 6px; background: var(--grey); border-radius: 999px; padding: 8px 14px; font-size: 13px; font-weight: 500; width: fit-content; }
.dmi-amt-card { background: var(--cream); border: 1px solid #FBEFC0; border-radius: 16px; padding: 14px 16px 16px; }
.dmi-amt-top { display: flex; justify-content: space-between; font-size: 13px; color: var(--text-2); }
.dmi-amt-top span:last-child { color: var(--muted); }
.dmi-amt-input { display: flex; align-items: baseline; margin-top: 10px; }
.dmi-amt-input span { font-size: 28px; font-weight: 600; color: var(--black); }
.dmi-amt-input input { border: 0; outline: 0; background: transparent; font-size: 32px; font-weight: 700; letter-spacing: -.02em; width: 100%; font-variant-numeric: tabular-nums; }
.dmi-amt-input input::placeholder { color: #C9C2A4; }
.dmi-connector { width: 30px; height: 30px; border-radius: 50%; background: var(--white); border: 1px solid var(--border); display: grid; place-items: center; margin: -10px auto; position: relative; z-index: 1; }
.dmi-to-card { background: var(--grey); border-radius: 16px; overflow: hidden; }
.dmi-to-card .dmi-inner { padding: 18px 16px 14px; display: flex; justify-content: space-between; gap: 12px; font-size: 13px; }
.dmi-to-card .dmi-inner small { color: var(--muted); display: block; margin-bottom: 6px; font-size: 12px; }
.dmi-to-card .dmi-inner b { font-weight: 600; font-size: 14px; }
.dmi-to-card .dmi-r { text-align: right; }
.dmi-note { background: var(--grey-2); padding: 10px 16px; font-size: 12px; color: var(--text-2); }
.dmi-note-err { background: #FDECEC; color: var(--red); }
.dmi-note-input { margin-top: 14px; }
.dmi-note-input .dmi-input { padding-right: 16px; }
.dmi-toggle-row { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; font-size: 14px; font-weight: 500; }
.dmi-switch { width: 44px; height: 26px; border-radius: 13px; background: var(--grey-2); position: relative; }
.dmi-switch::after { content: ""; position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.2); }

.dmi-scrim { position: absolute; inset: 0; background: rgba(0,0,0,.4); z-index: 40; opacity: 0; pointer-events: none; transition: opacity .25s; }
.dmi-show-scrim { opacity: 1; pointer-events: auto; }
.dmi-sheet {
  position: absolute; left: 0; right: 0; bottom: 0; z-index: 50; background: var(--white); border-radius: 24px 24px 0 0;
  transform: translateY(105%); transition: transform .32s var(--ease); padding: 10px 16px 34px; max-height: 92%; display: flex; flex-direction: column;
}
.dmi-show { transform: none; }
.dmi-grab { width: 36px; height: 4px; border-radius: 2px; background: var(--grey-2); margin: 0 auto 18px; flex: none; }
.dmi-sheet h2 { font-size: 18px; font-weight: 600; color: var(--black); }

.dmi-loader { align-items: center; text-align: center; padding-top: 80px; padding-bottom: 120px; }
.dmi-ring { width: 64px; height: 64px; border-radius: 50%; border: 3px solid #FFF1B3; border-top-color: var(--yellow); animation: dmi-spin .9s linear infinite; }
.dmi-ring-wrap { position: relative; width: 64px; height: 64px; }
.dmi-ring-wrap .dmi-mark { position: absolute; inset: 21px 19px; }
.dmi-loader p { color: var(--muted); font-size: 15px; margin-top: 14px; }
.dmi-loader small { display: block; font-size: 13px; color: var(--text-2); margin-top: 8px; max-width: 260px; line-height: 19px; }

.dmi-send-to { display: flex; align-items: center; gap: 10px; margin: 16px 0 20px; }
.dmi-send-to small { font-size: 12px; color: var(--muted); display: block; }
.dmi-send-to b { font-size: 14px; font-weight: 600; }
.dmi-sec-label { font-size: 12px; color: var(--muted); margin-bottom: 8px; }
.dmi-details { background: var(--grey); border-radius: 14px; margin-bottom: 20px; }
.dmi-details .dmi-r { display: flex; justify-content: space-between; align-items: center; padding: 15px 14px; font-size: 14px; border-bottom: 1px solid var(--white); }
.dmi-details .dmi-r:last-child { border-bottom: 0; }
.dmi-details .dmi-r > span:first-child { color: var(--muted); display: flex; align-items: center; gap: 6px; }
.dmi-details .dmi-r > span:last-child { font-weight: 500; font-variant-numeric: tabular-nums; }
.dmi-new-badge { font-style: normal; background: var(--yellow); color: var(--black); font-size: 10px; font-weight: 600; padding: 2px 5px; border-radius: 4px; }
.dmi-details select { border: 0; background: transparent; font-weight: 500; font-size: 14px; outline: none; cursor: pointer; text-align: right; }

.dmi-pin-sheet { padding-left: 0; padding-right: 0; padding-bottom: 28px; background: #D1D3D9; }
.dmi-pin-top { background: var(--white); margin-top: -10px; padding: 10px 16px 28px; border-radius: 24px 24px 0 0; text-align: center; }
.dmi-pin-top .dmi-grab { margin-bottom: 26px; }
.dmi-pin-top small { display: inline-flex; align-items: center; gap: 6px; color: var(--text-2); font-size: 13px; margin-top: 18px; }
.dmi-pin-boxes { display: flex; justify-content: center; gap: 12px; margin-top: 18px; }
.dmi-pin-boxes span { width: 48px; height: 48px; border-radius: 10px; border: 1px solid var(--border); display: grid; place-items: center; }
.dmi-pin-boxes .dmi-on { border-color: var(--yellow); border-width: 2px; }
.dmi-pin-boxes .dmi-filled::after { content: ""; width: 10px; height: 10px; border-radius: 50%; background: var(--black); }
.dmi-keypad { display: grid; grid-template-columns: repeat(3,1fr); gap: 7px; padding: 8px 7px 0; }
.dmi-keypad button { height: 46px; border-radius: 6px; background: var(--white); box-shadow: 0 1px 0 rgba(0,0,0,.3); display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 24px; font-weight: 400; line-height: 1; }
.dmi-keypad button small { font-size: 9px; font-weight: 600; letter-spacing: .15em; margin-top: 1px; }
.dmi-keypad .dmi-ghost { background: transparent; box-shadow: none; }
.dmi-keypad button:active { background: #BCC0C7; }

.dmi-success { top: 54px; max-height: none; align-items: center; text-align: center; padding-top: 16px; }
.dmi-success .dmi-close { align-self: flex-end; }
.dmi-art { margin-top: 70px; }
.dmi-success h2 { font-size: 24px; font-weight: 600; margin-top: 22px; letter-spacing: -.01em; }
.dmi-success p { font-size: 14px; color: var(--text-2); margin-top: 10px; line-height: 21px; max-width: 300px; }
.dmi-two { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; width: 100%; margin-top: auto; }
.dmi-success > .dmi-btn { margin-top: auto; }

.dmi-td-bg { background: linear-gradient(180deg, #FFE680 0%, #FFF4C2 30%, var(--bg) 62%); }
.dmi-td-bg .dmi-nav { background: transparent; }
.dmi-td { padding: 4px 12px 40px; display: flex; flex-direction: column; gap: 12px; }
.dmi-td-head { display: flex; justify-content: space-between; align-items: flex-start; }
.dmi-td-amt { text-align: right; }
.dmi-td-amt b { font-size: 22px; font-weight: 700; letter-spacing: -.01em; font-variant-numeric: tabular-nums; }
.dmi-td-amt small { display: block; color: var(--green); font-size: 12px; font-weight: 500; margin-top: 2px; }
.dmi-td-name { margin-top: 12px; font-size: 15px; font-weight: 600; }
.dmi-td-sub { font-size: 12px; color: var(--muted); margin-top: 3px; }
.dmi-cat-row { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; }
.dmi-cat-chip { display: inline-flex; align-items: center; gap: 6px; background: var(--grey); border-radius: 6px; padding: 5px 8px; font-size: 12px; font-weight: 500; }
.dmi-track { margin-top: 18px; padding-top: 14px; border-top: 1px dashed var(--border); }
.dmi-track p { font-size: 13px; color: var(--green); font-weight: 500; }
.dmi-bar { height: 6px; border-radius: 3px; background: var(--green); margin: 12px 0 8px; position: relative; }
.dmi-bar::after { content: ""; position: absolute; right: -2px; top: -4px; width: 14px; height: 14px; border-radius: 50%; background: var(--green); box-shadow: 0 0 0 3px #fff; }
.dmi-steps { display: grid; grid-template-columns: repeat(3,1fr); font-size: 12px; font-weight: 500; }
.dmi-steps span:nth-child(2) { text-align: center; } .dmi-steps span:nth-child(3) { text-align: right; }
.dmi-steps small { display: block; color: var(--muted); font-weight: 400; font-size: 11px; margin-top: 2px; }
.dmi-td-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 18px; }
.dmi-td-actions button { height: 42px; border: 1px solid var(--border); border-radius: 10px; font-size: 13px; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 6px; }
.dmi-link-row { display: flex; align-items: center; gap: 12px; width: 100%; text-align: left; }
.dmi-link-row .dmi-ic { width: 36px; height: 36px; border-radius: 50%; background: var(--cream); display: grid; place-items: center; flex: none; }
.dmi-link-row b { font-size: 14px; font-weight: 600; display: block; } .dmi-link-row small { font-size: 12px; color: var(--muted); }
.dmi-link-row .dmi-grow { flex: 1; }
.dmi-kv { padding: 12px 0; border-bottom: 1px solid var(--grey-2); }
.dmi-kv:first-child { padding-top: 0; } .dmi-kv:last-child { border-bottom: 0; padding-bottom: 0; }
.dmi-kv small { font-size: 12px; color: var(--muted); display: block; margin-bottom: 4px; }
.dmi-kv div { font-size: 14px; font-weight: 500; display: flex; justify-content: space-between; align-items: center; gap: 8px; word-break: break-all; }

.dmi-toast { position: absolute; left: 50%; bottom: 110px; transform: translate(-50%, 20px); background: var(--black); color: #fff; font-size: 13px; padding: 10px 16px; border-radius: 10px; opacity: 0; transition: .25s var(--ease); z-index: 80; white-space: nowrap; pointer-events: none; }
.dmi-toast-on { opacity: 1; transform: translate(-50%, 0); }

@container (max-width: 440px) {
  .dmi-phone { width: 100%; height: 760px; border-radius: 20px; box-shadow: none; }
  .dmi-statusbar, .dmi-home-indicator { display: none; }
  .dmi-nav { padding-top: 16px; } .dmi-hero { padding-top: 20px; }
  .dmi-success { top: 12px; }
}
@media (max-width: 480px) { .dmi-root { padding: 0; background: transparent; } }
`;

  // Every class is prefixed so the docs site's styles and ours never collide.
  const k = (names) => names.split(' ').filter(Boolean).map((n) => 'dmi-' + n).join(' ');

  const FEE = 10;
  const MAX = 1000000;
  const BANK = 'Nombank MFB';
  const OWN_ACCOUNT = '0089234553';
  const RECENTS_KEY = 'nomba-demo-inflow-recents';
  const REJECTIONS = {
    '07': 'This virtual account has expired, so it can’t receive transfers.',
    '08': 'The sender name doesn’t match the account name.',
  };
  const KEYS = [['1', ''], ['2', 'ABC'], ['3', 'DEF'], ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'], ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ'], ['bio', ''], ['0', ''], ['del', '']];
  const CATEGORIES = ['General', 'Rent & Housing', 'Food and Dining', 'Family & Kids', 'Bills & Utility', 'Shopping', 'Education'];

  const fmt = (n) => n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const naira = (n) => '₦' + fmt(n);
  const initials = (name) => String(name || '').split(/\s+/).slice(0, 2).map((w) => w[0] || '').join('').toUpperCase();

  const [screen, setScreen] = useState('home');
  const [sheet, setSheet] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [toastOn, setToastOn] = useState(false);
  const [balance, setBalance] = useState(121271.67);
  const [hidden, setHidden] = useState(false);
  const [activity, setActivity] = useState([
    { name: 'Abodunrin Abdullahi', sub: 'Inflow • 3:45pm', amt: 2000, dir: 'in', bank: BANK },
    { name: 'Chinonso Okafor', sub: 'Outflow • Yesterday', amt: 15000, dir: 'out', bank: 'Carbon MFB' },
    { name: 'MTN Airtime', sub: 'Bills • 12 Nov', amt: 1000, dir: 'out', bank: 'Sterling Bank' },
  ]);
  const [recents, setRecents] = useState([]);
  const [tab, setTab] = useState('recents');
  const [search, setSearch] = useState('');
  const [acct, setAcct] = useState('');
  const [lookup, setLookup] = useState({ status: 'idle', text: '' });
  const [amt, setAmt] = useState('');
  const [narration, setNarration] = useState('');
  const [category, setCategory] = useState('General');
  const [pin, setPin] = useState('');
  const [tx, setTx] = useState({});
  const [failMsg, setFailMsg] = useState('');

  const toastTimer = useRef(null);
  const lookupTimer = useRef(null);
  const lookupSeq = useRef(0);
  const acctInput = useRef(null);
  const amtInput = useRef(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(RECENTS_KEY) || '[]');
      if (Array.isArray(saved)) setRecents(saved.slice(0, 8));
    } catch (_) {}
    return () => {
      clearTimeout(toastTimer.current);
      clearTimeout(lookupTimer.current);
    };
  }, []);

  // Sandbox API. Add ?api=<base> to the page URL to point it elsewhere.
  const apiBase = () => {
    try {
      const v = new URLSearchParams(window.location.search).get('api');
      if (v) return v.replace(/\/+$/, '');
    } catch (_) {}
    return 'https://sandbox.nomba.com/v1';
  };

  const api = async (path, body) => {
    let res;
    let json = {};
    try {
      res = await fetch(apiBase() + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    } catch (_) {
      return { ok: false, message: 'We couldn’t reach the Nomba sandbox. Check your connection and try again.' };
    }
    try { json = await res.json(); } catch (_) {}
    if (res.status === 429) return { ok: false, message: 'Too many attempts. Wait a minute and try again.' };
    if (res.status === 404) return { ok: false, message: 'We couldn’t find this account. Check the account number.' };
    if (!res.ok || !json.data) return { ok: false, message: json.description || 'Something went wrong. Try again.' };
    return { ok: true, data: json.data };
  };

  const toast = (msg) => {
    setToastMsg(msg);
    setToastOn(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastOn(false), 1800);
  };
  const soon = (label) => () => toast(label + ' isn’t part of the demo');
  const copy = (text, msg) => {
    try { navigator.clipboard.writeText(text).catch(() => {}); } catch (_) {}
    toast(msg);
  };
  const focusLater = (ref) => setTimeout(() => ref.current && ref.current.focus({ preventScroll: true }), 60);

  const rememberRecent = (p) => setRecents((prev) => {
    const next = [p, ...prev.filter((r) => r.acct !== p.acct)].slice(0, 8);
    try { window.localStorage.setItem(RECENTS_KEY, JSON.stringify(next)); } catch (_) {}
    return next;
  });

  const avatar = (bank, name, size = 40) => {
    const nomba = bank === BANK;
    return (
      <span
        className={k('bank-av')}
        style={{ width: size, height: size, fontSize: size < 40 ? 12 : 13, background: nomba ? '#0D0D0D' : '#555', color: nomba ? '#FFCC00' : '#fff', '--ring': nomba ? '#FFCC00' : '#ddd' }}
      >
        {initials(name)}
      </span>
    );
  };

  // ---------- Icons ----------
  const back = (to) => (
    <button className={k('icon-btn')} onClick={() => setScreen(to)} aria-label="Back">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
    </button>
  );
  const chevron = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6" /></svg>;
  const copyIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A8A8A" strokeWidth="2"><rect x="8" y="8" width="13" height="13" rx="2.5" /><path d="M5 16H4.5A1.5 1.5 0 0 1 3 14.5v-10A1.5 1.5 0 0 1 4.5 3h10A1.5 1.5 0 0 1 16 4.5V5" /></svg>;

  // ---------- Lookup ----------
  const runLookup = (value) => {
    const seq = ++lookupSeq.current;
    clearTimeout(lookupTimer.current);
    if (value.length !== 10) { setLookup({ status: 'idle', text: '' }); return; }
    if (value[0] !== '0') { setLookup({ status: 'err', text: 'Only SIMULATED sandbox accounts can be paid here. Their numbers start with 0.' }); return; }
    setLookup({ status: 'loading', text: '' });
    lookupTimer.current = setTimeout(async () => {
      const res = await api('/demo-inflow/lookup', { accountNumber: value });
      if (seq !== lookupSeq.current) return; // the number changed while we waited
      setLookup(res.ok ? { status: 'ok', text: res.data.accountName } : { status: 'err', text: res.message });
    }, 300);
  };
  const openLookup = (value) => {
    setAcct(value);
    setScreen('lookup');
    runLookup(value);
    focusLater(acctInput);
  };

  // ---------- Amount ----------
  const startAmount = (name, bank, number) => {
    setTx({ name, bank, acct: number });
    setAmt('');
    setNarration('');
    setScreen('amount');
    focusLater(amtInput);
  };
  const amtValue = parseFloat(amt.replace(/,/g, '')) || 0;
  let amtErr = '';
  if (amtValue && amtValue < 100) amtErr = 'The minimum you can send is ₦100.00.';
  else if (amtValue + FEE > balance) amtErr = `Insufficient balance. You have ${naira(balance)} (₦10.00 fee applies).`;
  else if (amtValue > MAX) amtErr = `The maximum per transfer is ${naira(MAX)}.`;

  const onAmount = (e) => {
    const raw = e.target.value.replace(/[^\d.]/g, '');
    const [i, d] = raw.split('.');
    setAmt(raw ? (i ? (+i).toLocaleString('en-NG') : '0') + (d !== undefined ? '.' + d.slice(0, 2) : '') : '');
  };
  const proceedAmount = () => {
    setTx((t) => ({ ...t, amount: naira(amtValue), fee: naira(FEE), debit: '- ' + naira(amtValue + FEE), value: amtValue, note: narration.trim() || '—' }));
    if (amtInput.current) amtInput.current.blur();
    setSheet('loading');
    setTimeout(() => setSheet('confirm'), 1100);
  };

  // ---------- PIN + submit ----------
  const pressKey = (key) => {
    if (key === 'bio') { toast('Biometrics aren’t available in the demo'); return; }
    setPin((p) => (key === 'del' ? p.slice(0, -1) : p.length < 4 ? p + key : p));
  };

  const submit = async () => {
    setSheet('loading');
    const res = await api('/demo-inflow/transfer', { accountNumber: tx.acct, amount: tx.value, narration: tx.note === '—' ? '' : tx.note });
    if (!res.ok) { setFailMsg(res.message); setSheet('failed'); return; }
    if (res.data.status !== 'SUCCESS') {
      setFailMsg(REJECTIONS[res.data.responseCode] || `The transfer was rejected (code ${res.data.responseCode}).`);
      setSheet('failed');
      return;
    }
    const now = new Date();
    const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    setBalance((b) => Math.round((b - tx.value - FEE) * 100) / 100);
    setTx((t) => ({
      ...t,
      time,
      date: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + time,
      session: res.data.sessionId || '',
      ref: res.data.transactionRef || '',
    }));
    setActivity((a) => [{ name: tx.name, sub: 'Outflow • ' + time, amt: tx.value + FEE, dir: 'out', bank: tx.bank }, ...a]);
    rememberRecent({ name: tx.name, acct: tx.acct, bank: tx.bank });
    setSheet('success');
  };

  useEffect(() => {
    if (sheet !== 'pin' || pin.length !== 4) return undefined;
    const t = setTimeout(submit, 220);
    return () => clearTimeout(t);
  }, [pin, sheet]);

  useEffect(() => {
    if (sheet !== 'pin') return undefined;
    const onKey = (e) => {
      if (/^\d$/.test(e.key)) pressKey(e.key);
      else if (e.key === 'Backspace') pressKey('del');
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [sheet]);

  const home = () => { setSheet(null); setScreen('home'); };
  const share = async () => {
    const text = `Nomba Demo Inflow receipt\n${tx.amount} to ${tx.name} (${tx.bank} ${tx.acct})\n${tx.date}\nSession ID: ${tx.session}\nTransaction ref: ${tx.ref}`;
    try {
      if (navigator.share) await navigator.share({ text });
      else { await navigator.clipboard.writeText(text); toast('Receipt copied'); }
    } catch (_) {}
  };

  // ---------- Screens ----------
  const [balWhole, balDec] = fmt(balance).split('.');
  const filter = /^\d{10}$/.test(search.trim()) ? '' : search.trim().toLowerCase();
  const people = recents.filter((p) => !filter || p.name.toLowerCase().includes(filter) || p.acct.includes(filter));

  const homeScreen = (
    <section className={k('screen')}>
      <div className={k('scroll')}>
        <div className={k('hero')}>
          <div className={k('swirl s1')} /><div className={k('swirl s2')} />
          <div className={k('hero-top')}>
            <div className={k('avatar')}>SA</div>
            <button className={k('round-dark')} data-soon onClick={soon('Scan to pay')} aria-label="Scan QR">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><path d="M14 14h3v3M21 14v.01M14 21h3M21 17v4h-1" /></svg>
            </button>
          </div>
          <div className={k('bal')}>
            <div className={k('acct-type')}>Personal - NGN <span className={k('flag-ng')} style={{ width: 14, height: 14 }} /></div>
            <div className={k('amount')}>
              <strong>{hidden ? '₦ ••••••' : <>₦{balWhole}<small>.{balDec}</small></>}</strong>
              <button className={k('eye')} onClick={() => setHidden(!hidden)} aria-label={hidden ? 'Show balance' : 'Hide balance'}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="2.4"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
              </button>
            </div>
            <button className={k('acct-chip')} onClick={() => copy(OWN_ACCOUNT, 'Account number copied')}>
              {OWN_ACCOUNT}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#0D0D0D"><rect x="8" y="8" width="13" height="13" rx="2.5" /><path d="M5 16H4.5A1.5 1.5 0 0 1 3 14.5v-10A1.5 1.5 0 0 1 4.5 3h10A1.5 1.5 0 0 1 16 4.5V5" stroke="#0D0D0D" strokeWidth="2" fill="none" /></svg>
            </button>
            <div className={k('dots')}><i /><i /><i /></div>
          </div>
          <div className={k('actions')}>
            <button className={k('action')} data-soon onClick={soon('Add money')}><span className={k('circle')}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg></span>Add money</button>
            <button className={k('action live')} onClick={() => { setSearch(''); setScreen('sendto'); }}><span className={k('circle')}><svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M21.4 2.6a1 1 0 0 0-1.1-.2l-17 7a1 1 0 0 0 .1 1.9l7 2.3 2.3 7a1 1 0 0 0 1.9.1l7-17a1 1 0 0 0-.2-1.1zM13.6 17.3l-1.5-4.6 3.6-3.6-1.4-1.4-3.6 3.6-4.6-1.5 11.2-4.6-3.7 12.1z" /></svg></span>Transfer</button>
            <button className={k('action')} data-soon onClick={soon('Pay Bills')}><span className={k('circle')}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2V3z" /><path d="M9 15l6-6M9.5 9.5h.01M14.5 14.5h.01" /></svg></span>Pay Bills</button>
            <button className={k('action')} data-soon onClick={soon('More')}><span className={k('circle')}><svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg></span>More</button>
          </div>
        </div>

        <div className={k('home-body')}>
          <div className={k('banner')}>
            <div className={k('emoji')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="2.2" strokeLinecap="round"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3" /></svg></div>
            <div><b>You're in Demo Inflow</b><p>Test mode. Transfers here move no real money.</p></div>
          </div>
          <div className={k('card')}>
            <h3>Suggestion</h3>
            <div className={k('sugg')}>
              <button data-soon onClick={soon('Airtime')}><svg width="22" height="22" viewBox="0 0 24 24" fill="#E5484D"><path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8z" /></svg>Airtime</button>
              <button data-soon onClick={soon('Data')}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#189144" strokeWidth="2.4" strokeLinecap="round"><path d="M2 8.8a15 15 0 0 1 20 0M5 12.6a10 10 0 0 1 14 0M8.5 16.4a5 5 0 0 1 7 0" /><circle cx="12" cy="20" r="1" fill="#189144" /></svg>Data</button>
              <button data-soon onClick={soon('Savings')}><svg width="22" height="22" viewBox="0 0 24 24" fill="#0E9384"><path d="M19 9.5c-.5-2.8-3.4-5-7-5-1.4 0-2.7.3-3.8.9L6 4v3.3A6.2 6.2 0 0 0 4.4 10H3v4h1.7c.5 1.2 1.3 2.2 2.3 3V20h3v-1.7c.6.1 1.3.2 2 .2s1.4-.1 2-.2V20h3v-3c1.4-1.1 2.3-2.6 2.5-4.3H21v-3.2h-2zM15 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" /></svg>Savings</button>
              <button data-soon onClick={soon('Rewards')}><svg width="22" height="22" viewBox="0 0 24 24" fill="#F76808"><path d="M20 7h-2.2A3 3 0 0 0 12 3.8 3 3 0 0 0 6.2 7H4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h7V7h2v5h7a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zM9 7a1 1 0 1 1 1-1v1H9zm6 0h-1V6a1 1 0 1 1 1 1zM4 13v7a1 1 0 0 0 1 1h6v-8H4zm9 8h6a1 1 0 0 0 1-1v-7h-7v8z" /></svg>Rewards</button>
            </div>
          </div>
          <div className={k('card')}>
            <h3 style={{ marginBottom: 2 }}>Activity</h3>
            {activity.slice(0, 4).map((a, i) => (
              <div className={k('activity-item')} key={i}>
                {avatar(a.bank, a.name, 36)}
                <div className={k('meta')}><b>{a.name}</b><small>{a.sub}</small></div>
                <span className={k('amt ' + a.dir)}>{(a.dir === 'in' ? '+ ' : '- ') + naira(a.amt)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <nav className={k('tabbar')}>
        <button className={k('on')}><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6 3.5a2 2 0 0 1 2.8 0l7 6.6c.4.4.6.9.6 1.5V19a2 2 0 0 1-2 2h-3.5v-5.5h-7V21H5a2 2 0 0 1-2-2v-7.4c0-.6.2-1.1.6-1.5l7-6.6z" /></svg>Home</button>
        <button data-soon onClick={soon('Spending')}><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M11 3.1A9 9 0 1 0 20.9 13H11V3.1z" /><path d="M13 2v9h9a9 9 0 0 0-9-9z" opacity=".6" /></svg>Spending</button>
        <button data-soon onClick={soon('Black')}><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" /></svg>Black</button>
        <button data-soon onClick={soon('Payment')}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3l4 4-4 4M21 7H8M7 21l-4-4 4-4M3 17h13" /></svg>Payment</button>
        <button data-soon onClick={soon('More')}><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="2.5" /><rect x="13" y="3" width="8" height="8" rx="2.5" /><rect x="3" y="13" width="8" height="8" rx="2.5" /><rect x="13" y="13" width="8" height="8" rx="2.5" /></svg>More</button>
      </nav>
    </section>
  );

  const sendToScreen = (
    <section className={k('screen')}>
      <div className={k('nav')}>
        {back('home')}
        <h1>Sending to <span className={k('country')}><span className={k('flag-ng')} />Nigeria<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5C5C5C" strokeWidth="2.4" strokeLinecap="round"><path d="m6 9 6 6 6-6" /></svg></span></h1>
        <span />
      </div>
      <div className={k('scroll')}>
        <div className={k('send-top')}>
          <div className={k('segment')}><button className={k('on')}>Single transfer</button><button data-soon onClick={soon('Bulk transfer')}>Bulk transfer</button></div>
          <div>
            <label className={k('label')} htmlFor="dmi-search">Enter receiver's details (NGN)</label>
            <div className={k('input-wrap')}>
              <input
                className={k('input')}
                id="dmi-search"
                placeholder="Name, phone or account number"
                autoComplete="off"
                value={search}
                onChange={(e) => {
                  const v = e.target.value;
                  setSearch(v);
                  if (/^\d{10}$/.test(v.trim())) openLookup(v.trim());
                }}
              />
              <span className={k('trail')}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8A8A8A" strokeWidth="1.8" strokeLinejoin="round"><path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.8l1.5-2h6.4l1.5 2h1.8A2.5 2.5 0 0 1 21 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-9z" /><circle cx="12" cy="13" r="3.5" /></svg></span>
            </div>
          </div>
          <button className={k('row-btn')} data-soon onClick={soon('Transfer between accounts')}>
            <span className={k('ic')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E6B000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7H9a5 5 0 0 0 0 10h1M17 4l3 3-3 3M4 17h11a5 5 0 0 0 0-10h-1M7 20l-3-3 3-3" /></svg></span>
            <span className={k('grow')}>Transfer between accounts</span>
            {chevron}
          </button>
        </div>
        <div className={k('list-card')}>
          <div className={k('tabs')}>
            <button className={k(tab === 'recents' ? 'on' : '')} onClick={() => setTab('recents')}>Recents</button>
            <button className={k(tab === 'benef' ? 'on' : '')} onClick={() => setTab('benef')}>Beneficiaries</button>
          </div>
          {people.length ? people.map((p) => (
            <button className={k('person')} key={p.acct} onClick={() => startAmount(p.name, p.bank, p.acct)}>
              {avatar(p.bank, p.name)}
              <span className={k('meta')}><b>{p.name}</b><small>{p.acct}<i />{p.bank}</small></span>
              {chevron}
            </button>
          )) : (
            <div className={k('empty')}>
              {recents.length
                ? 'No match. Type a 10-digit account number to send to someone new.'
                : 'Type the 10-digit number of a SIMULATED sandbox virtual account. Simulated account numbers start with 0.'}
            </div>
          )}
        </div>
      </div>
    </section>
  );

  const lookupScreen = (
    <section className={k('screen')}>
      <div className={k('nav')}>{back('sendto')}<h1>Transfer</h1><span /></div>
      <div className={k('scroll pad')}>
        <div className={k('grey-card')}>
          <label className={k('label')} htmlFor="dmi-acct">Enter account number</label>
          <input
            ref={acctInput}
            className={k('input')}
            id="dmi-acct"
            inputMode="numeric"
            maxLength={10}
            placeholder="10-digit account number"
            autoComplete="off"
            value={acct}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '').slice(0, 10);
              setAcct(v);
              runLookup(v);
            }}
          />
          <label className={k('label')} htmlFor="dmi-bank">Select bank</label>
          <div className={k('input-wrap')}>
            <select className={k('input select')} id="dmi-bank" value={BANK} onChange={() => runLookup(acct)}><option>{BANK}</option></select>
            <span className={k('trail')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A8A8A" strokeWidth="2.2" strokeLinecap="round"><path d="m6 9 6 6 6-6" /></svg></span>
          </div>
          {lookup.status !== 'idle' && (
            <div className={k('resolved' + (lookup.status === 'err' ? ' err' : ''))} aria-live="polite">
              You are sending to:
              <b>{lookup.status === 'loading' ? <><span className={k('spin')} /> Verifying account…</> : lookup.text}</b>
            </div>
          )}
        </div>
      </div>
      <div className={k('footer')}>
        <button className={k('btn btn-primary')} disabled={lookup.status !== 'ok'} onClick={() => startAmount(lookup.text, BANK, acct)}>Proceed</button>
      </div>
    </section>
  );

  const amountScreen = (
    <section className={k('screen')}>
      <div className={k('nav')}>{back('sendto')}<h1>Enter Amount</h1><span /></div>
      <div className={k('scroll pad')} style={{ paddingTop: 4 }}>
        <div className={k('bal-pill')}>Balance <span>{naira(balance)}</span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5C5C5C" strokeWidth="2.6" strokeLinecap="round"><path d="m6 9 6 6 6-6" /></svg></div>
        <div className={k('amt-card')}>
          <div className={k('amt-top')}><span>Amount you're sending</span><span>Fee: ₦10.00</span></div>
          <label className={k('amt-input')}><span>₦</span><input ref={amtInput} inputMode="decimal" placeholder="0.00" autoComplete="off" aria-label="Amount" value={amt} onChange={onAmount} /></label>
        </div>
        <div className={k('connector')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5C5C5C" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M6 13l6 6 6-6" /></svg></div>
        <div className={k('to-card')}>
          <div className={k('inner')}>
            <div><small>You're sending to:</small><b>{tx.name}</b></div>
            <div className={k('r')}><small>{tx.bank}</small><b>{tx.acct}</b></div>
          </div>
          <div className={k(amtErr ? 'note note-err' : 'note')}>{amtErr || `You can send up to ${naira(MAX)} per transfer in Demo Inflow.`}</div>
        </div>
        <div className={k('note-input')}><input className={k('input')} maxLength={60} placeholder="Add note" autoComplete="off" value={narration} onChange={(e) => setNarration(e.target.value)} /></div>
        <div className={k('toggle-row')}>Schedule transfer <button className={k('switch')} data-soon onClick={soon('Scheduling')} role="switch" aria-checked="false" aria-label="Schedule transfer" /></div>
      </div>
      <div className={k('footer')}><button className={k('btn btn-primary')} disabled={!amtValue || !!amtErr} onClick={proceedAmount}>Proceed</button></div>
    </section>
  );

  const txnScreen = (
    <section className={k('screen td-bg')}>
      <div className={k('nav')}>{back('home')}<h1>Transaction details</h1><span /></div>
      <div className={k('scroll')}>
        <div className={k('td')}>
          <div className={k('card')}>
            <div className={k('td-head')}>
              {avatar(tx.bank, tx.name)}
              <div className={k('td-amt')}><b>{tx.debit}</b><small>Successful</small></div>
            </div>
            <div className={k('td-name')}>{tx.name}</div>
            <div className={k('td-sub')}>{tx.acct} • {tx.date}</div>
            <div className={k('cat-row')}>
              <span className={k('cat-chip')}><svg width="12" height="12" viewBox="0 0 24 24" fill="#E6B000"><circle cx="12" cy="12" r="10" /></svg>{tx.category}</span>
            </div>
            <div className={k('track')}>
              <p>Transfer completed. The recipient has been credited.</p>
              <div className={k('bar')} />
              <div className={k('steps')}>
                <span>Sent<small>{tx.time}</small></span><span>Processing<small>{tx.time}</small></span><span>Received<small>{tx.time}</small></span>
              </div>
            </div>
            <div className={k('td-actions')}>
              <button onClick={share}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v14" /></svg>Share receipt</button>
              <button onClick={() => startAmount(tx.name, tx.bank, tx.acct)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3" /></svg>Repeat transfer</button>
            </div>
          </div>
          <div className={k('card')}>
            <button className={k('link-row')} data-soon onClick={soon('Report transaction')}>
              <span className={k('ic')}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E6B000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22V4s1.5-1 4-1 4 2 7 2 5-1 5-1v11s-2 1-5 1-4.5-2-7-2-4 1-4 1" /></svg></span>
              <span className={k('grow')}><b>Report Transaction</b><small>Report an issue with this payment</small></span>
              {chevron}
            </button>
          </div>
          <div className={k('card')}>
            <div className={k('kv')}><small>Recipient</small><div>{tx.name}</div></div>
            <div className={k('kv')}><small>Bank</small><div>{tx.bank}</div></div>
            <div className={k('kv')}><small>Amount · Fee</small><div>{tx.amount} · {tx.fee}</div></div>
            <div className={k('kv')}><small>Note</small><div>{tx.note}</div></div>
            <div className={k('kv')}><small>Transaction Type</small><div>Bank Transfer</div></div>
            <div className={k('kv')}><small>Session ID</small><div><span>{tx.session}</span><button onClick={() => copy(tx.session, 'Session ID copied')} aria-label="Copy session ID">{copyIcon}</button></div></div>
            <div className={k('kv')}><small>Transaction ref (use it to requery)</small><div><span>{tx.ref}</span><button onClick={() => copy(tx.ref, 'Transaction ref copied')} aria-label="Copy transaction ref">{copyIcon}</button></div></div>
          </div>
        </div>
      </div>
    </section>
  );

  const screens = { home: homeScreen, sendto: sendToScreen, lookup: lookupScreen, amount: amountScreen, txn: txnScreen };
  const sheetClass = (id, extra) => k('sheet ' + extra + (sheet === id ? ' show' : ''));

  return (
    <div className={'not-prose ' + k('root')}>
      <style>{CSS}</style>
      <div className={k('phone')}>
        <div className={k('statusbar')}>
          <span>9:41</span>
          <span className={k('icons')}>
            <svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="#0D0D0D" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="#0D0D0D" /><rect x="10" y="3" width="3" height="9" rx="1" fill="#0D0D0D" /><rect x="15" y="0" width="3" height="12" rx="1" fill="#0D0D0D" /></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 11.5l2.2-2.6a3.2 3.2 0 0 0-4.4 0L8 11.5zM3.6 6.8a6.3 6.3 0 0 1 8.8 0l1.5-1.7a8.6 8.6 0 0 0-11.8 0l1.5 1.7zM.6 3.4a10.7 10.7 0 0 1 14.8 0L16 2.6A12 12 0 0 0 0 2.6l.6.8z" fill="#0D0D0D" /></svg>
            <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x=".5" y=".5" width="23" height="12" rx="3.5" stroke="#0D0D0D" opacity=".4" /><rect x="2" y="2" width="17" height="9" rx="2" fill="#0D0D0D" /><path d="M25 4.5v4a2 2 0 0 0 0-4z" fill="#0D0D0D" opacity=".4" /></svg>
          </span>
        </div>

        <div key={screen} style={{ display: 'contents' }}>{screens[screen]}</div>

        <div className={k('scrim' + (sheet ? ' show-scrim' : ''))} onClick={() => { if (sheet === 'confirm' || sheet === 'pin') setSheet(null); }} />

        <div className={sheetClass('loading', 'loader')} aria-live="polite">
          <div className={k('ring-wrap')}><div className={k('ring')} /><div className={k('mark')} /></div>
          <p>Loading...</p>
          <small>Thank you for your transfer! Together, we're building a cashless Africa.</small>
        </div>

        <div className={sheetClass('confirm', '')} role="dialog" aria-label="Confirm transaction">
          <div className={k('grab')} />
          <h2>Confirm Transaction</h2>
          <div className={k('send-to')}>{avatar(tx.bank, tx.name, 34)}<div><small>Sending to</small><b>{tx.name}</b></div></div>
          <div className={k('sec-label')}>Transaction Details</div>
          <div className={k('details')}>
            <div className={k('r')}><span>Amount</span><span>{tx.amount}</span></div>
            <div className={k('r')}><span>Fee</span><span>{tx.fee}</span></div>
            <div className={k('r')}><span>Note</span><span>{tx.note}</span></div>
            <div className={k('r')}>
              <span>Category <em className={k('new-badge')}>New</em></span>
              <span><select aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></span>
            </div>
          </div>
          <button className={k('btn btn-primary')} onClick={() => { setTx((t) => ({ ...t, category })); setPin(''); setSheet('pin'); }}>Confirm payment</button>
        </div>

        <div className={sheetClass('pin', 'pin-sheet')} role="dialog" aria-label="Enter PIN">
          <div className={k('pin-top')}>
            <div className={k('grab')} />
            <h2>Enter your 4-digit PIN</h2>
            <small><svg width="13" height="13" viewBox="0 0 24 24" fill="#E6B000"><path d="M17 9V7A5 5 0 0 0 7 7v2a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3zM9 7a3 3 0 0 1 6 0v2H9V7z" /></svg>Transaction PIN · any 4 digits in test mode</small>
            <div className={k('pin-boxes')}>
              {[0, 1, 2, 3].map((i) => <span key={i} className={k((i < pin.length ? 'filled ' : '') + (i === pin.length ? 'on' : ''))} />)}
            </div>
          </div>
          <div className={k('keypad')}>
            {KEYS.map(([key, letters]) => key === 'bio' ? (
              <button key={key} className={k('ghost bio')} onClick={() => pressKey('bio')} aria-label="Use biometrics"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="1.6" strokeLinecap="round"><path d="M12 11v3a8 8 0 0 0 1.5 4.7M8.5 13a3.5 3.5 0 0 1 7 0v1M5.5 16.5A13 13 0 0 1 5 13a7 7 0 0 1 12-4.9M19 13v.5M17.5 17.5c.3-1 .5-2 .5-3" /></svg></button>
            ) : key === 'del' ? (
              <button key={key} className={k('ghost')} onClick={() => pressKey('del')} aria-label="Delete"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="1.6" strokeLinejoin="round"><path d="M9 5h11a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9l-6-7 6-7z" /><path d="M12 9.5l5 5M17 9.5l-5 5" strokeLinecap="round" /></svg></button>
            ) : (
              <button key={key} onClick={() => pressKey(key)}>{key}{letters ? <small>{letters}</small> : null}</button>
            ))}
          </div>
        </div>

        <div className={sheetClass('success', 'success')} role="dialog" aria-label="Transaction success">
          <button className={k('icon-btn close')} onClick={home} aria-label="Close"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg></button>
          <svg className={k('art')} width="120" height="88" viewBox="0 0 120 88" fill="none" aria-hidden="true">
            <rect x="10" y="18" width="84" height="56" rx="10" fill="#FFCC00" />
            <rect x="10" y="30" width="84" height="10" fill="#E6B000" />
            <path d="M86 18h14a10 10 0 0 1 10 10v36a10 10 0 0 1-10 10H86z" fill="#0D0D0D" />
            <path d="M96 30c6 4 6 24 0 28" stroke="#FFCC00" strokeWidth="5" strokeLinecap="round" />
            <circle cx="62" cy="38" r="20" fill="#189144" stroke="#fff" strokeWidth="4" />
            <path d="M53 38.5l6 6 11-12" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2>Transaction Success</h2>
          <p>You have successfully sent <b>{tx.amount}</b> to <b>{tx.name}</b>.</p>
          <div className={k('two')}>
            <button className={k('btn btn-outline')} onClick={() => { setSheet(null); setScreen('txn'); }}>View receipt</button>
            <button className={k('btn btn-primary')} onClick={home}>Okay</button>
          </div>
        </div>

        <div className={sheetClass('failed', 'success')} role="dialog" aria-label="Transaction failed">
          <svg className={k('art')} width="88" height="88" viewBox="0 0 88 88" fill="none" aria-hidden="true">
            <circle cx="44" cy="44" r="36" fill="#E5484D" />
            <path d="M32 32l24 24M56 32L32 56" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
          </svg>
          <h2>Transfer Failed</h2>
          <p>{failMsg}</p>
          <button className={k('btn btn-primary')} onClick={home}>Okay</button>
        </div>

        <div className={k('toast' + (toastOn ? ' toast-on' : ''))}>{toastMsg}</div>
        <div className={k('home-indicator')} />
      </div>
    </div>
  );
};
