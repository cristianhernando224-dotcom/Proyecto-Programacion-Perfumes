// Navegación principal, tarjetas, categorías, detalle y modal de confirmación.
let deletedIds = [];
let pendingDeleteId = null;
let editingId = null;
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const money = (value) => value == null ? "Precio por definir" : "$" + Number(value).toLocaleString("es-CO");
const statusFor = (p) => p.stock === 0 ? "Agotado" : p.stock <= (p.minStock ?? 3) ? "Stock bajo" : "Disponible";
const imgPath = (p) => p.image && (p.image.startsWith("blob:") || p.image.startsWith("data:")) ? p.image : "img/catalog/" + p.image;

function showView(view) {
  $$(".view").forEach(section => section.hidden = section.dataset.section !== view);
  $$(".nav-button").forEach(button => button.classList.toggle("active", button.dataset.view === view));
  $("#mobile-nav").hidden = true;
  window.scrollTo({top: 0, behavior: "smooth"});
  if (view === "inventory") renderInventory();
  if (view === "home") renderHome();
  if (view === "categories") renderCategories();
  if (view === "add") resetFormIfNew();
}
document.addEventListener("click", event => {
  const nav = event.target.closest("[data-view]");
  if (nav) { if (nav.dataset.view === "add") { editingId = null; resetFormIfNew(); } showView(nav.dataset.view); }
});
$("#mobile-toggle").addEventListener("click", () => {
  $("#mobile-nav").hidden = !$("#mobile-nav").hidden;
});

function productCard(p) {
  return `<article class="product-card" tabindex="0" data-detail="${p.id}">
    <div class="product-photo"><img src="${imgPath(p)}" alt="${p.name}"><span class="status ${statusFor(p)==="Stock bajo"?"stock-bajo":statusFor(p)==="Agotado"?"agotado":""}"><i></i>${statusFor(p)}</span></div>
    <div class="product-card-body"><span>${p.brand}</span><h4>${p.name}</h4><div><strong>${money(p.price)}</strong><small>${p.stock} unidades</small></div></div></article>`;
}
function renderHome() {
  const active = products.filter(p => !deletedIds.includes(p.id));
  $("#recent-grid").innerHTML = active.slice(0,4).map(productCard).join("");
  $("#stat-products").textContent = active.length;
  $("#stat-low").textContent = active.filter(p => p.stock > 0 && p.stock <= (p.minStock ?? 3)).length;
  $("#stat-value").textContent = money(active.reduce((sum,p)=>sum+(p.price||0)*p.stock,0));
  $("#nav-count").textContent = active.length;
}
function renderCategories() {
  const cats = [
    ["Caballero","Fragancias con carácter","invictus.jpg"],
    ["Dama","Aromas florales y dulces","yara.jpg"],
    ["Unisex","Esencias para compartir","khamrah.jpg"],
    ["Sets","Colecciones especiales","art-universe.jpg"]
  ];
  $("#category-grid").innerHTML = cats.map(([name,desc,img])=>`<button class="category-card" data-category="${name}"><img src="img/catalog/${img}" alt=""><span><small>${desc}</small><b>${name}</b><em>Explorar colección →</em></span></button>`).join("");
}
document.addEventListener("click", event => {
  const detail = event.target.closest("[data-detail]");
  if (detail) showDetail(Number(detail.dataset.detail));
  const category = event.target.closest("[data-category]");
  if (category) {
    $("#filter-category").value = category.dataset.category;
    showView("inventory");
    renderInventory();
  }
});
function showDetail(id) {
  const p = products.find(item=>item.id===id);
  if (!p) return;
  $("#detail-content").innerHTML = `<div class="detail-layout"><div class="detail-photo"><img src="${imgPath(p)}" alt="${p.name}"></div><div class="detail-info"><span class="eyebrow">${p.brand} · ${p.category}</span><h2>${p.name}</h2><p class="price">${money(p.price)}</p><span class="status">${statusFor(p)}</span><p>${p.description}</p><p><b>Familia aromática:</b> ${p.aroma}</p><p><b>Existencias:</b> ${p.stock} unidades</p><button class="btn btn-primary" data-edit="${p.id}">Editar datos</button> <button class="btn btn-secondary" data-view="inventory">Volver al inventario</button></div></div>`;
  showView("detail");
}
document.addEventListener("click", event => {
  const edit = event.target.closest("[data-edit]");
  if (edit) startEdit(Number(edit.dataset.edit));
});
function showToast(message) {
  const toast=$("#toast"); toast.textContent=message; toast.hidden=false;
  window.setTimeout(()=>toast.hidden=true,2600);
}
function askDelete(id) {
  const p=products.find(item=>item.id===id); if(!p)return;
  pendingDeleteId=id; $("#modal-text").textContent=`¿Seguro que deseas eliminar ${p.name}? La acción solo modifica esta demostración y no guarda datos permanentemente.`;
  $("#delete-modal").hidden=false; $("#cancel-delete").focus();
}
$("#modal-close").addEventListener("click",()=>$("#delete-modal").hidden=true);
$("#cancel-delete").addEventListener("click",()=>$("#delete-modal").hidden=true);
$("#delete-modal").addEventListener("click",e=>{if(e.target.id==="delete-modal")$("#delete-modal").hidden=true;});
$("#confirm-delete").addEventListener("click",()=>{
  if(pendingDeleteId!==null){deletedIds.push(pendingDeleteId);pendingDeleteId=null;$("#delete-modal").hidden=true;renderInventory();renderHome();showToast("Perfume eliminado de esta vista.");}
});
function resetFormIfNew() {
  if (editingId !== null) return;
  $("#product-form").reset(); clearErrors(); $("#form-title").textContent="Agregar nuevo perfume"; $("#save-product").textContent="Guardar perfume"; $("#form-message").textContent=""; $("#field-minStock").value=3; $("#field-image").value=""; selectedImageData=""; $("#image-name").textContent="No se ha seleccionado una imagen."; $("#image-preview").innerHTML="<span class=\"upload-plus\">＋</span><b>Subir imagen</b><small>Selecciona una imagen desde tu equipo</small>";
}
function startEdit(id) {
  const p=products.find(item=>item.id===id); if(!p)return;
  editingId=id; showView("add"); $("#form-title").textContent="Editar perfume";
  for(const key of ["name","brand","category","aroma","price","stock","minStock","description"]) {
    const input=$("#field-"+key); if(input) input.value=p[key] ?? "";
  }
  $("#form-message").textContent="Editando datos de ejemplo. Los cambios solo viven en esta sesión.";
}
