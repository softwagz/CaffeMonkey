import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private firestore: AngularFirestore) { }

  update(form: any) {
    let data = Object.assign({}, form.data);
    delete data.id;
    return this.firestore.doc('clientes/'+ form.id).update(data);
  }

  delete(id: any) {
    return this.firestore.collection('clientes').doc(id).delete();
  }

  add(data: any) {

    return this.firestore.collection('clientes').add(data);
  }


  loadCli() {
    return this.firestore.collection('clientes').snapshotChanges();

  }
}
