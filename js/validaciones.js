// Validación integrada al formulario y previsualización de la imagen seleccionada.
const formRules = {
  name: value => value.trim().length >= 2 ? "" : "Escribe un nombre de al menos 2 caracteres.",
  brand: value => value.trim().length >= 2 ? "" : "Escribe el nombre de la marca.",
  category: value => value ? "" : "Selecciona una categoría.",
  price: value => Number.isInteger(Number(value)) && Number(value)>0 ? "" : "Ingresa un precio entero mayor que cero.",
  stock: value => value!=="" && Number.isInteger(Number(value)) && Number(value)>=0 ? "" : "Ingresa una cantidad entera igual o mayor que cero.",
  minStock: value => value!=="" && Number.isInteger(Number(value)) && Number(value)>=0 ? "" : "Ingresa un stock mínimo igual o mayor que cero."
};
function clearErrors() {
  document.querySelectorAll("[data-error]").forEach(el=>el.textContent="");
  document.querySelectorAll(".field").forEach(el=>el.classList.remove("invalid"));
}
const imageInput = $("#field-image");
let selectedImageData = "";
imageInput.addEventListener("change", () => {
  const file=imageInput.files[0];
  if(!file){selectedImageData="";return;}
  if(!file.type.startsWith("image/")){imageInput.value="";$("#image-name").textContent="Selecciona un archivo de imagen válido.";return;}
  selectedImageData=URL.createObjectURL(file);
  $("#image-name").textContent=file.name;
  $("#image-preview").innerHTML=`<img src="${selectedImageData}" alt="Vista previa de la imagen"><span class="upload-overlay">Cambiar imagen</span>`;
});
$("#product-form").addEventListener("submit",event=>{
  event.preventDefault(); clearErrors();
  const fields=["name","brand","category","price","stock","minStock"];
  let valid=true;
  fields.forEach(key=>{
    const input=$("#field-"+key); const message=formRules[key](input.value);
    if(message){valid=false;input.closest(".field").classList.add("invalid");document.querySelector(`[data-error="${key}"]`).textContent=message;}
  });
  if(!valid){$("#form-message").textContent="Revisa los campos señalados antes de continuar.";return;}
  const data={name:$("#field-name").value.trim(),brand:$("#field-brand").value.trim(),category:$("#field-category").value,
    aroma:$("#field-aroma").value.trim()||"Sin especificar",price:Number($("#field-price").value),stock:Number($("#field-stock").value),
    minStock:Number($("#field-minStock").value),description:$("#field-description").value.trim()||"Sin descripción disponible.",
    status:"Disponible",image:selectedImageData||(editingId!==null?(products.find(p=>p.id===editingId)?.image||"khamrah.jpg"):"khamrah.jpg")};
  if(editingId!==null){const product=products.find(item=>item.id===editingId);if(product)Object.assign(product,data);editingId=null;$("#form-message").textContent="Cambios aplicados a esta sesión.";}
  else {data.id=Math.max(0,...products.map(p=>p.id))+1;products.unshift(data);$("#form-message").textContent="Perfume agregado a esta sesión.";}
  data.status=data.stock===0?"Agotado":data.stock<=data.minStock?"Stock bajo":"Disponible";
  renderInventory();renderHome();showToast(editingId===null?"Perfume guardado correctamente.":"Cambios guardados.");
  window.setTimeout(()=>showView("inventory"),700);
});
["name","brand","category","price","stock","minStock"].forEach(key=>{
  const input=$("#field-"+key);input.addEventListener("input",()=>{
    const message=formRules[key](input.value);input.closest(".field").classList.toggle("invalid",Boolean(message));document.querySelector(`[data-error="${key}"]`).textContent=message;
  });
});
