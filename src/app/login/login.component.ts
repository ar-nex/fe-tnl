import { Component } from '@angular/core';
import { ConstantsService } from '../services/constants.service';
import { PublicNavComponent } from "../layouts/public-nav/public-nav.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { catchError } from 'rxjs/operators';
import { SessionStorageService } from '../services/session-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [PublicNavComponent, ReactiveFormsModule]
})
export class LoginComponent {
  brand = this.consstants.companyName;
  loginForm!: FormGroup;
  submitting = false;
  invalidForm = false;
  isCredentialWrong = false;
  constructor(
    private consstants: ConstantsService,
    private fb: FormBuilder,
    private http: HttpService,
    private sessionStorageService : SessionStorageService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.invalidForm = true;
      return;
    } else {
      this.submitting = true;
      this.isCredentialWrong = false;
      this.invalidForm = false;

      this.http.postUnAuth("auth/login", this.loginForm.value)
        .pipe(
          catchError(error => {
            console.error(error); // Log the error for demonstration purposes
            this.isCredentialWrong = true;
            throw error;// Re-throw the error so it can be caught elsewhere if necessary
          })
        )
        .subscribe(
          (res: any) => {
            this.submitting = false;
            this.sessionStorageService.set(this.consstants.SS_TOKEN_KEY, res.token);
            this.sessionStorageService.set(this.consstants.SS_USER_NAME, res.userName);
            this.sessionStorageService.set(this.consstants.SS_USER_ID, res.userId);
            this.sessionStorageService.set(this.consstants.SS_USER_TYPE, res.userType);
            this.router.navigate(["dashboard"]);
          }
        ).add(() => {
          // Reset submitting flag after request completes
          this.submitting = false;
        });
    }
    }
  }





