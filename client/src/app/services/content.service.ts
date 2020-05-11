import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

import {
  Document,
  Folder
} from '../models';

const api = environment.api;

@Injectable()
export class ContentService {
  private folder = new BehaviorSubject<Folder>(null);
  private document = new BehaviorSubject<Document>(null);

  folder$ = this.folder.asObservable();
  document$ = this.document.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  getBaseFolder = () => this.http.get<Folder>(`${api}document/getBaseFolder`)
    .subscribe(
      data => this.folder.next(data),
      err => console.error(err)
    )

  getFolder = (path: string) => this.http.get<Folder>(`${api}document/getFolder/${path}`)
    .subscribe(
      data => this.folder.next(data),
      err => console.error(err)
    )

  getDocument = (path: string) => this.http.get<Document>(`${api}document/getDocument/${path}`)
    .subscribe(
      data => this.document.next(data),
      err => console.error(err)
    )
}
