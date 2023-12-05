import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";
import "bootstrap/js/dist/dropdown";
import "bootstrap/js/dist/collapse";
import {buttonLogic} from "./button_logic";
import taskFieldTemplate from "./templates/taskField.html";
import noAccessTemplate from "./templates/noAccess.html";
import { User } from "./models/User";
import { Task } from "./models/Task";
import { generateTestUser,getFromStorage,addNewUser} from "./utils";
import { State } from "./state";
import { authUser } from "./services/auth";




export const appState = new State();

const loginForm = document.querySelector("#app-login-form");
const userLogoImg = document.querySelector("#user-logo-img");

const activeTasks = document.querySelector("#active-footer-span");
const finishedTasks = document.querySelector("#finished-footer-span");
const svgUp = document.querySelector("#user-svg-up");
const svgDwn = document.querySelector("#user-svg-down");
const svgLogoMain = document.querySelector("#svg-logo-main");

const footerUserSpan = document.querySelector("#footer-span-user");
const dropdownProfile = document.querySelector("#dropdown-profile");
const dropdownSignout = document.querySelector("#dropdown-signout");


if (window.localStorage.length === 0) {
  generateTestUser(User,Task);
  addNewUser(User,'user1');
  addNewUser(User,'user2');
} 

initialView ();

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const login = formData.get("login");
  const password = formData.get("password");

  let fieldHTMLContent = authUser(login, password)
    ? taskFieldTemplate
    : noAccessTemplate;

  document.querySelector("#content").innerHTML = fieldHTMLContent;
  let userImgSrc =null;
  if (fieldHTMLContent == taskFieldTemplate){
    loginForm.className = 'd-flex d-none';
    footerUserSpan.textContent = login;
    dropdownProfile.firstChild.className = 'dropdown-item';
    document.querySelector("#add-new-task").addEventListener('click', buttonLogic(appState));
    const users = getFromStorage('users');
    users.forEach(key => {
      if (key.login == login && key.password == password){      
       userImgSrc=key.logo;      
      } 
    });
    $.get( userImgSrc)
      .done (function(){
        userLogoImg.src = userImgSrc;
        userLogoImg.style.display = 'initial';
        svgLogoMain.style.display = 'none';
     }).fail(function(){
        userLogoImg.style.display = 'none';
       svgLogoMain.style.display = 'initial';
    }); 
  
  } else {
    initialView ();
  }  

});

$('.dropdown').on('show.bs.dropdown', function(){ 
  svgUp.style.display = "none";
  svgDwn.style.display = "initial"; 
 
});
$('.dropdown').on('hide.bs.dropdown', function(){
  svgUp.style.display = "initial";
  svgDwn.style.display = "none";
});
$('.dropdown').on('hide.bs.dropdown', function(){
  svgUp.style.display = "initial";
  svgDwn.style.display = "none";
});

dropdownSignout.addEventListener('click', ()=>{  
  initialView ();
  loginForm.className = 'd-flex dropdown'; 
  window.location.href="../index.html"; 
});

function initialView (){
  activeTasks.textContent = 'N';
  finishedTasks.textContent = 'M'; 
  userLogoImg.style.display = 'none';
  svgLogoMain.style.display = 'initial';   
  footerUserSpan.textContent = 'USER';
  dropdownProfile.firstChild.className = 'dropdown-item disabled';  
}

