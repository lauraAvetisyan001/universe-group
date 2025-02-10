import { Component, DestroyRef, inject } from '@angular/core';
import { CreateDocumentComponent } from './create-document/create-document.component';
import { CommonModule } from '@angular/common';
import { DocumentsListComponent } from './documents-list/documents-list.component';
import { AuthService } from '../../shared/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-document-panel',
  imports: [CommonModule, CreateDocumentComponent, DocumentsListComponent],
  templateUrl: './document-panel.component.html',
  styleUrl: './document-panel.component.scss',
})
export class DocumentPanelComponent {
  public role: string | null = null;

  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);

  public ngOnInit(): void {
    this.authService
      .checkUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.role = data.role;
        this.authService.setUserRole(data.role);
      });
  }
}