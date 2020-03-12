import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private firestore: AngularFirestore) { }
  data: any;

  update(form: any) {
    let data = Object.assign({}, form);
    delete data.id;
    return this.firestore.doc('articulos/' + form.id).update(data);
  }

  delete(id: any) {
    return this.firestore.collection('articulos').doc(id).delete();
  }

  add(data: any) {
    var data = Object.assign({}, data);
    delete data.id;
    return this.firestore.collection('articulos').add(data);
  }


  log() {
    return this.firestore.collection('articulos').snapshotChanges();
  }


}
