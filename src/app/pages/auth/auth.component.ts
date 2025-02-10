import { Component, signal, ViewChild, WritableSignal } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    SignInComponent,
    SignUpComponent,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  public selectedTabIndex: WritableSignal<number> = signal(0);

  public switchToSignInTab(): void {
    this.selectedTabIndex.set(0);
    this.tabGroup.selectedIndex = this.selectedTabIndex();
  }
}
