import { UserExpertise } from './../enums/UserExperties.enum';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountserviceService {

  constructor() { }

  setExpertise(expertise:UserExpertise){
    this.userExpertise=expertise;
    localStorage.setItem('expertise',JSON.stringify(this.userExpertise))
  }
  getExpertise(){
    if(this.userExpertise){
      return this.userExpertise
    }else{
      this.userExpertise=JSON.parse(localStorage.getItem('expertise'))
      return this.userExpertise
    }
  }
  private userExpertise: UserExpertise;
}
