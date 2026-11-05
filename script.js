
"use strict";

document.documentElement.classList.add("js-ready");

document.addEventListener("DOMContentLoaded",()=>{

const header=document.getElementById("header");
const navigation=document.getElementById("navigation");
const menuToggle=document.getElementById("menuToggle");
const navLinks=document.querySelectorAll(".navigation a");
const treatmentTabs=[...document.querySelectorAll(".treatment-tab")];
const treatmentPanel=document.getElementById("treatmentPanel");
const treatmentImage=document.getElementById("treatmentImage");
const treatmentCategory=document.getElementById("treatmentCategory");
const treatmentTitle=document.getElementById("treatmentTitle");
const treatmentDescription=document.getElementById("treatmentDescription");
const treatmentFeatures=document.getElementById("treatmentFeatures");
const lightbox=document.getElementById("lightbox");
const lightboxDialog=lightbox?.querySelector(".lightbox-dialog");
const lightboxImage=document.getElementById("lightboxImage");
const lightboxCounter=document.getElementById("lightboxCounter");
const lightboxClose=document.getElementById("lightboxClose");
const lightboxPrevious=document.getElementById("lightboxPrevious");
const lightboxNext=document.getElementById("lightboxNext");
const galleryButtons=[...document.querySelectorAll("[data-gallery]")];
const appointmentForm=document.getElementById("appointmentForm");
const appointmentFeedback=document.getElementById("appointmentFeedback");
const currentYear=document.getElementById("currentYear");

if(currentYear){
currentYear.textContent=new Date().getFullYear();
}

const photo=(id,w=1400)=>
`https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

const treatments={
estetica:{
category:"ESTÉTICA E HARMONIA",
title:"Estética dental",
description:"Soluções voltadas à aparência e à harmonia do sorriso, sempre considerando as características individuais e a avaliação profissional.",
features:[
"Clareamento dental",
"Facetas e restaurações estéticas",
"Planejamento individualizado"
],
image:photo("photo-1606811841689-23dfddce3e95"),
alt:"Profissional realizando atendimento odontológico"
},
implantes:{
category:"REABILITAÇÃO ORAL",
title:"Implantes dentários",
description:"Os implantes são uma das possibilidades de reabilitação para substituir dentes perdidos. A indicação depende de avaliação clínica, condições de saúde e planejamento profissional.",
features:[
"Avaliação das condições bucais",
"Planejamento da reabilitação",
"Acompanhamento profissional"
],
image:photo("photo-1606811971618-4486d14f3f99"),
alt:"Atendimento odontológico em consultório"
},
ortodontia:{
category:"ALINHAMENTO E FUNÇÃO",
title:"Ortodontia",
description:"A ortodontia atua no diagnóstico, prevenção e tratamento de alterações no posicionamento dos dentes e na relação entre as arcadas, conforme avaliação especializada.",
features:[
"Avaliação ortodôntica",
"Opções de aparelhos",
"Acompanhamento periódico"
],
image:photo("photo-1609840114035-3c981b782dfe"),
alt:"Equipamentos de consultório odontológico"
},
prevencao:{
category:"SAÚDE E PREVENÇÃO",
title:"Odontologia preventiva",
description:"O cuidado preventivo envolve orientações de higiene, avaliações periódicas e procedimentos indicados para preservar a saúde bucal ao longo do tempo.",
features:[
"Consultas preventivas",
"Orientações de higiene bucal",
"Acompanhamento individualizado"
],
image:photo("photo-1629909613654-28e377c37b09"),
alt:"Ambiente de clínica odontológica contemporânea"
}
};

// CABEÇALHO
function updateHeader(){
if(!header)return;
header.classList.toggle("scrolled",window.scrollY>50);
}

updateHeader();
window.addEventListener("scroll",updateHeader,{passive:true});

// MENU MOBILE
function closeMenu(){
if(!navigation||!menuToggle)return;
navigation.classList.remove("open");
menuToggle.setAttribute("aria-expanded","false");
menuToggle.setAttribute("aria-label","Abrir menu");
}

menuToggle?.addEventListener("click",()=>{
if(!navigation)return;
const opened=navigation.classList.toggle("open");
menuToggle.setAttribute("aria-expanded",String(opened));
menuToggle.setAttribute("aria-label",opened?"Fechar menu":"Abrir menu");
});

navLinks.forEach(link=>{
link.addEventListener("click",closeMenu);
});

document.addEventListener("click",event=>{
if(
navigation?.classList.contains("open")&&
!navigation.contains(event.target)&&
!menuToggle?.contains(event.target)
){
closeMenu();
}
});

window.addEventListener("resize",()=>{
if(window.innerWidth>900)closeMenu();
});

// NAVEGAÇÃO ATIVA
const sections=[...document.querySelectorAll("main section[id]")];

if("IntersectionObserver" in window){
const sectionObserver=new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(!entry.isIntersecting)return;

document.querySelectorAll(".nav-link").forEach(link=>{
link.classList.toggle(
"active",
link.getAttribute("href")===`#${entry.target.id}`
);
});
});
},{
rootMargin:"-25% 0px -60% 0px",
threshold:0
});

sections.forEach(section=>sectionObserver.observe(section));
}

// ANIMAÇÕES
const revealElements=document.querySelectorAll(".reveal");
const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if(reducedMotion||!("IntersectionObserver" in window)){
revealElements.forEach(element=>element.classList.add("visible"));
}else{
const revealObserver=new IntersectionObserver((entries,observer)=>{
entries.forEach(entry=>{
if(!entry.isIntersecting)return;
entry.target.classList.add("visible");
observer.unobserve(entry.target);
});
},{
threshold:0.08,
rootMargin:"0px 0px -30px 0px"
});

revealElements.forEach(element=>revealObserver.observe(element));
}

// ABAS DOS TRATAMENTOS
function activateTreatment(key,focusTab=false){
const treatment=treatments[key];
if(!treatment)return;

treatmentTabs.forEach(tab=>{
const active=tab.dataset.treatment===key;
tab.classList.toggle("active",active);
tab.setAttribute("aria-selected",String(active));
tab.tabIndex=active?0:-1;

if(active){
treatmentPanel?.setAttribute("aria-labelledby",tab.id);
if(focusTab)tab.focus();
}
});

if(treatmentCategory)treatmentCategory.textContent=treatment.category;
if(treatmentTitle)treatmentTitle.textContent=treatment.title;
if(treatmentDescription)treatmentDescription.textContent=treatment.description;

if(treatmentImage){
treatmentImage.src=treatment.image;
treatmentImage.alt=treatment.alt;
}

if(treatmentFeatures){
treatmentFeatures.replaceChildren();

treatment.features.forEach(feature=>{
const item=document.createElement("li");
item.textContent=feature;
treatmentFeatures.appendChild(item);
});
}
}

treatmentTabs.forEach((tab,index)=>{
tab.addEventListener("click",()=>{
activateTreatment(tab.dataset.treatment);
});

tab.addEventListener("keydown",event=>{
let nextIndex=index;

if(event.key==="ArrowRight")nextIndex=(index+1)%treatmentTabs.length;
else if(event.key==="ArrowLeft")nextIndex=(index-1+treatmentTabs.length)%treatmentTabs.length;
else if(event.key==="Home")nextIndex=0;
else if(event.key==="End")nextIndex=treatmentTabs.length-1;
else return;

event.preventDefault();
activateTreatment(treatmentTabs[nextIndex].dataset.treatment,true);
});
});

// GALERIA DE FOTOGRAFIAS
const gallery=galleryButtons.map(button=>{
const img=button.querySelector("img");

return{
src:img?.src||"",
alt:img?.alt||"Ambiente de clínica odontológica"
};
});

let currentGalleryIndex=0;
let previousFocus=null;

function showGalleryImage(index){
if(!gallery.length||!lightboxImage)return;

currentGalleryIndex=(index+gallery.length)%gallery.length;
const item=gallery[currentGalleryIndex];

lightboxImage.src=item.src;
lightboxImage.alt=item.alt;

if(lightboxCounter){
lightboxCounter.textContent=
`${String(currentGalleryIndex+1).padStart(2,"0")} / ${String(gallery.length).padStart(2,"0")}`;
}
}

function openLightbox(index){
if(!lightbox||!gallery.length)return;

previousFocus=document.activeElement;
showGalleryImage(index);

lightbox.classList.add("is-open");
lightbox.setAttribute("aria-hidden","false");
document.body.classList.add("lightbox-open");
lightboxClose?.focus();
}

function closeLightbox(){
if(!lightbox?.classList.contains("is-open"))return;

lightbox.classList.remove("is-open");
lightbox.setAttribute("aria-hidden","true");
document.body.classList.remove("lightbox-open");

if(lightboxImage)lightboxImage.removeAttribute("src");

if(previousFocus instanceof HTMLElement){
previousFocus.focus();
}
}

galleryButtons.forEach((button,index)=>{
button.addEventListener("click",()=>{
openLightbox(index);
});
});

lightboxClose?.addEventListener("click",closeLightbox);

lightbox?.querySelectorAll("[data-close-lightbox]").forEach(element=>{
element.addEventListener("click",closeLightbox);
});

lightboxPrevious?.addEventListener("click",()=>{
showGalleryImage(currentGalleryIndex-1);
});

lightboxNext?.addEventListener("click",()=>{
showGalleryImage(currentGalleryIndex+1);
});

document.addEventListener("keydown",event=>{
if(event.key==="Escape"){
closeMenu();
closeLightbox();
return;
}

if(!lightbox?.classList.contains("is-open"))return;

if(event.key==="ArrowRight"){
event.preventDefault();
showGalleryImage(currentGalleryIndex+1);
}

if(event.key==="ArrowLeft"){
event.preventDefault();
showGalleryImage(currentGalleryIndex-1);
}

if(event.key==="Tab"&&lightboxDialog){
const focusable=[
...lightboxDialog.querySelectorAll(
'button:not([disabled]),a[href],[tabindex="0"]'
)
].filter(element=>element.getClientRects().length>0);

if(!focusable.length){
event.preventDefault();
lightboxDialog.focus();
return;
}

const first=focusable[0];
const last=focusable[focusable.length-1];

if(event.shiftKey&&document.activeElement===first){
event.preventDefault();
last.focus();
}else if(!event.shiftKey&&document.activeElement===last){
event.preventDefault();
first.focus();
}
}
});

// PERGUNTAS FREQUENTES
const faqItems=[...document.querySelectorAll(".faq-item")];

faqItems.forEach(item=>{
item.addEventListener("toggle",()=>{
if(!item.open)return;

faqItems.forEach(other=>{
if(other!==item)other.open=false;
});
});
});

// SIMULAÇÃO DE AGENDAMENTO
appointmentForm?.addEventListener("submit",event=>{
event.preventDefault();

const name=document.getElementById("appointmentName")?.value.trim();
const service=document.getElementById("appointmentService")?.value;
const period=document.getElementById("appointmentPeriod")?.value;

if(!appointmentFeedback)return;

if(!name||!service||!period){
appointmentFeedback.textContent=
"Preencha os três campos com informações fictícias para testar a demonstração.";
return;
}

const serviceNames={
estetica:"Estética dental",
implantes:"Implantes dentários",
ortodontia:"Ortodontia",
prevencao:"Odontologia preventiva"
};

const periodNames={
manha:"manhã",
tarde:"tarde"
};

appointmentFeedback.textContent=
`Demonstração concluída: ${serviceNames[service]}, período da ${periodNames[period]}. Nenhum agendamento foi realizado e nenhuma informação foi enviada ou armazenada.`;

appointmentForm.reset();
});

// MONITORAMENTO DE IMAGENS
document.querySelectorAll("img").forEach(img=>{
img.addEventListener("error",()=>{
console.warn("Imagem indisponível:",img.currentSrc||img.src);
});
});

// Ativa submissões somente após instalar os controles demonstrativos.
document.querySelectorAll("[data-demo-submit]").forEach(button=>{button.disabled=false;});
});
