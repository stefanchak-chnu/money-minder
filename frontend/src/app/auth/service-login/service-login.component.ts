import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './service-login.component.html',
  styleUrl: './service-login.component.scss',
})
export class ServiceLoginComponent implements OnInit {
  protected loginForm!: FormGroup;
  protected error: String | undefined;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.cdr.detectChanges();
  }

  onSubmit(): void {
    this.authService.removeAuthorization();

    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.loginWithCredentials(username, password).subscribe({
        next: (token) => {
          const accessToken = token.body.token;
          if (accessToken) {
            this.authService.setAccessToken(accessToken);
            this.router.navigate(['/']).then((r) => '');
          }
        },
        error: (error) => (this.error = error.message),
      });
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSubmit();
    }
  }
}
