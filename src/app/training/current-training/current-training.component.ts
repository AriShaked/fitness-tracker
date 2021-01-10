import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import { TrainingService } from './../services/training.service';
import { StopTrainingComponent } from './stop-training.component';
import * as fromTraining from '../training.reducer';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
  progress = 0;
  timer: number;

  constructor(private dialog: MatDialog ,
              private store: Store<fromTraining.State>,
              private trainingService: TrainingService) { }
  ngOnInit() {
   this.startOrResumeTimer();
  }

  startOrResumeTimer() {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      const step = ex.duration;
      console.log('step' , step);
      this.timer = setInterval(() => {
        this.progress = this.progress + 1;
        if (this.progress >= 100) {
          this.trainingService.completeExercise();
          clearInterval(this.timer);
        }
      }, step);
    });
  }

  onStop() {
    clearInterval(this.timer);
    const dialogref = this.dialog.open(StopTrainingComponent,
       {data: {
         progress: this.progress
        }
      });
      dialogref.afterClosed().subscribe(result => {
        if (result) {
          this.trainingService.cancelExersice(this.progress);
        } else {
          this.startOrResumeTimer();
        }
      });
  }

}
