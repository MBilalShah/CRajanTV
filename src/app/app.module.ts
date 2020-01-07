import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { Question1Component } from './question1/question1.component';
import { Question2Component } from './question2/question2.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {AngularFireModule} from '@angular/fire'
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import { environment } from 'src/environments/environment.prod';
import { FirestoreServiceService } from './Firebase/firestore-service.service';
import { UploadServiceService } from './Firebase/upload-service.service';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import { LearnVideoComponentComponent } from './learn-video-component/learn-video-component.component';
import { PracticeVideoComponentComponent } from './practice-video-component/practice-video-component.component';
import {MatSliderModule} from '@angular/material';
import 'hammerjs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { EmbedComponentComponent } from './embed-component/embed-component.component'
// import { ModalModule, } from 'ngx-bootstrap/modal';
import { ModalModule, BsModalService} from 'ngx-bootstrap'
// import {} from '@ng-bootstrap/@ng-bootstrap'
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [
    AppComponent,
    VideoPlayerComponent,
    Question1Component,
    Question2Component,
 
    LearnVideoComponentComponent,
    PracticeVideoComponentComponent,
    EmbedComponentComponent,
    
  ],
  imports: [
    BrowserModule,ReactiveFormsModule,FormsModule ,AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, 'CrajanTv'),
    AngularFireStorageModule,
    AngularFirestoreModule,NgbModule,
    RoundProgressModule,
    MatSliderModule,
    TooltipModule.forRoot(),   ModalModule,
  ],
  providers: [    FirestoreServiceService,
    UploadServiceService,BsModalService],
  bootstrap: [AppComponent],entryComponents:[EmbedComponentComponent,]
})
export class AppModule { }
