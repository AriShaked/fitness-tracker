import { UiService } from './../../shared/ui.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs/Subscription';
import { map, take } from 'rxjs/operators';

import { Exercise } from './../models/exercise.model';
import * as Training from './../training.actions';
import * as fromTraining from '../training.reducer';
import * as UI from '../../shared/ui.actions';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private fbsubs: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UiService,
    private store: Store<fromTraining.State>
  ) {}

  fetchAvailableExercise() {
    this.store.dispatch(new UI.StartLoading());
    this.fbsubs.push(
      this.db
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map(docAarray => {
            return docAarray.map(doc => {
              return {
                id: doc.payload.doc.id,
                name: doc.payload.doc.data()['name'],
                duration: doc.payload.doc.data()['duration'],
                calories: doc.payload.doc.data()['calories']
              };
            });
          })
        )
        .subscribe(
          (exercises: Exercise[]) => {
            this.store.dispatch(new UI.StopLoading());
            this.store.dispatch(new Training.SetAavailableTrainings(exercises));
            // this.availableExercise = exercises;
            // this.exercisesChanged.next([...this.availableExercise]);
          },
          error => {
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackbar('Exercises not available', null, 3000);
            this.store.dispatch(new Training.StopTraining());
          }
        )
    );
  }

  stratExercise(selectedId: string) {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise() {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe(ex => {
        this.addDataToDataBase({
          ...ex,
          date: new Date(),
          state: 'completed'
        });
        this.store.dispatch(new Training.StopTraining());
      });
  }

  cancelExersice(progress: number) {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe(ex => {
        this.addDataToDataBase({
          ...ex,
          duration: ex.duration * (progress / 100),
          calories: ex.calories * (progress / 100),
          date: new Date(),
          state: 'canceled'
        });
        this.store.dispatch(new Training.StopTraining());
      });
  }

  fetchCompletedOrCancelledExercises() {
    this.fbsubs.push(
      this.db
        .collection('finishedExercises')
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
          this.store.dispatch(new Training.SetFinishedTrainings(exercises));
        })
    );
  }

  cancelSubsciption() {
    this.fbsubs.forEach(sub => sub.unsubscribe());
  }

  private addDataToDataBase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}
