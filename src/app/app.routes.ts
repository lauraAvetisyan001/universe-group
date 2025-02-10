import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { DocumentPanelComponent } from './pages/document-panel/document-panel.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: AuthComponent },
  { path: 'document-panel', component: DocumentPanelComponent },
];
