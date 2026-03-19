/* =========================
   CUSTOM CURSOR
========================= */
const cursor = document.querySelector('.cursor');
function moveCursor(e){
  cursor.style.transform = `translate(${e.clientX - cursor.offsetWidth/2}px, ${e.clientY - cursor.offsetHeight/2}px)`;
}
window.addEventListener('mousemove', moveCursor);
window.addEventListener('touchmove', (e)=>{
  if(e.touches.length > 0){
    const touch = e.touches[0];
    cursor.style.transform = `translate(${touch.clientX - cursor.offsetWidth/2}px, ${touch.clientY - cursor.offsetHeight/2}px)`;
  }
});

/* =========================
   DVD LOGO BOUNCE (only on index)
========================= */
const dvd = document.querySelector('.dvd-logo');
if(dvd){
  let dvdX = Math.random() * (window.innerWidth - dvd.offsetWidth);
  let dvdY = Math.random() * (window.innerHeight - dvd.offsetHeight);
  let dvdVX = 3 + Math.random()*2;
  let dvdVY = 3 + Math.random()*2;

  function getRandomColor(){
    const letters = '0123456789ABCDEF';
    let color = '#';
    for(let i=0;i<6;i++){color += letters[Math.floor(Math.random()*16)];}
    return color;
  }

  function updateDVD(){
    dvdX += dvdVX;
    dvdY += dvdVY;
    if(dvdX <=0 || dvdX + dvd.offsetWidth >= window.innerWidth){
      dvdVX*=-1; 
      dvd.style.filter=`drop-shadow(0 0 15px ${getRandomColor()})`;
    }
    if(dvdY <=0 || dvdY + dvd.offsetHeight >= window.innerHeight){
      dvdVY*=-1; 
      dvd.style.filter=`drop-shadow(0 0 15px ${getRandomColor()})`;
    }
    dvd.style.left = dvdX+'px';
    dvd.style.top = dvdY+'px';
    requestAnimationFrame(updateDVD);
  }
  updateDVD();
}

/* =========================
   HERO VIDEO SWITCH & TEXT (only on index)
========================= */
const scenes = document.querySelectorAll('.hero video.scene');
let currentScene = 0;
if(scenes.length>0){
  setInterval(()=>{
    scenes[currentScene].classList.remove('active');
    currentScene = (currentScene+1)%scenes.length;
    scenes[currentScene].classList.add('active');
  },5000);

  const heroText = document.getElementById('heroText');
  const subtitle = document.getElementById('heroSubtitle');
  if(heroText && subtitle){
    const phrases = ["Welcome to FYDT","Sorry for ruing your picture","It's about ART","Join the FYDT Universe"];
    let phraseIndex=0;
    setInterval(()=>{
      heroText.style.opacity=0;
      subtitle.style.opacity=0;
      setTimeout(()=>{
        phraseIndex = (phraseIndex+1)%phrases.length;
        heroText.textContent = phrases[phraseIndex];
        heroText.style.opacity=1;
        subtitle.style.opacity=1;
      },500);
    },6000);
  }
}

/* =========================
   STAR BACKGROUND (on all pages if canvas exists)
========================= */
const starCanvas = document.getElementById("starCanvas");
if(starCanvas){
  const starCtx = starCanvas.getContext("2d");
  let stars=[], sw, sh;

  function resizeStars(){
    sw = starCanvas.width = window.innerWidth;
    sh = starCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeStars);
  resizeStars();

  class Star{
    constructor(){this.reset();}
    reset(){
      this.x = Math.random()*sw;
      this.y = Math.random()*sh;
      this.size = Math.random()*1.2;
      this.speed = Math.random()*0.4+0.05;
      this.opacity = Math.random();
      this.fade = Math.random()*0.02;
    }
    update(){
      this.y += this.speed;
      this.opacity += this.fade;
      if(this.opacity>=1 || this.opacity<=0) this.fade*=-1;
      if(this.y>sh){this.reset(); this.y=0;}
    }
    draw(){
      starCtx.beginPath();
      starCtx.arc(this.x,this.y,this.size,0,Math.PI*2);
      starCtx.fillStyle = `rgba(255,255,255,${this.opacity})`;
      starCtx.fill();
    }
  }

  function initStars(num=160){stars=[]; for(let i=0;i<num;i++){stars.push(new Star());}}
  function animateStars(){starCtx.clearRect(0,0,sw,sh); stars.forEach(s=>{s.update(); s.draw();}); requestAnimationFrame(animateStars);}
  initStars(); animateStars();
}

/* =========================
   SUN/MOON THEME TOGGLE - applies globally to all pages
========================= */
const modeToggle = document.getElementById('modeToggle');
if(modeToggle){
  modeToggle.addEventListener('click', ()=>{
    document.body.classList.toggle('light');
  });
}

/* =========================
   MORPHING IMAGES - works with any number of images per card
========================= */
const morphCards = document.querySelectorAll('.morph-target');
morphCards.forEach(card=>{
  const imgs = card.querySelectorAll('.variant-img');
  let index=0;
  card.addEventListener('mouseenter',()=>{
    card.morphInterval=setInterval(()=>{
      imgs[index].style.display='none';
      index=(index+1)%imgs.length;
      imgs[index].style.display='block';
    },1000); // change 1000 to slower/faster cycling (in ms)
  });
  card.addEventListener('mouseleave',()=>{
    clearInterval(card.morphInterval);
    imgs.forEach((img,i)=> img.style.display = i===0?'block':'none');
  });
});

/* =========================
   HAMBURGER MENU
========================= */
const hamburger = document.getElementById('hamburger');
const nav = document.querySelector('nav');
if(hamburger){
  hamburger.addEventListener('click', ()=>{ nav.classList.toggle('active'); });
}

/* =========================
   SCROLL REVEAL (if you use .reveal class anywhere)
========================= */
const reveals = document.querySelectorAll('.reveal');
function revealOnScroll(){
  reveals.forEach(el=>{
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    if(elementTop < windowHeight - 100){ el.classList.add('active'); }
  });
}
window.addEventListener('scroll', revealOnScroll);

/* =========================
   MAGNETIC HOVER EFFECT ON CARDS
========================= */
document.querySelectorAll('.card').forEach(card=>{
  card.addEventListener('mousemove', (e)=>{
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width/2;
    const y = e.clientY - rect.top - rect.height/2;
    card.style.transform = `translate(${x*0.1}px, ${y*0.1}px) scale(1.03)`;
  });
  card.addEventListener('mouseleave', ()=>{ card.style.transform = ''; });
})