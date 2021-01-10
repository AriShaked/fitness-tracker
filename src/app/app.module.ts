import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { StoreModule } from '@ngrx/store';


import { MaterialModule } from './material/material.module';
import { SharedModule } from './shared/shared.module';
import { environment } from './../environments/environment';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { AuthModule } from './auth/auth.module';
import { TrainingService } from './training/services/training.service';
import { AuthService } from './auth/services/auth.service';
import { UiService } from './shared/ui.service';
import { reducers } from './app.reducer';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    HeaderComponent,
    SidenavListComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AuthModule,
    StoreModule.forRoot(reducers),
    AngularFirestoreModule,
    SharedModule,
    MaterialModule

  ],
  providers: [AuthService , TrainingService , UiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
