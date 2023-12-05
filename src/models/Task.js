import { BaseModel } from "./BaseModel";
import { addToStorage, updateStorage } from "../utils";

export class Task extends BaseModel{
  constructor(user,data){
    super();
    this.data = data;
    this.user=user;
    this.status='ready';
    this.createTime = Date.now();
  }
  set setStatus(status){
    this.status = status;
  }
  get getStatus(){
    return this.status;
  }
  static save(task) {
    try {
      addToStorage(task, task.user);
      return true;
      } catch (e) {
      throw new Error(e);
    }
  }    
  static update(task) {
    try {
      updateStorage(task, task[0].user || task.user);
      return true;
      } catch (e) {
      throw new Error(e);
    }
  }    
}