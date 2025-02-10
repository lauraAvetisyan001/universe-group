import {
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  Injector,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { DocumentService } from '../../../shared/services/document.service';
import { catchError, EMPTY, filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Document } from '../../../shared/interfaces/document';
import { MatDialog } from '@angular/material/dialog';
import { EditDocumentDialogComponent } from '../../../shared/components/edit-document-dialog/edit-document-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import PSPDFKit from 'pspdfkit';
import {
  REVIEWER_FILTERS,
  USER_FILTERS,
} from '../../../shared/constants/document-statuses';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../shared/services/auth.service';
import { User } from '../../../shared/interfaces/auth';
import { Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from '../../../shared/modules/material.module';

@Component({
  selector: 'app-documents-list',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MaterialModule],
  templateUrl: './documents-list.component.html',
  styleUrl: './documents-list.component.scss',
})
export class DocumentsListComponent {
  @ViewChild('app', { static: false }) appContainer: ElementRef | undefined;

  public page: WritableSignal<number> = signal(1);
  public size: WritableSignal<number> = signal(9);
  public isNextDisabled: WritableSignal<boolean> = signal<boolean>(false);
  public documents: WritableSignal<Document[]> = signal<Document[]>([]);

  public isShowFile: WritableSignal<boolean> = signal<boolean>(false);
  public user: WritableSignal<User | null> = signal<User | null>(null);

  public role: string = '';
  public creatorId: string = '';

  public selectedSort: string = '';
  public sorts: string[] = ['Name', 'ASC'];
  public selectedStatusFilter: string = '';
  public statusFilters = computed(() =>
    this.user()?.role === 'REVIEWER' ? REVIEWER_FILTERS : USER_FILTERS
  );

  private userId = computed(() =>
    this.user()?.role === 'USER' ? this.user()?.id : this.creatorId
  );

  private destroyRef = inject(DestroyRef);
  private documentService = inject(DocumentService);
  private injector = inject(Injector);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  public ngOnInit(): void {
    this.authService
      .checkUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.user.set(data);
        this.role = data.role;
        this.loadDocuments();
      });

    effect(
      () => {
        if (this.documentService.documentAdded()) {
          this.loadDocuments();
          this.documentService.documentAdded.set(false);
        }
      },
      { injector: this.injector }
    );
  }

  public showFile(id: string): void {
    this.documentService
      .getDocumentById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        PSPDFKit.load({
          baseUrl: location.protocol + '//' + location.host + '/assets/',
          document: response.fileUrl,
          container: '#app',
        }).then((instance) => {
          (window as any).instance = instance;
        });
      });
    this.isShowFile.set(true);
  }

  public closeFile(): void {
    if (this.appContainer) {
      PSPDFKit.unload(this.appContainer.nativeElement);
      this.isShowFile.set(false);
    }
  }

  public loadDocuments(): void {
    const params: Params = {
      page: this.page(),
      size: this.size(),
    };

    if (this.selectedStatusFilter && this.selectedStatusFilter !== 'noFilter') {
      params['status'] = this.selectedStatusFilter;
    }
    if (this.selectedSort) {
      params['sort'] = this.selectedSort.toLowerCase();
    }
    if (this.userId()) {
      params['creator'] = this.userId();
    }

    this.documentService
      .getDocuments(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        if (this.role === 'REVIEWER') {
          response.results = response.results.filter(
            (doc) => doc.status !== 'DRAFT'
          );
        }
        this.documents.set(response.results);
      });
  }

  public nextPage(): void {
    this.page.set(this.page() + 1);
    this.loadDocuments();
  }

  public prevPage(): void {
    if (this.page() > 1) {
      this.page.set(this.page() - 1);
      this.loadDocuments();
    }
  }

  public openEditDialog(document: Document): void {
    const dialogRef = this.dialog.open(EditDocumentDialogComponent, {
      data: { name: document.name, status: document.status },
    });
    dialogRef
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((result) => !!result)
      )
      .subscribe((result) => {
        if (result?.name) {
          this.documentService
            .updateDocumentName(document.id, result.name)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
              document.name = result.name;
            });
        }
        if (result?.status) {
          this.documentService
            .updateDocumentStatus(document.id, result.status)
            .pipe(
              takeUntilDestroyed(this.destroyRef),
              catchError((error) => {
                if (error) {
                  this.toastr.error(error.error.message);
                }
                return EMPTY;
              })
            )
            .subscribe(() => {
              document.status = result.status;
            });
        }
      });
  }

  public deleteDocument(id: string): void {
    this.documentService
      .deleteDocument(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.documents.set(this.documents().filter((doc) => doc.id !== id));
      });
  }

  public sendToReview(id: string): void {
    this.documentService
      .sendToReview(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.documents.update((docs) =>
          docs.map((doc) =>
            doc.id === id ? { ...doc, status: 'READY_FOR_REVIEW' } : doc
          )
        );
      });
  }

  public revokeDocument(id: string): void {
    this.documentService
      .revokeDocument(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.documents.update((docs) =>
          docs.map((doc) =>
            doc.id === id ? { ...doc, status: 'REVOKE' } : doc
          )
        );
      });
  }
}
