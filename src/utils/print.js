const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export { esc };

/** Prints a small HTML document through a hidden iframe (no popups needed). */
export function printHtml(title, bodyHtml) {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title><style>
    body{font-family:system-ui,Segoe UI,Roboto,sans-serif;color:#111c33;margin:32px;line-height:1.5}
    h1{font-size:24px;margin:0 0 4px} h2{font-size:16px;margin:22px 0 6px} .muted{color:#54607a}
    .tag{display:inline-block;border:1px dashed #54607a;border-radius:99px;padding:2px 10px;font-size:12px;margin-bottom:12px}
    ul{padding-left:20px;margin:6px 0} .bar{height:10px;background:#e8ebf4;border-radius:99px;overflow:hidden;margin:4px 0 10px}
    .bar>i{display:block;height:100%;background:#3447d9} table{border-collapse:collapse;width:100%} td,th{border-bottom:1px solid #d6dcea;padding:6px;text-align:left;font-size:14px}
  </style></head><body>${bodyHtml}</body></html>`);
  doc.close();
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    window.setTimeout(() => iframe.remove(), 1500);
  };
  // Some browsers fire onload before we attach it; fall back after a tick.
  window.setTimeout(() => {
    if (document.body.contains(iframe)) { iframe.contentWindow.focus(); iframe.contentWindow.print(); window.setTimeout(() => iframe.remove(), 1500); }
  }, 600);
}
