import { Injectable, ElementRef } from '@angular/core';
import { Tutorial } from '../Models/Tutorial.Model';

@Injectable({
  providedIn: 'root'
})
export class VideoControlsService {

  constructor() { }

  videoControl: any
  
  videoControlInit(control: ElementRef) {
    this.videoControl = control.nativeElement

  }

  tutorial: Tutorial

  setTutorial(tutorial: Tutorial) {
    this.tutorial = tutorial
  }

  setVolume(vol: number) {
    this.videoControl.volume=vol;
  }

  changeSrc(url) {
    this.videoControl.src = url
  }

  replay() {
    this.videoControl.currentTime = 0;
  }

  play(onEnd) {



    this.videoControl.play()



    // this.videoControl.playbackRate = 2.0;
    this.videoControl.onended = function () {

      onEnd()
    }
  }
  pause() {
    this.videoControl.pause()
  }
  changeVideo(path: string) {
    this.videoControl.src = path
  }


  toggleFullScreen(elem: any) {
    if (!document.fullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();

      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();

      }
    }


  }

  isFullScreen() {
    return document.fullscreen;
  }

  // closeFullScreen(){
  //   document.exitFullscreen();
  // }

  isPaused() {
    if (this.videoControl) {
      return this.videoControl.paused
    }
    else {
      return false;
    }
  }
  playing() {
    return this.videoControl.playing
  }
  currentTime():number {
    if (this.videoControl) {

      if (this.videoControl.currentTime > 0) {
        return this.videoControl.currentTime;
      }
      else {
        return 0;
      }

    }
    else {
      return 0;
    }

  }
  setCurrentTime(value) {
    this.videoControl.currentTime = value
  }
  duration():number {
    if (this.videoControl) {

      return this.videoControl.duration
    }
    else {
      return 1;
    }


  }
}
