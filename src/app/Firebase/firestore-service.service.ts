import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { UploadServiceService } from './upload-service.service';
import { switchMap } from 'rxjs/operators';

import { Router } from '@angular/router';
import { Tutorial } from '../Models/Tutorial.Model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreServiceService {
  uid;
  date;

  constructor(private fs: AngularFirestore) {
   
  }

  getTutorial():Promise<firebase.firestore.DocumentSnapshot>{

    return this.fs.collection('tutorials').doc('gspk70jFK5u3zmmu1sc1').get().toPromise() as Promise<firebase.firestore.DocumentSnapshot>
  }
  
}
