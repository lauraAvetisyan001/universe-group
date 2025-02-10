import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DocumentStatuses } from '../../interfaces/document-statuses';
import { REVIEWER_STATUSES } from '../../constants/document-statuses';
import { EditDialogData } from '../../interfaces/edit-dialog-data';
import { AuthService } from '../../services/auth.service';
import { MaterialModule } from '../../modules/material.module';

@Component({
  selector: 'app-edit-document-dialog',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MaterialModule],
  templateUrl: './edit-document-dialog.component.html',
  styleUrls: ['./edit-document-dialog.component.scss'],
})
export class EditDocumentDialogComponent {
  private dialogRef = inject(MatDialogRef<EditDocumentDialogComponent>);
  public data = inject<EditDialogData>(MAT_DIALOG_DATA);

  public updatedData: Partial<EditDialogData> = {};
  public statuses: DocumentStatuses[] = REVIEWER_STATUSES;
  public selectedStatus: string = this.data.status;
  public name: string = this.data.name;

  public role: string | null = null;
  private authService = inject(AuthService);

  public ngOnInit(): void {
    this.role = this.authService.getUserRole();
  }

  public confirmChanges(): void {
    if (this.name !== this.data.name) {
      this.updatedData.name = this.name;
    }

    if (this.selectedStatus !== this.data.status) {
      this.updatedData.status = this.selectedStatus;
    }

    if (Object.keys(this.updatedData).length > 0) {
      this.dialogRef.close(this.updatedData);
    } else {
      this.dialogRef.close();
    }
  }

  public cancel(): void {
    this.dialogRef.close();
  }
}
