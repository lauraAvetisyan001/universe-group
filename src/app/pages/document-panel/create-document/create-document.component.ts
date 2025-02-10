import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DocumentService } from '../../../shared/services/document.service';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { MaterialModule } from '../../../shared/modules/material.module';

@Component({
  selector: 'app-create-document',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MaterialModule],
  templateUrl: './create-document.component.html',
  styleUrl: './create-document.component.scss',
})
export class CreateDocumentComponent {
  private destroy$: Subject<void> = new Subject();

  public documentForm!: FormGroup;
  public selectedFile: File | null = null;

  private fb = inject(FormBuilder);
  private documentService = inject(DocumentService);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  public ngOnInit(): void {
    this.documentForm = this.fb.group({
      name: ['', Validators.required],
      file: [null, Validators.required],
    });
  }

  public onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.documentForm.patchValue({ file: this.selectedFile });
    this.documentForm.get('file')?.updateValueAndValidity();
  }

  public submitDocument(status: 'DRAFT' | 'READY_FOR_REVIEW'): void {
    const formData: FormData = new FormData();
    formData.append('name', this.documentForm.value.name);
    formData.append('status', status);
    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }

    this.documentService
      .addDocument(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.documentForm.reset();
        this.selectedFile = null;
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}