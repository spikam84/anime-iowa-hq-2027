const categories = [
  {id:"essentials",icon:"⭐",name:"Essentials",items:["Sponsor badge or pickup confirmation","Government-issued photo ID","Wallet and payment cards","Phone","Daily medications","Health insurance card","Hotel reservation details"]},
  {id:"clothing",icon:"👕",name:"Clothing",items:["Friday outfit","Saturday outfit","Sunday outfit","Sleepwear","Undergarments and socks","Comfortable walking shoes","Light jacket or hoodie","Laundry bag"]},
  {id:"cosplay",icon:"🧵",name:"Cosplay & Accessories",items:["Costume pieces","Wig and wig cap","Shoes","Props","Makeup","Repair kit","Safety pins and fashion tape","Garment bag or storage bin"]},
  {id:"toiletries",icon:"🧴",name:"Toiletries",items:["Toothbrush and toothpaste","Deodorant","Shampoo and conditioner","Hairbrush or comb","Skin care","Shower supplies","Razor","Pain reliever"]},
  {id:"electronics",icon:"🔌",name:"Electronics",items:["Phone charger","Portable battery","Charging cables","AirPods and charger","Power strip","Chromebook and charger","Camera or extra storage"]},
  {id:"conbag",icon:"🎒",name:"Convention Bag",items:["Water bottle","Badge holder or lanyard","Small notebook and pen","Hand sanitizer","Tissues","Autograph item","Reusable shopping bag","Emergency snack"]},
  {id:"hotel",icon:"🏨",name:"Hotel Supplies",items:["Room key plan","Pillow or sleep item","Reusable cup","Cooler","Night-light","Earplugs","Morning coffee supplies"]},
  {id:"food",icon:"🍙",name:"Snacks & Drinks",items:["Breakfast snacks","Protein snacks","Favorite drinks","Electrolyte packets","Reusable utensils","Late-night snack"]},
  {id:"sponsor",icon:"🎟️",name:"Sponsor Events",items:["Sponsor pickup information","Photo ID for check-in","Brunch reminder","Autograph item","Collector pin storage","Recharge Room notes"]}
];
const STORAGE_KEY="animeIowa2027Packing";
let state={checked:{},custom:[],shopping:[]};
try{state={...state,...JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}")};}catch(error){console.warn("Packing data could not be loaded.",error)}

const categoryWrap=document.getElementById("packing-categories");
const categorySelect=document.getElementById("custom-category");
const itemId=(category,item)=>`${category}:${item.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`;
function allItemsFor(category){return [...category.items,...state.custom.filter(item=>item.category===category.id).map(item=>item.name)]}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));const note=document.getElementById("save-status");note.textContent="✓ Saved on this device";clearTimeout(save.timer);save.timer=setTimeout(()=>note.textContent="✓ Progress saves automatically",1400)}
function render(){
  categoryWrap.innerHTML="";
  categories.forEach(category=>{
    const card=document.createElement("section");card.className="packing-card";
    const items=allItemsFor(category);
    card.innerHTML=`<div class="packing-card-head"><div><span aria-hidden="true">${category.icon}</span><h2>${category.name}</h2></div><small>${items.filter(item=>state.checked[itemId(category.id,item)]).length}/${items.length}</small></div><ul></ul>`;
    const list=card.querySelector("ul");
    items.forEach(item=>{
      const id=itemId(category.id,item),isCustom=state.custom.some(custom=>custom.category===category.id&&custom.name===item);
      const li=document.createElement("li");
      li.innerHTML=`<label><input type="checkbox" ${state.checked[id]?"checked":""}><span>${item}</span></label>${isCustom?'<button class="remove-item" type="button" aria-label="Remove custom item">×</button>':""}`;
      li.querySelector("input").addEventListener("change",event=>{state.checked[id]=event.target.checked;save();render()});
      if(isCustom)li.querySelector("button").addEventListener("click",()=>{state.custom=state.custom.filter(custom=>!(custom.category===category.id&&custom.name===item));delete state.checked[id];save();render()});
      list.appendChild(li);
    });
    categoryWrap.appendChild(card);
  });
  updateProgress();renderShopping();
}
function updateProgress(){const ids=categories.flatMap(category=>allItemsFor(category).map(item=>itemId(category.id,item)));const packed=ids.filter(id=>state.checked[id]).length;const percent=ids.length?Math.round(packed/ids.length*100):0;document.getElementById("packed-count").textContent=packed;document.getElementById("total-count").textContent=ids.length;document.getElementById("progress-percent").textContent=`${percent}%`;document.getElementById("progress-fill").style.width=`${percent}%`;document.querySelector(".progress-track").setAttribute("aria-valuenow",percent)}
function renderShopping(){const list=document.getElementById("shopping-list");list.innerHTML="";state.shopping.forEach((item,index)=>{const li=document.createElement("li");li.innerHTML=`<label><input type="checkbox" ${item.done?"checked":""}><span></span></label><button type="button" aria-label="Remove item">×</button>`;li.querySelector("span").textContent=item.name;li.querySelector("input").addEventListener("change",event=>{state.shopping[index].done=event.target.checked;save();renderShopping()});li.querySelector("button").addEventListener("click",()=>{state.shopping.splice(index,1);save();renderShopping()});list.appendChild(li)});document.getElementById("empty-shopping").hidden=state.shopping.length>0;document.getElementById("shopping-count").textContent=`${state.shopping.length} ${state.shopping.length===1?"item":"items"}`}
categories.forEach(category=>categorySelect.add(new Option(category.name,category.id)));
document.getElementById("custom-form").addEventListener("submit",event=>{event.preventDefault();const input=document.getElementById("custom-item"),name=input.value.trim(),category=categorySelect.value;if(!name)return;state.custom.push({name,category});input.value="";save();render()});
document.getElementById("shopping-form").addEventListener("submit",event=>{event.preventDefault();const input=document.getElementById("shopping-item"),name=input.value.trim();if(!name)return;state.shopping.push({name,done:false});input.value="";save();renderShopping()});
document.getElementById("reset-all").addEventListener("click",()=>{if(confirm("Reset every checkmark and remove all custom packing data?")){state={checked:{},custom:[],shopping:[]};save();render()}});
render();
