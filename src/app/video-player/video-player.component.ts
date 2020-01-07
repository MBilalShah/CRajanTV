import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FirestoreServiceService } from '../Firebase/firestore-service.service';
import { UploadServiceService } from '../Firebase/upload-service.service';
import { Tutorial } from '../Models/Tutorial.Model';
import { VideoControlsService } from '../services/video-controls.service';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { AccountserviceService } from '../services/accountservice.service';
import { UserExpertise } from '../enums/UserExperties.enum';
import { PracticeOrLearn } from '../enums/PracticeOrLearn.enum';
import { windowCount } from 'rxjs/operators';


@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {

  constructor(private fs: FirestoreServiceService, private upload: UploadServiceService, private videoControl: VideoControlsService, private account: AccountserviceService) { }
  error = ""
  isPlaying: boolean = false;
  showAutoPauseMenu: boolean = false;
  videoSource = ""

  showLoopControls: boolean
  tutorial: Tutorial
  videoIndex = 0;
  practiceVideoIndex = 0;
  showPracticeLoopControls: boolean = false;
  activeLoopIndex = 0

  activePracticeOrLearn = PracticeOrLearn.learn

  @ViewChild('myVideo', { static: false }) videoplayer: ElementRef;
  @ViewChild('videoContainer', { static: false }) videoContainer: ElementRef;


  ngOnInit() {
    console.log(this.account.getExpertise())


  }

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

        case UserExpertise.begginer:
          this.tutorial.totalStops = 2
          break;
      }

      this.upload.getimageurl(this.tutorial[this.activePracticeOrLearn][this.videoIndex].src).subscribe(path => {
        this.videoControl.changeSrc(path)
        console.log(path)
      })

      // this.toggleVideo()
    })
  }
  toggleVideo() {
    if (!this.isPlaying) {

      if (this.activePracticeOrLearn == PracticeOrLearn.learn) {
        this.videoControl.play(onEnd => {
          //fires when video is completed
          this.isPlaying = !this.isPlaying    //shows the main controls
          // increments current stop count
          if (this.tutorial.totalStops <= this.tutorial.stops) {
            //user expertise does not allow more videos to be played together. Replay according to user's input.

            window.setInterval(function () { }, 5000)

            if (this.tutorial[this.activePracticeOrLearn][this.videoIndex].currentCount >= this.tutorial[this.activePracticeOrLearn][this.videoIndex].totalCount) {
              //check if total count and current count is same. play next video
              this.videoIndex = this.videoIndex + 1
              this.upload.getimageurl(this.tutorial[this.activePracticeOrLearn][this.videoIndex].src).subscribe(path => {
                this.videoControl.changeSrc(path)
                this.toggleVideo()
              })

            } else {
              //replay video

              this.tutorial[this.activePracticeOrLearn][this.videoIndex].currentCount = this.tutorial[this.activePracticeOrLearn][this.videoIndex].currentCount + 1

              this.videoIndex = this.videoIndex - this.tutorial.totalStops
              if (this.videoIndex < 0) {
                this.videoIndex = 0
              }

              this.upload.getimageurl(this.tutorial[this.activePracticeOrLearn][this.videoIndex].src).subscribe(path => {
                this.videoControl.changeSrc(path)
                this.toggleVideo()
              })

            }


          } else {
            this.tutorial.stops = +1;
            this.videoIndex = this.videoIndex + 1
            if (this.videoIndex < this.tutorial[this.activePracticeOrLearn].length - 1) {
              this.upload.getimageurl(this.tutorial[this.activePracticeOrLearn][this.videoIndex].src).subscribe(path => {
                this.videoControl.changeSrc(path)
                this.toggleVideo()
              })
            }

          }

        })
      }

      if (this.activePracticeOrLearn == PracticeOrLearn.practice) {

      }

      this.isPlaying = !this.isPlaying
    }
    else {
      this.videoControl.pause()
      this.isPlaying = !this.isPlaying
    }
  }

  fullScreenToggle() {
    this.videoControl.toggleFullScreen(this.videoContainer.nativeElement)
  }
  pause() {
    this.isPlaying = false;
    this.videoControl.pause()
  }
  replay() {
    this.videoControl.replay()
  }


  playFromLoopControl() {
    this.upload.getimageurl(this.tutorial[this.activePracticeOrLearn][this.activeLoopIndex].src).subscribe(path => {
      this.videoControl.changeSrc(path)
      this.toggleVideo()
    })
  }

  setLoopCountVideo(number: number) {
    if (this.tutorial[this.activePracticeOrLearn][this.activeLoopIndex].currentCount > number) {
      this.tutorial[this.activePracticeOrLearn][this.activeLoopIndex].currentCount = 0;
    }
    this.tutorial[this.activePracticeOrLearn][this.activeLoopIndex].totalCount = number;
  }

  setLearnIndexLoop(number: number) {
    this.tutorial.videoPaths[this.activeLoopIndex].totalCount = number
    console.log(this.tutorial)
    this.showLoopControls = false;
  }

  setPracticeIndexLoop(number: number) {
    this.tutorial.practiceVideoPath[this.activePracticeLoopIndex].totalCount = number
    console.log(this.tutorial)

  }
  setActiveLoop(number: number) {
    this.activeLoopIndex = number
  }
  setActivePracticeLoop(number: number) {
    this.activePracticeLoopIndex = number
  }
  activeLoopIndicator(number: number) {
    if ((this.tutorial.videoPaths[this.activeLoopIndex].totalCount - this.tutorial.videoPaths[this.activeLoopIndex].currentCount) >= number) {
      return true;
    }
    else {
      return false;
    }
  }
  activePracticeLoopIndex = 0;
  activePracticeLoopIndicator(number: number) {
    if ((this.tutorial.practiceVideoPath[this.activePracticeLoopIndex].totalCount - this.tutorial.practiceVideoPath[this.activePracticeLoopIndex].currentCount) >= number) {
      return true;
    }
    else {
      return false;
    }
  }
  togglePracticeOrLearn() {
    if (this.activePracticeOrLearn == PracticeOrLearn.learn) {
      this.activePracticeOrLearn = PracticeOrLearn.practice
      this.videoIndex = 0
      this.upload.getimageurl(this.tutorial.practiceVideoPath[this.videoIndex].src).subscribe(path => {
        this.videoControl.changeSrc(path)
        this.toggleVideo()
      })
    } else {
      this.activePracticeOrLearn = PracticeOrLearn.learn
      this.videoIndex = 0
      this.upload.getimageurl(this.tutorial.videoPaths[this.videoIndex].src).subscribe(path => {
        this.videoControl.changeSrc(path)
        this.toggleVideo()
      })
    }
    this.videoIndex
  }

  isPaused() {
    return this.videoControl.isPaused()
  }
  playLearnVideo() {
    this.upload.getimageurl(this.tutorial.videoPaths[this.activeLoopIndex].src).subscribe(path => {
      this.videoControl.changeSrc(path)
      this.toggleVideo()
    })
    this.showLoopControls = false;
  }


}
