let navList=document.querySelector(".main-nav__list"),buttonToggle=document.querySelector(".main-nav__toggle");navList.classList.remove("main-nav__list--nojs"),navList.classList.add("main-nav__list--js"),buttonToggle.classList.remove("main-nav__toggle--nojs"),buttonToggle.addEventListener("click",(function(){buttonToggle.classList.toggle("main-nav__toggle--close"),navList.classList.toggle("main-nav__list--nojs")}));