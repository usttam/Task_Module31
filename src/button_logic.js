import { addNewTask, getFromStorage,showTasks,clearTasks, genTaskList} from "./utils";
import { Task } from "./models/Task";
import { isEmptyObject } from "jquery";

export const buttonLogic = function (appState) {
  if (appState!==null && appState.currentUser.login!==undefined) {    
 
    const newTaskButton = document.querySelector("#add-new-task");
    const containerReady = document.querySelector("#container-ready");
    const contReadyDl = document.querySelector("#task-ready-delimiter");
    const readyBtnSpan = document.querySelector("#ready-button-text");
    const svgReady = document.querySelector('#svg-new-task');

    const newStartedBtn = document.querySelector('#started-new-task');
    const containerStarted = document.querySelector("#container-started");
    const contStartedDl = document.querySelector("#task-started-delimiter");


    const newFinishedBtn = document.querySelector('#finished-new-task');
    const containerFinished = document.querySelector("#container-finished");
    const contFinishedDl = document.querySelector("#task-finished-delimiter");

    const menuStarted = document.querySelector("#dropdown-menu-started");
    const menuFinished = document.querySelector("#dropdown-menu-finished");

    const startedSubmitBtn = document.querySelector("#started-submit");
    const finishedSubmitBtn = document.querySelector("#finished-submit");

    const activeTasks = document.querySelector("#active-footer-span");
    const finishedTasks = document.querySelector("#finished-footer-span");

    let showObj = getFromStorage(appState.currentUser.login) || [{}];
  
    updateData();

    newTaskButton.addEventListener('click', () => {

      if (newTaskButton.className == 'btn btn-primary') {
        newTaskButton.className = 'btn btn-light task-button-edit'
        readyBtnSpan.textContent = 'Add card';
        readyBtnSpan.className = 'task-container-button-text';
        svgReady.style.display = "initial";
        let nodeLIst = document.querySelectorAll("#container-ready > div.task-container-items");
        nodeLIst[nodeLIst.length - 1].firstChild.contentEditable = 'false';
        let task = new Task(appState.currentUser.login, nodeLIst[nodeLIst.length - 1].firstChild.textContent);
        showObj.push(task);
        Task.save(task);
        newTaskButton.blur();
        updateBtnStatus(showObj);
        genTaskList(showObj, menuStarted.firstChild.nextElementSibling);
      } else {
        newTaskButton.className = 'btn btn-primary';
        readyBtnSpan.className = 'task-container-button-text button-span__clicked'
        readyBtnSpan.textContent = 'Submit';
        svgReady.style.display = "none";
        addNewTask(containerReady, contReadyDl);
      }
      if (finishedSubmitBtn.className === 'btn btn-primary' || startedSubmitBtn.className === 'btn btn-primary') {
        finishedSubmitBtn.className = 'btn btn-primary d-none';
        newFinishedBtn.className = 'btn btn-light task-button-edit show';
        startedSubmitBtn.className = 'btn btn-primary d-none';
        newStartedBtn.className = 'btn btn-light task-button-edit show';
      }
    });


    jQuery('#dropdown-menu-started').on('click', function (e) {

      const nodeLIst = menuStarted.querySelectorAll('ul > li');

      if (e.target.nodeName.toString().toUpperCase() === 'LI') {

        if (e.target.className === 'dropdown-item text-truncate active') {
          e.target.className = 'dropdown-item text-truncate';
          startedSubmitBtn.className = 'btn btn-primary d-none';
          newStartedBtn.className = 'btn btn-light task-button-edit show';
        } else {
          e.target.className = 'dropdown-item text-truncate active';
          startedSubmitBtn.className = 'btn btn-primary';
          newStartedBtn.className = 'btn btn-light task-button-edit d-none';
        }

        nodeLIst.forEach(key => {
          if (e.target.id !== key.id) {
            e.target.className !== 'dropdown-item text-truncate active' ?
              key.className = 'dropdown-item text-truncate' :
              key.className = 'dropdown-item text-truncate disabled';
          }
        });
      }
    });


    startedSubmitBtn.addEventListener('click', (e) => {
      let listId = null;
      const nodeLIst = menuStarted.querySelectorAll('ul > li');
      menuStarted.className = "dropdown-menu";
      startedSubmitBtn.className = 'btn btn-primary d-none';
      newStartedBtn.className = 'btn btn-light task-button-edit';
      nodeLIst.forEach(key => {
        key.classList[2] === "active" ? listId = key.id : null;
      });
      showObj.forEach(key => {
        if (key.id === listId) {
          key.status = "started";
          key.createTime = Date.now();
        }
      });
      showObj = showObj.sort((a, b) => a.createTime - b.createTime);
      Task.update(showObj);
      updateData();
      if (finishedSubmitBtn.className === 'btn btn-primary') {
        finishedSubmitBtn.className = 'btn btn-primary d-none';
        newFinishedBtn.className = 'btn btn-light task-button-edit show';
      }


    });
    
    /*$(document).ready(function(){
      $('.dropdown').on('show.bs.dropdown', function(){
        alert('The dropdown is about to be shown.');
      });
      $('.dropdown').on('shown.bs.dropdown', function(){
        alert('The dropdown is now fully shown.');
      });
      $('.dropdown').on('hide.bs.dropdown', function(e){
        alert('The dropdown is about to be hidden.');
      });
      $('.dropdown').on('hidden.bs.dropdown', function(){
        alert('The dropdown is now fully hidden.');
      });
    });*/


    jQuery('#dropdown-menu-finished').on('click', function (e) {

      const nodeLIst = menuFinished.querySelectorAll('ul > li');

      if (e.target.nodeName.toString().toUpperCase() === 'LI') {

        if (e.target.className === 'dropdown-item text-truncate active') {
          e.target.className = 'dropdown-item text-truncate';
          finishedSubmitBtn.className = 'btn btn-primary d-none';
          newFinishedBtn.className = 'btn btn-light task-button-edit show';
        } else {
          e.target.className = 'dropdown-item text-truncate active';
          finishedSubmitBtn.className = 'btn btn-primary';
          newFinishedBtn.className = 'btn btn-light task-button-edit d-none';
        }

        nodeLIst.forEach(key => {
          if (e.target.id !== key.id) {
            e.target.className !== 'dropdown-item text-truncate active' ?
              key.className = 'dropdown-item text-truncate' :
              key.className = 'dropdown-item text-truncate disabled';
          }
        });
      }
    });

    finishedSubmitBtn.addEventListener('click', (e) => {
      let listId = null;
      const nodeLIst = menuFinished.querySelectorAll('ul > li');
      menuFinished.className = "dropdown-menu";
      finishedSubmitBtn.className = 'btn btn-primary d-none';
      newFinishedBtn.className = 'btn btn-light task-button-edit';
      nodeLIst.forEach(key => {
        key.classList[2] === "active" ? listId = key.id : null;
      });
      showObj.forEach(key => {
        if (key.id === listId) {
          key.status = "finished";
          key.createTime = Date.now();
        }
      });
      showObj = showObj.sort((a, b) => a.createTime - b.createTime);
      Task.update(showObj);
      updateData();
      if (startedSubmitBtn.className === 'btn btn-primary') {
        startedSubmitBtn.className = 'btn btn-primary d-none';
        newStartedBtn.className = 'btn btn-light task-button-edit show';
      }

    });


    function detect(objArray = [{}], status = 'ready') {
      let result = false;
      if (isEmptyObject(objArray) || Object.keys(objArray[0]).length === 0) {
        console.log('Array is Empty!!!');
      } else {
        objArray.forEach(key => {
          key.status === status ? result = true : result = result;
        });
      }
      return result;
    }

    function calcTasks(objArray = [{}]) {
      let active = 0;
      let finished = 0;
      if (isEmptyObject(objArray) || Object.keys(objArray[0]).length === 0) {
        console.log('Array is Empty!!!');
      } else {
        objArray.forEach(key => {
          key.status === 'started' ? active += 1 : active = active;
          key.status === 'finished' ? finished += 1 : finished = finished;
        });
      }
      activeTasks.textContent = active;
      finishedTasks.textContent = finished;
    }



    function updateBtnStatus(objArray = [{}]) {

      !detect(objArray, 'ready') ?
        newStartedBtn.className = 'btn btn-light task-button-edit disabled' :
        newStartedBtn.className = 'btn btn-light task-button-edit';

        !detect(objArray, 'started') ?
        newFinishedBtn.className = 'btn btn-light task-button-edit disabled' :
        newFinishedBtn.className = 'btn btn-light task-button-edit';
    }

    function updateData(status = 'all') {
      clearTasks();
      showTasks(showObj, containerReady, contReadyDl, containerStarted, contStartedDl, containerFinished, contFinishedDl);
      if (status === 'started') {
        genTaskList(showObj, menuFinished.firstChild.nextElementSibling, 'started');
      } else if (status === 'ready') {
        genTaskList(showObj, menuStarted.firstChild.nextElementSibling, 'ready');
      } else {
        genTaskList(showObj, menuFinished.firstChild.nextElementSibling, 'started');
        genTaskList(showObj, menuStarted.firstChild.nextElementSibling, 'ready');
      }
      updateBtnStatus(showObj);
      calcTasks(showObj);
    }
  } else {
    alert(`No data access! Current user is:${appState}`);
  }
}
