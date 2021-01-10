import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store } from '@ngrx/store';

import { TrainingService } from './../../training/services/training.service';
import { UiService } from './../../shared/ui.service';
import { AuthData } from './../auth-data.model';
import * as fromRoot from '../../app.reducer';
import * as UI from '../../shared/ui.actions';
import * as Auth from '../auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router,
              private afAuth: AngularFireAuth ,
              private uiService: UiService,
              private store: Store<fromRoot.State>,
              private trainingService: TrainingService) {}


    initAuthListener() {
      this.afAuth.authState.subscribe(user => {
        if ( user) {
          this.store.dispatch(new Auth.SetAuthenticated());
          this.router.navigate(['/training']);
        } else {
          this.trainingService.cancelSubsciption();
          this.store.dispatch(new Auth.SetUnauthenticated());
          this.router.navigate(['/login']);
        }
      });
    }

  registerUser(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.afAuth.auth.createUserWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(result => {
      this.store.dispatch(new UI.StopLoading());
      // this.uiService.loadingStateChanged.next(false);
      console.log(result);
    }).catch(error => {
      this.store.dispatch(new UI.StopLoading());
      // this.uiService.loadingStateChanged.next(false);
      this.uiService.showSnackbar(error.message , null , 3000);
    });
  }

  login(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    // this.uiService.loadingStateChanged.next(true);
    this.afAuth.auth.signInAndRetrieveDataWithEmailAndPassword(authData.email , authData.password)
    .then(result => {
      console.log(result);
      // this.uiService.loadingStateChanged.next(false);
      this.store.dispatch(new UI.StopLoading());
    }).catch(error => {
      // this.uiService.loadingStateChanged.next(false);
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackbar(error.message , null , 3000);
    });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

}
