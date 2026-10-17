// Búsqueda, filtros, orden y tabla del inventario.
function renderInventory() {
  const query=$("#search").value.trim().toLowerCase();
  const category=$("#filter-category").value;
  const brand=$("#filter-brand").value;
  const status=$("#filter-status").value;
  const sort=$("#sort").value;
  let list=products.filter(p=>!deletedIds.includes(p.id)
    && (!query || `${p.name} ${p.brand} ${p.category} ${p.aroma}`.toLowerCase().includes(query))
    && (category==="Todos"||p.category===category)
    && (brand==="Todas"||p.brand===brand)
    && (status==="Todos"||statusFor(p)===status));
  list.sort((a,b)=>sort==="Precio menor"?(a.price??Infinity)-(b.price??Infinity):sort==="Precio mayor"?(b.price??0)-(a.price??0):sort==="Stock"?b.stock-a.stock:a.name.localeCompare(b.name,"es"));
  $("#result-label").innerHTML=`Mostrando ${list.length} de ${products.filter(p=>!deletedIds.includes(p.id)).length} productos <b>Datos de demostración</b>`;
  $("#inventory-rows").innerHTML=list.map(p=>`<tr>
    <td><button class="product-cell" data-detail="${p.id}"><img src="${imgPath(p)}" alt=""><span><b>${p.name}</b><small>${p.brand}</small></span></button></td>
    <td>${p.category}</td><td>${p.aroma}</td><td class="price">${money(p.price)}</td><td>${p.stock}</td><td>${p.minStock ?? 3}</td>
    <td><span class="status ${statusFor(p)==="Stock bajo"?"stock-bajo":statusFor(p)==="Agotado"?"agotado":""}"><i></i>${statusFor(p)}</span></td>
    <td><div class="row-actions"><button data-edit="${p.id}">Editar</button><button class="delete" data-delete="${p.id}">Eliminar</button></div></td>
  </tr>`).join("");
  $("#empty-state").hidden=list.length!==0;
  $("#nav-count").textContent=products.filter(p=>!deletedIds.includes(p.id)).length;
}
["search","filter-category","filter-brand","filter-status","sort"].forEach(id=>$("#"+id).addEventListener(id==="search"?"input":"change",renderInventory));
$("#clear-search").addEventListener("click",()=>{$("#search").value="";renderInventory();$("#search").focus();});
document.addEventListener("click",event=>{
  const del=event.target.closest("[data-delete]");
  if(del) askDelete(Number(del.dataset.delete));
});
