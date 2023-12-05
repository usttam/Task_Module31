import { isEmptyObject } from "jquery";

export const getFromStorage = function (key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
};

export const updateStorage = function (obj, key) {
  localStorage.removeItem(key);
  localStorage.setItem(key, JSON.stringify(obj));
};


export const addToStorage = function (obj, key) {
  const storageData = getFromStorage(key);
  storageData.push(obj);
  localStorage.setItem(key, JSON.stringify(storageData));
};

export const addNewUser = function (User,login = null, password = 'qwerty123', logo = null) {
  let ckeckUser = false;
  if (login!==null){       
    let checkUserObj = getFromStorage('users');    
    if(!isEmptyObject(checkUserObj)){ 
      ckeckUser =false;  
      checkUserObj.forEach(key => {
        if (key.login === login){                    
           alert ('user already exist');
           ckeckUser = true;          
        }          
      }); 
      if (!ckeckUser) {
        const testUser = new User(login, password);
        logo === null ?  logo = 'https://avatars.githubusercontent.com/u/98681?v=4' : logo = logo;
        testUser.setLogo = logo;
        User.save(testUser);  
      }      
    } 
  } else {
    alert ('login name is empty or null');
  }
  
};

export const generateTestUser = function (User, Task = null,login = 'test', password = 'qwerty123', logo = null) {
  if(isEmptyObject(getFromStorage(login))){
    localStorage.clear(); 
    const testUser = new User(login, password);
    logo === null ?  logo = 'https://avatars.githubusercontent.com/u/98681?v=4' : logo = logo;
    testUser.setLogo = logo;
    User.save(testUser);
    Task !== null ? generateTestTasks(Task, testUser.login) : console.log('Task = null');
  } else {
    console.log ('test user data already exist');
  }  
};

export const generateTestTasks = function (Task, user = 'testTask') {
  const status = ['ready', 'started', 'finished'];
  let newTask = null;
  for (let i = 0; i < 10; i++) {
    newTask = new Task(user, `This is Test Message ${i+1}!!!!`);
    newTask.setStatus = status[Math.floor(Math.random() * 3)];
    Task.save(newTask);
  }
};

export const showTasks = function (objArray = [{}], containerId_1 = null, insertToId_1 = null, containerId_2 = null, insertToId_2 = null, containerId_3 = null, insertToId_3 = null) {
  if (isEmptyObject(objArray) || Object.keys(objArray[0]).length === 0) {
    console.log('Tasks is Empty!!!');
  } else {
    objArray.forEach(key => {
      if (key.status === 'ready') {
        addNewTask(containerId_1, insertToId_1, false, key.data);
      } else if (key.status === 'started') {
        addNewTask(containerId_2, insertToId_2, false, key.data);
      } else if (key.status === 'finished') {
        addNewTask(containerId_3, insertToId_3, false, key.data);
      } else {
        console.log('not recognize status is: ' + key.status);
      }

    });
  }

}
export const clearTasks = function () {
  let nodeLIst = document.querySelectorAll("div.task-container-items");
  if (nodeLIst !== undefined || nodeLIst !== null) {
    nodeLIst.forEach(key => {
      key.remove();
    });
  }
}


export const addNewTask = function (containerId, insertToId, focus = true, data = null) {
  const taskContainer = containerId || document.querySelector("#container-ready");
  const insertTask = insertToId || document.querySelector("#button-container-ready");
  const div = document.createElement('div');
  div.className = 'task-container-items';
  taskContainer.insertBefore(div, insertTask);
  let p = document.createElement('p');
  p.className = 'task-container-text text-start'
  data !== null ? p.textContent = data : console.log('data is empty');
  div.append(p);
  if (!focus) {
    p.contentEditable = "false";
  } else {
    p.contentEditable = "true";
    p.focus();
    p.addEventListener('blur', () => {
      const buttonEl = document.querySelector("#add-new-task");
      const spanEl = document.querySelector("#ready-button-text");
      const svgEl = document.querySelector('#svg-new-task');
      if (p.textContent === '' || p.textContent === null) {
        buttonEl.className = 'btn btn-light task-button-edit'
        spanEl.textContent = 'Add card';
        spanEl.className = 'task-container-button-text'
        svgEl.style.display = "initial";
        div.remove();
      }
    })
  }
};

export const genTaskList = function (objArray = [{}], containerId = null, status = "ready") {
  if (isEmptyObject(objArray) || Object.keys(objArray[0]).length === 0 || containerId == null) {
    console.log('Array is Empty or containerId is null!!!');
  } else {
    while (containerId.firstChild) {
      containerId.removeChild(containerId.firstChild);
    }
    objArray.forEach(key => {
      if (key.status === status) {
        const li = document.createElement('li');
        li.className = 'dropdown-item text-truncate';
        li.textContent = key.data;
        li.id = key.id;
        // const p = document.createElement('p');
        //  p.className = 'dropdown-item';
        // p.textContent = key.data;   
        //  li.appendChild(p);  
        containerId.insertBefore(li, containerId.children[0]);
      }
    });
  }
};


   


