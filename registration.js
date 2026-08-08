const storageKey = "animeIowa2027Registration";

function loadRegistration(){
  try{return JSON.parse(localStorage.getItem(storageKey)) || {}}
  catch{return {}}
}

function saveRegistration(state){
  localStorage.setItem(storageKey, JSON.stringify(state));
  const status=document.getElementById("registration-save");
  status.textContent="✓ Saved on this device";
  window.clearTimeout(saveRegistration.timer);
  saveRegistration.timer=window.setTimeout(()=>status.textContent="✓ Checklist saves automatically on this device",1500);
}

const boxes=[...document.querySelectorAll("#registration-list input[type='checkbox']")];
const state=loadRegistration();

function updateProgress(){
  const checked=boxes.filter(box=>box.checked).length;
  document.getElementById("registration-progress").textContent=`${checked} of ${boxes.length}`;
}

boxes.forEach(box=>{
  box.checked=Boolean(state[box.dataset.key]);
  box.addEventListener("change",()=>{
    state[box.dataset.key]=box.checked;
    saveRegistration(state);
    updateProgress();
  });
});

document.getElementById("reset-registration").addEventListener("click",()=>{
  if(!confirm("Clear every Registration Center checkmark on this device?")) return;
  boxes.forEach(box=>box.checked=false);
  localStorage.removeItem(storageKey);
  Object.keys(state).forEach(key=>delete state[key]);
  updateProgress();
  document.getElementById("registration-save").textContent="Checklist reset";
});

updateProgress();
