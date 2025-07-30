let listQuantities, optionQuantity, inputTop, inputBottom, optionTop, optionBottom, quantity;
let defQuantityId = 'length';
let exchangeRates = {};

let quantities = [ // FULL LIST restored
    {name:'Length',id:'length',defUnitIndex:1,units:[["Kilometer",1000],["Meter",1],["Centimeter",0.01],["Millimeter",0.001],["Mile",1609.344],["Yard",0.9144],["Feet",0.3048],["Inch",0.0254]]},
    {name:'Mass',id:'mass',defUnitIndex:0,units:[["Kilogram",1],["Gram",0.001],["Milligram",0.000001],["Pound",0.45359237],["Ton",1000]]},
    {name:'Time',id:'time',defUnitIndex:7,units:[["Day",86400],["Hour",3600],["Minute",60],["Second",1],["Millisecond",0.001]]},
    {name:'Temperature',id:'temperature',defUnitIndex:0,units:[["Celsius",'value + 273.15','value - 273.15'],["Fahrenheit",'5/9 * (value + 459.67)','9/5 * value - 459.67'],["Kelvin",1],["Rankine",'5/9 * value','9/5 * value']]},
    {name:'Angle',id:'angle',defUnitIndex:0,units:[["Degree",'value/360','value*360'],["Radian",'value/(2*Math.PI)','value*2*Math.PI'],["Revolution",1]]},
    {name:'Area',id:'area',defUnitIndex:1,units:[["Square Kilometer",1e6],["Square Meter",1],["Square Centimeter",0.0001],["Square Mile",2589988.110336],["Square Yard",0.83612736]]},
    {name:'Volume',id:'volume',defUnitIndex:5,units:[["Cubic Meter",1],["Liter",0.001],["Milliliter",0.000001],["Gallon",3.785411784],["Cup",0.2365882365]]},
    {name:'Digital Storage',id:'digital-storage',defUnitIndex:1,units:[["Bits",0.125],["Bytes",1],["Kilobytes",1024],["Megabytes",1048576],["Gigabytes",1073741824]]},
    {name:'Currency',id:'currency',defUnitIndex:0,units:[["USD",1],["EUR",0],["INR",0],["GBP",0],["JPY",0]]}
];

function getQuantityById(id){ return quantities.find(q=>q.id===id); }

function onInitPage(){
  optionQuantity=document.getElementById('optionQuantity');
  inputTop=document.getElementById('inputTop');
  inputBottom=document.getElementById('inputBottom');
  optionTop=document.getElementById('optionTop');
  optionBottom=document.getElementById('optionBottom');
  loadQuantity(defQuantityId);
  document.getElementById("toggleTheme").addEventListener("click",toggleTheme);
  if(localStorage.getItem("theme")==="dark"){document.body.classList.add("dark");}
}

document.addEventListener("DOMContentLoaded",onInitPage);

function toggleTheme(){
  document.body.classList.toggle("dark");
  localStorage.setItem("theme",document.body.classList.contains("dark")?"dark":"light");
}

function loadQuantity(quantityId){
  quantity=getQuantityById(quantityId);
  if(quantity.id==="currency"){ fetchRates(); }
  optionTop.innerHTML=''; optionBottom.innerHTML='';
  let opts=quantity.units.map(u=>`<option>${u[0]}</option>`).join('');
  optionTop.innerHTML=opts; optionBottom.innerHTML=opts;
  document.getElementById('quantityTitle').innerText=quantity.name+" Converter";
  optionQuantity.value=quantityId;
  convert();
}

function fetchRates(){
  fetch('https://api.exchangerate.host/latest?base=USD')
  .then(res=>res.json())
  .then(data=>{
    exchangeRates=data.rates;
    quantity.units.forEach(u=>{ if(exchangeRates[u[0]]) u[1]=exchangeRates[u[0]]; });
  });
}

function convertInternal(topIndex,value,bottomIndex,output){
  let top=quantity.units[topIndex][1];
  let bottom=quantity.units[bottomIndex][1];
  if(isNaN(value)){ output.value=''; return; }
  if(typeof top!=="number"){ value=eval(top); } else { value*=top; }
  if(typeof bottom!=="number"){ value=eval(quantity.units[bottomIndex][2]); } else { value/=bottom; }
  output.value=value.toFixed(4);
}

function convert(){
  let value=parseFloat(inputTop.value);
  convertInternal(optionTop.selectedIndex,value,optionBottom.selectedIndex,inputBottom);
}

function convertBack(){
  let value=parseFloat(inputBottom.value);
  convertInternal(optionBottom.selectedIndex,value,optionTop.selectedIndex,inputTop);
}
