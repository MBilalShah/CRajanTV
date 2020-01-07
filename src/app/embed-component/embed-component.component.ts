import { Component, OnInit, Input, SecurityContext,ViewChild,ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { VideoControlsService } from '../services/video-controls.service';
@Component({
  selector: 'app-embed-component',
  templateUrl: './embed-component.component.html',
  styleUrls: ['./embed-component.component.scss']
})
export class EmbedComponentComponent implements OnInit {

  constructor(public sanitizer: DomSanitizer,private videoControl:VideoControlsService) { }

  // @Input() shouldShow:boolean;
  @Input() src: string;
  @Input() start: number;
  @Input() end: number;
  @ViewChild('videoContainer', { static: false }) videoContainer: ElementRef;
 
  url = "https://www.youtube.com/embed/v-Z0bLvvcnY?start=" + this.start + "&end=" + this.end
  shouldShow: boolean = false;
  ngOnInit() {

    if(this.videoControl.isFullScreen()){
      this.videoControl.toggleFullScreen(this.videoContainer)
    }
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/v-Z0bLvvcnY?start=" + this.start + "&end=" + this.end) as any
    this.shouldShow = true;
  }

  cleanUrl() {
    if (!this.shouldShow) {
      return this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/v-Z0bLvvcnY?start=" + this.start + "&end=" + this.end)
    }

  }
}
