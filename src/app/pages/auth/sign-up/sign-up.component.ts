import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { UserRole } from '../../../shared/models/user-role.type';
import { AuthService } from '../../../shared/services/auth.service';
import { RegisterRequest } from '../../../shared/interfaces/auth';
import { catchError, EMPTY, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { AuthComponent } from '../auth.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    MatSelectModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  private destroy$: Subject<void> = new Subject();

  public roles: UserRole[] = ['USER', 'REVIEWER'];
  public registerForm!: FormGroup;

  @Output() tabChanged: EventEmitter<number> = new EventEmitter<number>();

  private toastr = inject(ToastrService);
  private authComponent = inject(AuthComponent);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.registerForm = this.fb.group({
      fullName: new FormControl('', [Validators.required]),
      role: new FormControl('User', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  public signUp(): void {
    const registerForm: RegisterRequest = {
      fullName: this.registerForm.value.fullName,
      role: this.registerForm.value.role,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
    };

    this.authService
      .register(registerForm)
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          if (error.status === 409) {
            this.toastr.error('This email already exist');
          }
          return EMPTY;
        })
      )
      .subscribe((response) => {
        if (response) {
          this.registerForm.reset();
          this.authComponent.switchToSignInTab();
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
