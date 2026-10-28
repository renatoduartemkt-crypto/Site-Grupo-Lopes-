const menuButton=document.querySelector('.menu-toggle');
const header=document.querySelector('.site-header');
menuButton?.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));header.classList.toggle('menu-open',!open)});
document.querySelectorAll('.mobile-menu a').forEach(link=>link.addEventListener('click',()=>{menuButton?.setAttribute('aria-expanded','false');header?.classList.remove('menu-open')}));
document.querySelector('#year').textContent=new Date().getFullYear();
const prefersReduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const brands=document.querySelector('.brands');
const slides=[...document.querySelectorAll('.brand-slide')];
const brandCurrent=document.querySelector('#brand-current');
const brandMeter=document.querySelector('.brand-meter span');
let ticking=false;
function clamp(n,min=0,max=1){return Math.min(max,Math.max(min,n))}
function pageZoom(){const value=parseFloat(getComputedStyle(document.body).zoom);return Number.isFinite(value)&&value>0?value:1}
function sectionProgress(section){
 const rect=section.getBoundingClientRect();
 const zoom=pageZoom();
 const headerBottom=header.getBoundingClientRect().bottom;
 const border=parseFloat(getComputedStyle(section).borderTopWidth)*zoom;
 const pinnedHeight=section.querySelector('.brands-sticky').getBoundingClientRect().height;
 const range=section.clientHeight*zoom-pinnedHeight;
 return range>0?clamp((headerBottom-rect.top-border)/range):0;
}
function updateMotion(){
  ticking=false;
  if(!brands||!slides.length)return;
  const flow=prefersReduced.matches||innerWidth<=700||brands.classList.contains('brands-flow');
  const p=flow?0:sectionProgress(brands);
  const active=Math.min(slides.length-1,Math.floor(p*slides.length));
  slides.forEach((slide,index)=>{
    slide.style.removeProperty('transform');
    slide.classList.toggle('is-active',flow||index===active);
    slide.inert=!flow&&index!==active;
    if(flow||index===active)slide.removeAttribute('aria-hidden');
    else slide.setAttribute('aria-hidden','true');
  });
  brandCurrent.textContent=String(active+1).padStart(2,'0');
  brandMeter.style.width=`${p*100}%`;
}
function requestUpdate(){if(!ticking){requestAnimationFrame(updateMotion);ticking=true}}
addEventListener('scroll',requestUpdate,{passive:true});addEventListener('resize',requestUpdate);prefersReduced.addEventListener?.('change',requestUpdate);requestUpdate();

const companyLogos={
  "Distribuidora Lopes": {
    "logo": "lopes.png",
    "style": "lopes"
  },
  "DFS Participações": {
    "logo": "dfs-logo.png",
    "style": "dfs"
  },
  "A2J Representações": {
    "logo": "a2j-logo.png",
    "style": "a2j"
  },
  "OPTA Suprimentos": {
    "logo": "opta.png",
    "style": "opta"
  },
  "TriAL Smart": {
    "logo": "trial-logo.png",
    "style": "trial"
  },
  "Lupus FIDC": {
    "logo": "lupus-map.png",
    "style": "lupus"
  }
};
const stateData={
  MS:{name:'Mato Grosso do Sul',companies:['Distribuidora Lopes','DFS Participações','A2J Representações','OPTA Suprimentos','TriAL Smart','Lupus FIDC']},
  MT:{name:'Mato Grosso',companies:['Distribuidora Lopes','DFS Participações','A2J Representações','OPTA Suprimentos','TriAL Smart','Lupus FIDC']},
  RO:{name:'Rondônia',companies:['Distribuidora Lopes','DFS Participações','A2J Representações','TriAL Smart','Lupus FIDC']},
  AC:{name:'Acre',companies:['Distribuidora Lopes','DFS Participações','A2J Representações','TriAL Smart','Lupus FIDC']},
  BA:{name:'Bahia',companies:['TriAL Smart']},
  AM:{name:'Amazonas',companies:['TriAL Smart']},
  CE:{name:'Ceará',companies:['TriAL Smart']},
  MA:{name:'Maranhão',companies:['TriAL Smart']},
  PA:{name:'Pará',companies:['TriAL Smart']},
  PR:{name:'Paraná',companies:['TriAL Smart']},
  RS:{name:'Rio Grande do Sul',companies:['TriAL Smart']},
  SC:{name:'Santa Catarina',companies:['TriAL Smart']},
  SP:{name:'São Paulo',companies:['TriAL Smart']}
};
const interactiveStates=[...document.querySelectorAll('.map-state[data-state]')];
const statePanelCode=document.querySelector('#state-panel-code');
const statePanelName=document.querySelector('#state-panel-name');
const stateCompanies=document.querySelector('#state-companies');
if(interactiveStates.length&&statePanelCode&&statePanelName&&stateCompanies){
  let selectedState='MS';
  function positionStateLabels(){
    interactiveStates.forEach(state=>{
      const label=document.querySelector(`[data-state-label="${state.dataset.state}"]`);
      if(!label)return;
      try{
        const box=state.getBBox();
        label.setAttribute('x',box.x+box.width/2);
        label.setAttribute('y',box.y+box.height/2);
      }catch{}
    });
  }
  function renderState(code,persist=false){
    const data=stateData[code];
    if(!data)return;
    if(persist)selectedState=code;
    statePanelCode.textContent=code;
    statePanelName.textContent=data.name;
    stateCompanies.replaceChildren(...data.companies.map(name=>{
      const asset=companyLogos[name];
      const company=document.createElement('span');
      company.className='state-company state-company-'+asset.style;
      company.title=name;
      const logo=document.createElement('img');
      logo.src=window.offlineAssets?.[asset.logo] || 'assets/'+asset.logo;
      logo.alt=name;
      logo.width=160;
      logo.height=88;
      company.append(logo);
      return company;
    }));
    interactiveStates.forEach(state=>{
      state.classList.toggle('is-selected',state.dataset.state===code);
      state.setAttribute('aria-pressed',String(state.dataset.state===selectedState));
    });
  }
  interactiveStates.forEach(state=>{
    const code=state.dataset.state;
    state.addEventListener('pointerenter',()=>renderState(code));
    state.addEventListener('pointerleave',()=>renderState(selectedState));
    state.addEventListener('focus',()=>renderState(code));
    state.addEventListener('blur',()=>renderState(selectedState));
    state.addEventListener('click',()=>renderState(code,true));
    state.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();renderState(code,true)}});
  });
  addEventListener('load',positionStateLabels,{once:true});
  requestAnimationFrame(()=>requestAnimationFrame(positionStateLabels));
  setTimeout(positionStateLabels,100);
  renderState(selectedState,true);
}

// A animação de abertura termina automaticamente em 1 segundo via CSS.
// A preferência por movimento reduzido é respeitada pelas media queries.

// Mantém âncoras e seções fixas alinhadas à altura real do menu aberto.
const visibleHeader=document.querySelector('.site-header');
const syncHeaderHeight=()=>{
 const height=visibleHeader.offsetHeight;
 document.documentElement.style.setProperty('--header-height',height+'px');
 const available=innerHeight/pageZoom()-height;
 document.documentElement.style.setProperty('--brand-height',available+'px');
 brands.classList.toggle('brands-flow',innerWidth<=700||prefersReduced.matches||available<720);
 requestUpdate();
};
addEventListener('resize',syncHeaderHeight);
prefersReduced.addEventListener('change',syncHeaderHeight);
new ResizeObserver(syncHeaderHeight).observe(visibleHeader);
syncHeaderHeight();
