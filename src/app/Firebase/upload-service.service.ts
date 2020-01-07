import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadServiceService {

  // Main task
  task: AngularFireUploadTask;

  // Progress monitoring

  constructor(private storage: AngularFireStorage, private db: AngularFirestore) {

  }




  startUpload(event: File, filepath: string) {
    // The File object
    console.log(event);

    const file = event;


    console.log(event);
    // Client-side validation example
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      alert("unsuported file type :(")
      return;
    }
    if (file.size > 5242880) {
      alert("image can not be larger than 5MB")
      return;
    }


    // The storage path
    //const path = `test/${new Date().getTime()}_${file.name}`;



    const path = filepath;

    // Totally optional metadata
    const customMetadata = { app: 'FaceOff' };

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata })

    // Progress monitoring

    return this.task.percentageChanges();

    // this.snapshot = this.task.snapshotChanges()
    // this.snapshot.subscribe(data => {
    //   console.log(data)
    // })

    // The file's download URL
    //this.downloadURL = this.task.downloadURL();
  }

  // Determines if the upload task is active
  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes
  }

  getimageurl(path): Observable<any> {
    // console.log(path)
    var thumbPath = path.slice(0, 36) + 'thumb_' + "" + path.slice(36)
    return this.storage.ref("").child(path).getDownloadURL();
  }


}
