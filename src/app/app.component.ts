import { AuthService } from './auth/services/auth.service';
import { Component, ViewChild, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // title = 'fitness-tarcker';
  // openSidenav = false;
  // @ViewChild('sidenav')
  // onToggle() {

  // }
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.initAuthListener();
  }
}
