import { MatSnackBar } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor(private snackBar: MatSnackBar ) { }

  showSnackbar(message , action , duration ) {
    this.snackBar.open(message, action , {
      duration: duration
    });
  }
}
