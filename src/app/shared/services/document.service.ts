import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Document, DocumentResponse } from '../interfaces/document';
import { Params } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private apiUrl = `${environment.URL_SERVER}/document`;
  public documentAdded = signal<boolean>(false);

  private http = inject(HttpClient);

  public addDocument(formData: FormData): Observable<Document> {
    return this.http.post<Document>(this.apiUrl, formData).pipe(
      tap(() => {
        this.documentAdded.set(true);
      })
    );
  }

  public getDocuments(params: Params): Observable<DocumentResponse> {
    return this.http.get<DocumentResponse>(this.apiUrl, { params });
  }

  public getDocumentById(id: string): Observable<Document> {
    return this.http.get<Document>(`${this.apiUrl}/${id}`);
  }

  public updateDocumentName(id: string, name: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}`, { name });
  }

  public updateDocumentStatus(
    id: string,
    status: string
  ): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/change-status`, {
      status,
    });
  }

  public deleteDocument(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  public revokeDocument(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/revoke-review`, {});
  }

  public sendToReview(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/send-to-review`, {});
  }
}