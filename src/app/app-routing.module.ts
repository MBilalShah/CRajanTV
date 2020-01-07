import { VideoPlayerComponent } from './video-player/video-player.component';
import { Question2Component } from './question2/question2.component';
import { Question1Component } from './question1/question1.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LearnVideoComponentComponent } from './learn-video-component/learn-video-component.component';
import { PracticeVideoComponentComponent } from './practice-video-component/practice-video-component.component';


const routes: Routes = [
  {
    path: '',
    component: Question1Component
  },
  {
    path: 'survey',
    component: Question2Component
  },
  {
    path: 'video',
    component: VideoPlayerComponent
  },
  {
    path: 'learn-video',
    component: LearnVideoComponentComponent
  }, 
  {
    path: 'practice-video',
    component: PracticeVideoComponentComponent
  },
  {
    path: '**',
    redirectTo: '/'
  }
];


@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
