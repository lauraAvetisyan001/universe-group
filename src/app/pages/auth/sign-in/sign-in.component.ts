import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { LoginReq } from '../../../shared/interfaces/auth';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../shared/modules/material.module';

@Component({
  selector: 'app-sign-in',
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  private destroy$: Subject<void> = new Subject();

  public loginForm!: FormGroup;

  private router = inject(Router);
  private toastr = inject(ToastrService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  public login(): void {
    const loginForm: LoginReq = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    this.authService
      .login(loginForm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          localStorage.setItem('access_token', response.access_token);
          this.checkUser();
          this.router.navigate(['document-panel']);
        },
        error: (err: string) => {
          this.toastr.error(err);
        },
      });
  }

  public checkUser(): void {
    this.authService
      .checkUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.authService.setUserRole(data.role);
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
