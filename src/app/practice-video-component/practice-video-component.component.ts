import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { VideoControlsService } from '../services/video-controls.service';
import { FirestoreServiceService } from '../Firebase/firestore-service.service';
import { Tutorial } from '../Models/Tutorial.Model';
import { AccountserviceService } from '../services/accountservice.service';
import { UserExpertise } from '../enums/UserExperties.enum';
import { UploadServiceService } from '../Firebase/upload-service.service';
import { PracticeOrLearn } from '../enums/PracticeOrLearn.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-practice-video-component',
  templateUrl: './practice-video-component.component.html',
  styleUrls: ['./practice-video-component.component.scss']
})
export class PracticeVideoComponentComponent implements OnInit {

  constructor(private videoControl: VideoControlsService, private fs: FirestoreServiceService, private account: AccountserviceService, private upload: UploadServiceService,
    public videoProperties: VideoControlsService, private router: Router) { }

  @ViewChild('myVideo', { static: false }) videoplayer: ElementRef;
  @ViewChild('videoContainer', { static: false }) videoContainer: ElementRef;
  @ViewChild('playerBox', { static: false }) playerBox: ElementRef;
  isPlaying: boolean = false;
  interval;
  fullsc: boolean;
  ngOnInit() {
    var that=this;
    this.interval= setInterval(function(){
      that.currentTime=that.getCurrentTime()
      console.log('current time',that.currentTime)
    },1000)
  }
  ngOnDestroy(){
    clearInterval(this.interval)
  }
  currentTime='0'
  activePracticeOrLearn = PracticeOrLearn.practice
  videoIndex = 0
  tutorial: Tutorial
  expertise: number
  showLoopControls=false;
  ngAfterViewInit() {
    var that = this
    this.videoControl.videoControlInit(this.videoplayer)

    this.fs.getTutorial().then(tutorialDoc => {
      console.log(tutorialDoc.data())
      this.tutorial = tutorialDoc.data() as Tutorial
      this.expertise = this.account.getExpertise()
      console.log(this.expertise)
      switch (this.account.getExpertise()) {
        case UserExpertise.begginer:
          this.tutorial.totalStops = 0
          this.videoIndex = 2
          break;

        case UserExpertise.intermediate:
          this.tutorial.totalStops = 1
          this.videoIndex = 1
          break;

        case UserExpertise.begginer:
          this.tutorial.totalStops = 2
          this.videoIndex = 0
          break;
      }

      this.upload.getimageurl(this.tutorial[this.activePracticeOrLearn][this.videoIndex].src).subscribe(path => {
        this.videoControl.changeSrc(path)
        console.log(path)
      })

      // this.toggleVideo()
    })
  }

  current=0
  toggleVideo() {
    if (!this.isPlaying) {

      this.isPlaying = !this.isPlaying


      this.videoControl.play(onEnd => {
        //fires when video is completed
        this.isPlaying = !this.isPlaying    //shows the main controls
        if(this.indexLoop>0){
          if(this.shouldPause){
            this.current=1
            return
          }
          this.indexLoop=this.indexLoop-1
          this.toggleVideo()
        }
      })

    }
    else {
      this.videoControl.pause()
      this.isPlaying = !this.isPlaying
    }
  }

  fullScreenToggle() {
    this.videoControl.toggleFullScreen(this.videoContainer.nativeElement);
    if(!document.fullscreen){
      this.fullsc= true;
    }
    else{
      this.fullsc= false;
    }
  }
  pause() {
    this.isPlaying = false;
    this.videoControl.pause()
  }
  replay() {
    this.isPlaying=false;
    this.videoControl.replay()
    this.toggleVideo()
  }
  sliderValue(value) {
    console.log(value)
    this.videoControl.setCurrentTime(value.value)
  }
  getCurrentTime() {
    return this.videoControl.currentTime().toFixed(0)
  }
  getDuration() {
    return this.videoControl.duration().toFixed(0)
  }
  goToLearn() {
    this.router.navigate(['learn-video'])
  }

  setExpertise(index) {
    console.log(index)
    this.expertise = index;
    switch (index) {
      case UserExpertise.begginer:
        this.tutorial.totalStops = 0
        this.videoIndex = 2
        break;

      case UserExpertise.intermediate:
        this.tutorial.totalStops = 1
        this.videoIndex = 1
        break;

      case UserExpertise.expert:
        this.tutorial.totalStops = 2
        this.videoIndex = 0
        break;
    }
    this.upload.getimageurl(this.tutorial[this.activePracticeOrLearn][this.videoIndex].src).subscribe(path => {
      this.videoControl.changeSrc(path)
      this.toggleVideo()
      console.log(path)
    })

  }
  playNext() {
    if ((this.videoIndex - 1) < 0) {
      this.videoIndex = 2
    } else {
      this.videoIndex = this.videoIndex - 1
    }
    this.setExpertiseFromVideoIndex(this.videoIndex)
    this.upload.getimageurl(this.tutorial.practiceVideoPath[this.videoIndex].src).subscribe(path => {
      this.videoControl.changeSrc(path)
      this.toggleVideo()
    })
  }

  setExpertiseFromVideoIndex(videoIndex) {
    switch (videoIndex) {
      case 0:
        this.setExpertise(UserExpertise.expert)
        break;

      case 1:
        this.setExpertise(UserExpertise.intermediate)
        break;

      case 2:
        this.setExpertise(UserExpertise.begginer)
        break;

    }
  }
  playPrevious() {
    if (this.videoControl.currentTime() < 2) {
      if ((this.videoIndex - 1) >= 0) {
        // var shouldShow = this.shouldShowLoopControls(this.videoIndex)
        this.videoIndex = this.videoIndex - 1;

          this.upload.getimageurl(this.tutorial.practiceVideoPath[this.videoIndex].src).subscribe(path => {
            this.videoControl.changeSrc(path)
            this.isPlaying = false;
            this.toggleVideo()
          })


      } else {
        this.videoIndex = this.tutorial.practiceVideoPath.length - 1
        this.upload.getimageurl(this.tutorial.practiceVideoPath[this.videoIndex].src).subscribe(path => {
          this.videoControl.changeSrc(path)
          this.isPlaying = false;
          this.toggleVideo()
        })
      }
    } else {
      this.replay()
    }
  }

  showVolumeControl:boolean=false;
  volume = 10;
  changeVolume(event) {
    this.volume = event.value
    console.log(this.volume)
    this.videoControl.setVolume(this.volume/10)
  }
  indexLoop:number=0
  activeLoopIndicator(index){
    return index==this.indexLoop? true : false;
  }
  setLearnIndexLoop(index){
    this.indexLoop=index
  }
  shouldPause=true;
  currentValue(event) {
    // console.log(event)
   
    if (event == 1) {
      this.indexLoop=this.indexLoop-1
      this.toggleVideo()
      this.current=0
    }
  }
  toggleShouldPause(){
    this.shouldPause= ! this.shouldPause
  }
}
