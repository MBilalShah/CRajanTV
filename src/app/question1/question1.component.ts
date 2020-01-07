import { UserExpertise } from './../enums/UserExperties.enum';
import { AccountserviceService } from './../services/accountservice.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-question1',
  templateUrl: './question1.component.html',
  styleUrls: ['./question1.component.scss']
})
export class Question1Component implements OnInit {

  constructor(private fb:FormBuilder , private router: Router , private as: AccountserviceService) { }

  surveyform1:FormGroup;
  formdata: any;
  points: number = 0;
  p1: number;
  p2:number;
  ngOnInit() {
    this.surveyform1 = this.fb.group({
      dancedBefore: ['', Validators.required],
      learnedThroughOnline: ['', Validators.required],
      countAtATime: ['', Validators.required],
      rating: ['', Validators.required]
      
    });

  
    console.log('gi')
  }


  submitquestion1(){
      this.formdata = this.surveyform1.value;
      console.log("form:", this.formdata);
      if(this.formdata.countAtATime){
          this.p1 = parseInt(this.formdata.countAtATime);
            this.points = this.points + this.p1;
           
      }
      if(this.formdata.dancedBefore){
        this.points += 5;
      }
      if(this.formdata.learnedThroughOnline){
        this.points += 4;
      }
      if(this.formdata.rating){
        this.p2 = parseInt(this.formdata.rating);
        this.points = this.points + this.p2;
        console.log("points:", this.points);
      }

    
      if( this.points <= 15){
        this.as.setExpertise(UserExpertise.begginer);
        console.log("begginer ha");
      }
     else if( this.points > 15 && this.points <= 20){
            this.as.setExpertise(UserExpertise.intermediate) ;
            console.log("intermediate ha");
     }
     else if(this.points > 20 ){
       this.as.setExpertise( UserExpertise.expert);
       console.log("expert ha");
     }
      this.router.navigate(['/learn-video']);
  }

}
