import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { DocumentPanelComponent } from './pages/document-panel/document-panel.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { LoginGuard } from './shared/guards/login.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/document-panel', pathMatch: 'full' },
  { path: 'login', component: AuthComponent, canActivate: [LoginGuard] },
  {
    path: 'document-panel',
    component: DocumentPanelComponent,
    canActivate: [AuthGuard],
  },
];