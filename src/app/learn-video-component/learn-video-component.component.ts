import { Component, OnInit, ViewChild, ElementRef, AfterViewInit,OnDestroy } from '@angular/core';
import { Tutorial } from '../Models/Tutorial.Model';
import { FirestoreServiceService } from '../Firebase/firestore-service.service';
import { VideoControlsService } from '../services/video-controls.service';
import { AccountserviceService } from '../services/accountservice.service';
import { UserExpertise } from '../enums/UserExperties.enum';
import { UploadServiceService } from '../Firebase/upload-service.service';
import { PracticeOrLearn } from '../enums/PracticeOrLearn.enum';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { EmbedComponentComponent } from '../embed-component/embed-component.component';

@Component({
  selector: 'app-learn-video-component',
  templateUrl: './learn-video-component.component.html',
  styleUrls: ['./learn-video-component.component.scss']
})
export class LearnVideoComponentComponent implements OnInit {
  isPlaying: boolean;
  fullsc: boolean;
  @ViewChild('myVideo', { static: false }) videoplayer: ElementRef;
  @ViewChild('videoContainer', { static: false }) videoContainer: ElementRef;
  @ViewChild('playerBox', { static: false }) playerBox: ElementRef;
  constructor(private fs: FirestoreServiceService, private videoControl: VideoControlsService, private account: AccountserviceService, private upload: UploadServiceService
    , private router: Router,private modalService:NgbModal) { }

  tutorial: Tutorial
  UserExpertise: UserExpertise
  videoIndex = 0
  showVolumeControl = false;
  activeLoopIndex = 0;
  current: number;
  countStep1 = "8"
  countStep2 = "8"
  countStep3 = "8"
  countStep4 = "8"
  interval:any
  ngOnInit() {
    console.log(this.account.getExpertise())
    var that=this;
   this.interval= setInterval(function(){
      that.currentTime=that.getCurrentTime(that.videoIndex)

    },1000)
  }
  ngOnDestroy(){
    clearInterval(this.interval)
  }
  currentTime='0'
  ngAfterViewInit() {
    this.videoControl.videoControlInit(this.videoplayer)
    this.fs.getTutorial().then(tutorialDoc => {
      console.log(tutorialDoc.data())
      this.tutorial = tutorialDoc.data() as Tutorial
      switch (this.account.getExpertise()) {
        case UserExpertise.begginer:
          this.tutorial.totalStops = 0
          break;

        case UserExpertise.intermediate:
          this.tutorial.totalStops = 1
          break;

        case UserExpertise.expert:
          this.tutorial.totalStops = 2
          break;
      }

      this.upload.getimageurl(this.tutorial[PracticeOrLearn.learn][this.videoIndex].src).subscribe(path => {
        this.videoControl.changeSrc(path)
        console.log(path)
      })

      // this.toggleVideo()
    })
  }
  toggleVideo() {
    if (!this.isPlaying) {

      this.current = 0
      console.log(this.isPlaying)
      this.isPlaying = !this.isPlaying
      console.log(this.isPlaying)
      this.videoControl.play(onEnd => {
        //fires when video is completed
        //shows the main controls
        // increments current stop count
        this.isPlaying = !this.isPlaying
        if (this.tutorial.totalStops <= this.videoIndex) {
          //user expertise does not allow more videos to be played together. Replay according to user's input.



          if (this.tutorial[PracticeOrLearn.learn][this.videoIndex].currentCount >= this.tutorial[PracticeOrLearn.learn][this.videoIndex].totalCount) {
            //check if total count and current count is same. play next video
            this.videoIndex = this.videoIndex + 1

            this.isPlaying = false
            if(this.videoIndex===this.tutorial.videoPaths.length){
              return
            }
            this.upload.getimageurl(this.tutorial[PracticeOrLearn.learn][this.videoIndex].src).subscribe(path => {
              this.videoControl.changeSrc(path)
              if(this.tutorial.videoPaths[this.videoIndex - 1].shouldPause){
                this.current = 1;

              }else{

                this.isPlaying=false;
                this.toggleVideo()
              }

            })

          } else {
            //replay video

            this.tutorial[PracticeOrLearn.learn][this.videoIndex].currentCount = this.tutorial[PracticeOrLearn.learn][this.videoIndex].currentCount + 1

            if(this.account.getExpertise() ===UserExpertise.expert && this.videoIndex==3){ //special case
              this.videoIndex=this.videoIndex
            }else{
              this.videoIndex = this.videoIndex - this.tutorial.totalStops
            }



            if (this.videoIndex < 0) {
              this.videoIndex = 0
            }

            this.upload.getimageurl(this.tutorial[PracticeOrLearn.learn][this.videoIndex].src).subscribe(path => {
              this.videoControl.changeSrc(path)
              this.toggleVideo()
            })

          }


        } else {

          this.tutorial.stops = this.tutorial.stops + 1;
          this.videoIndex = this.videoIndex + 1
          if (this.videoIndex <= this.tutorial[PracticeOrLearn.learn].length - 1) {
            this.upload.getimageurl(this.tutorial[PracticeOrLearn.learn][this.videoIndex].src).subscribe(path => {
              this.videoControl.changeSrc(path)
              this.toggleVideo()
            })
          }

        }

      })



      // this.isPlaying = !this.isPlaying
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

  setLoopCountVideo(number: number) {
    if (this.tutorial[PracticeOrLearn.learn][this.activeLoopIndex].currentCount > number) {
      this.tutorial[PracticeOrLearn.learn][this.activeLoopIndex].currentCount = 0;
    }
    this.tutorial[PracticeOrLearn.learn][this.activeLoopIndex].totalCount = number;
  }
  playFromLoopControl() {
    this.upload.getimageurl(this.tutorial[PracticeOrLearn.learn][this.activeLoopIndex].src).subscribe(path => {
      this.videoControl.changeSrc(path)
      this.toggleVideo()
    })
  }
  setActiveLoop(number: number) {
    this.activeLoopIndex = number
  }
  activeLoopIndicator(number: number) {
    if ((this.tutorial.videoPaths[this.activeLoopIndex].totalCount - this.tutorial.videoPaths[this.activeLoopIndex].currentCount) == number) {
      return true;
    }
    else {
      return false;
    }
  }
getRepeatCount(index){
  return this.tutorial.videoPaths[index].totalCount - this.tutorial.videoPaths[index].currentCount
}
  hasRepeaters(number, index) {
    if ((this.tutorial.videoPaths[index].totalCount - this.tutorial.videoPaths[index].currentCount) >= number) {
      return true;
    }
    else {
      return false;
    }
  }

  isPaused() {
    return this.videoControl.isPaused()
  }
  showLoopControls: boolean = false;
  setLearnIndexLoop(number: number) {
    this.tutorial.videoPaths[this.activeLoopIndex].totalCount = number
    console.log(this.tutorial)
    this.showLoopControls = false;
  }
  shouldShowLoopControls(number) {
    if (this.tutorial.totalStops === 0) {
      return true;
    }
    if (this.tutorial.totalStops === 1) {
      if (number == 1 || number == 3) {
        return true;
      }
    }
    if (this.tutorial.totalStops === 2) {
      if (number == 2 || number == 3) {
        return true;
      }
    }
    return false;
  }

  playLearnVideo() {

    this.videoIndex = this.activeLoopIndex
    this.upload.getimageurl(this.tutorial.videoPaths[this.videoIndex].src).subscribe(path => {
      this.videoControl.changeSrc(path)
      this.toggleVideo()
      this.showLoopControls = false;
    })

  }
  goToPractice() {
    this.router.navigate(['practice-video'])
  }
  sliderValue(value, index) {
    console.log(value)
    if (this.videoIndex == index) {
      this.videoControl.setCurrentTime(value.value)
    }

  }

  getCurrentTime(index):string {

    // console.log('video index',index)
    if (this.videoIndex == index) {

      return this.videoControl.currentTime().toFixed(0)
    }
    else {
      return '0'
    }

  }
  getDuration(index) {
    if (this.videoIndex == index) {
      return this.videoControl.duration().toFixed(0)
    }
    else {
      return 1
    }

  }


  currentValue(event) {
    // console.log(event)
    if (event == 1) {
      this.toggleVideo()
    }
  }
  replay() {
    this.videoControl.replay()

  }
  playPrevious() {
    if (this.videoControl.currentTime() < 2) {
      if ((this.videoIndex - 1) >= 0) {
        var shouldShow = this.shouldShowLoopControls(this.videoIndex)
        this.videoIndex = this.videoIndex - 1;
        if (shouldShow) {
          this.upload.getimageurl(this.tutorial.videoPaths[this.videoIndex].src).subscribe(path => {
            this.videoControl.changeSrc(path)
            this.isPlaying = false;
            this.toggleVideo()
          })
        } else {
          this.playPrevious()
        }

      } else {
        this.videoIndex = this.tutorial.videoPaths.length - 1
        this.upload.getimageurl(this.tutorial.videoPaths[this.videoIndex].src).subscribe(path => {
          this.videoControl.changeSrc(path)
          this.isPlaying = false;
          this.toggleVideo()
        })
      }
    } else {
      this.replay()
    }
  }
  playNext() {

    if ((this.videoIndex + 1) < this.tutorial.videoPaths.length) {
      var shouldShow = this.shouldShowLoopControls(this.videoIndex)
      this.videoIndex = this.videoIndex + 1
      if (shouldShow) {


        this.upload.getimageurl(this.tutorial.videoPaths[this.videoIndex].src).subscribe(path => {
          this.videoControl.changeSrc(path)
          this.isPlaying = false;
          this.toggleVideo()
        })
      }
      else {
        this.playNext()
      }


    }
    else {
      this.videoIndex = 0
      this.upload.getimageurl(this.tutorial.videoPaths[this.videoIndex].src).subscribe(path => {
        this.videoControl.changeSrc(path)
        this.isPlaying = false;
        this.toggleVideo()
      })
    }
  }

  volume = 10;
  changeVolume(event) {
    this.volume = event.value
    console.log(this.volume)
    this.videoControl.setVolume(this.volume/10)
  }
  setplayPauseOnStopBool(bool){
    this.tutorial.videoPaths[this.activeLoopIndex].shouldPause=bool
  }
  openUrl(){
    // this.videoControl.closeFullScreen();

    // var timeInSecond=this.videoControl.currentTime()
    // var minutes=Math.floor(timeInSecond/60)
    // var seconds=Math.round(timeInSecond - (minutes * 60))
    // // 1m34s
    // debugger;
    // window.open('https://www.youtube.com/watch?v=2OEL4P1Rz04&t='+minutes+'m'+seconds+'s')

    this.isPlaying=false;
    this.videoControl.pause()
    var modalRef=this.modalService.open(EmbedComponentComponent)
    var start=0
    var end=0
    if(this.videoIndex==0){
     if(this.account.getExpertise()==UserExpertise.begginer){
      start=0
      end=4
     }else if(this.account.getExpertise()==UserExpertise.intermediate){
      start=0
      end=9
     }else{
      start=0
      end=14
     }

    }else if(this.videoIndex==1){
      if(this.account.getExpertise()==UserExpertise.begginer){
        start=4
        end=9
       }else if(this.account.getExpertise()==UserExpertise.intermediate){
        start=4
        end=9
       }else{
        start=4
        end=13
       }
    }else if(this.videoIndex==2){
      if(this.account.getExpertise()==UserExpertise.begginer){
        start=9
        end=13
       }else if(this.account.getExpertise()==UserExpertise.intermediate){
        start=9
        end=17
       }else{
        start=9
        end=13
       }

    }else if(this.videoIndex==3){
      if(this.account.getExpertise()==UserExpertise.begginer){
        start=13
        end=17
       }else if(this.account.getExpertise()==UserExpertise.intermediate){
        start=13
        end=17
       }else{
        start=13
        end=17
       }

    }
    modalRef.componentInstance.start=start;
    modalRef.componentInstance.end=end





  }
  embedShow=false;

  getBarCount(index){
    if(this.account.getExpertise()===UserExpertise.begginer){
      console.log(8)
      return 8;
    }
    else if(this.account.getExpertise()===UserExpertise.intermediate){
      if(index==0 || index==2){
        console.log(16)
        return 16
      }
    }else if(this.account.getExpertise()===UserExpertise.expert){
      if(index==1){
        console.log(24)
        return 24
      }else if(index==3){
        console.log(8)
        return 8
      }
    }
  }
}
