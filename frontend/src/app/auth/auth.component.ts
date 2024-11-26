import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth.service';
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {
    this.authService.removeAuthorization();

    const accessToken = this.activatedRoute.snapshot.queryParams['accessToken'];
    if (accessToken) {
      this.authService.setAccessToken(accessToken);
      this.router.navigate(['/']).then((r) => '');
    }
  }

  doLogin() {
    this.authService.loginViaGoogle();
  }
}
