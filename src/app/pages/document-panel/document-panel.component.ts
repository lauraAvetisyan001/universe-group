import { Component, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CreateDocumentComponent } from './create-document/create-document.component';
import { CommonModule } from '@angular/common';
import { DocumentsListComponent } from './documents-list/documents-list.component';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-document-panel',
  imports: [CommonModule, CreateDocumentComponent, DocumentsListComponent],
  templateUrl: './document-panel.component.html',
  styleUrl: './document-panel.component.scss',
})
export class DocumentPanelComponent {
  private destroy$: Subject<void> = new Subject();

  public role: string | null = null;
  private authService = inject(AuthService);

  public ngOnInit(): void {
    this.authService
      .checkUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.role = data.role;
        this.authService.setUserRole(data.role);
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
