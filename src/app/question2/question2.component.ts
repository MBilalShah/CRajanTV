import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question2',
  templateUrl: './question2.component.html',
  styleUrls: ['./question2.component.scss']
})
export class Question2Component implements OnInit {

  constructor(private fb:FormBuilder , private router:Router ) { }

  surveyForm2: FormGroup;
  formdata: any;
  ngOnInit() {
    this.surveyForm2 = this.fb.group({
      likeToWatch:['' , Validators.required],
      instructionalVideoWatchCount: ['' , Validators.required],
      practiceVideoWatchCount: ['' , Validators.required]
    });
  }

  handleSubmit(){
    this.formdata = this.surveyForm2.value;
    console.log(this.formdata);
    this.router.navigate(['/video']);
  }



}

