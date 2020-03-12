import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { RouterModule, Routes } from '@angular/router';
import {FormsModule,ReactiveFormsModule} from '@angular/forms'
import { AppComponent } from './app.component';
import { ArticleComponent } from './componentes/article/article.component';
import { RegisterComponent } from './componentes/register/register.component';

const path: Routes = [
  { path: 'articulo', component: ArticleComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', component: RegisterComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ArticleComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,ReactiveFormsModule,
    RouterModule.forRoot(path),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
