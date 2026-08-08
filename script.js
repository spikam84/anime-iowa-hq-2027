const conventionStart = new Date("2027-07-30T09:00:00-05:00");
const units = {days:86400000,hours:3600000,minutes:60000,seconds:1000};
function updateCountdown(){
  const distance=conventionStart-Date.now();
  const note=document.getElementById("countdown-note");
  if(distance<=0){
    ["days","hours","minutes","seconds"].forEach(id=>document.getElementById(id).textContent="00");
    note.textContent=Date.now()<new Date("2027-08-02T00:00:00-05:00")?"Anime Iowa is happening now!":"See you next time!";
    return;
  }
  const values={days:Math.floor(distance/units.days),hours:Math.floor(distance%units.days/units.hours),minutes:Math.floor(distance%units.hours/units.minutes),seconds:Math.floor(distance%units.minutes/units.seconds)};
  Object.entries(values).forEach(([id,value])=>document.getElementById(id).textContent=String(value).padStart(2,"0"));
}
updateCountdown();
setInterval(updateCountdown,1000);