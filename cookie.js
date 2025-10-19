(function () {
  'use strict';

  const LS_KEY = 'cookieConsentV1';
  const banner = document.getElementById('cc-banner');
  const modal  = document.getElementById('cc-modal');

  const btnAcceptAll = document.getElementById('cc-accept-all');
  const btnAcceptNecessary = document.getElementById('cc-accept-necessary');
  const btnManage = document.getElementById('cc-manage');

  const btnSave = document.getElementById('cc-save');
  const btnSaveNecessary = document.getElementById('cc-save-necessary');
  const btnClose = document.getElementById('cc-close');
  const btnReopen = document.getElementById('cc-reopen');

  const chkAnalytics = document.getElementById('cc-analytics');
  const chkMarketing = document.getElementById('cc-marketing');
  const chkExternal  = document.getElementById('cc-external');

  const defaultConsent = {
    necessary: true,
    analytics: false,
    marketing: false,
    external: false
  };

  function loadConsent() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)); } 
    catch(e){ return null; }
  }

  function saveConsent(c) {
    c.ts = new Date().toISOString();
    localStorage.setItem(LS_KEY, JSON.stringify(c));
  }

  function applyConsent(consent) {
    // Scripts / iFrames aktivieren falls nötig
    document.querySelectorAll('script[type="text/plain"][data-cookiecategory]').forEach(node=>{
      const cat = node.getAttribute('data-cookiecategory');
      if(consent[cat]) {
        const s = document.createElement('script');
        Array.from(node.attributes).forEach(a=>{
          if(a.name!=='type') s.setAttribute(a.name,a.value);
        });
        s.type = 'text/javascript';
        s.text = node.textContent;
        node.parentNode.replaceChild(s,node);
      }
    });
    document.querySelectorAll('[data-cookiecategory][data-src]').forEach(el=>{
      const cat = el.getAttribute('data-cookiecategory');
      if(consent[cat] && !el.getAttribute('src')) el.setAttribute('src', el.getAttribute('data-src'));
    });
  }


  function showBanner(){ if(banner) banner.removeAttribute('hidden'); }
function hideBanner(){ if(banner) banner.setAttribute('hidden',''); }

function openModal(){ if(modal){
    const c = loadConsent() || defaultConsent;
    chkAnalytics.checked = !!c.analytics;
    chkMarketing.checked = !!c.marketing;
    chkExternal.checked  = !!c.external;
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
}}

function closeModal(){ if(modal){
    modal.setAttribute('hidden','');
    document.body.style.overflow = '';
}}


  /*
function showBanner(){ if(banner) banner.hidden = false; }
function hideBanner(){ if(banner) banner.hidden = true; }


function openModal(){
  if(modal){
    const c = loadConsent() || defaultConsent;
    chkAnalytics.checked = !!c.analytics;
    chkMarketing.checked = !!c.marketing;
    chkExternal.checked  = !!c.external;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(){
  if(modal){
    modal.hidden = true;
    document.body.style.overflow = '';
  }
}
  */


  document.addEventListener('DOMContentLoaded', ()=>{
    const current = loadConsent();
    if(!current) showBanner();
    else applyConsent(current);
  });

  btnAcceptAll?.addEventListener('click', ()=>{
    const c = { ...defaultConsent, analytics:true, marketing:true, external:true };
    saveConsent(c); applyConsent(c); hideBanner();
  });

  btnAcceptNecessary?.addEventListener('click', ()=>{
    const c = { ...defaultConsent, analytics:false, marketing:false, external:false };
    saveConsent(c); hideBanner();
  });

  btnManage?.addEventListener('click', ()=>{
    hideBanner(); openModal();
  });

  btnSaveNecessary?.addEventListener('click', ()=>{
    const c = { ...defaultConsent, analytics:false, marketing:false, external:false };
    saveConsent(c); closeModal(); hideBanner();
  });

  btnSave?.addEventListener('click', ()=>{
    const c = {
      ...defaultConsent,
      analytics: chkAnalytics.checked,
      marketing: chkMarketing.checked,
      external: chkExternal.checked
    };
    saveConsent(c); applyConsent(c); closeModal(); hideBanner();
  });

  btnClose?.addEventListener('click', closeModal);
  btnReopen?.addEventListener('click', e=>{ e.preventDefault(); openModal(); });

  modal?.addEventListener('click', e=>{
    if(e.target===modal) closeModal();
  });

  window.addEventListener('keydown', e=>{
    if(e.key==='Escape' && modal && modal.style.display==='flex') closeModal();
  });

})();
