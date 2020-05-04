import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import {
  ContentService,
  MarkedService
} from '../../services';

import { Document } from '../../models';

@Component({
  selector: 'home-route',
  templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  private sub: Subscription;

  markdown: SafeHtml;

  constructor(
    private marked: MarkedService,
    public content: ContentService
  ) { }

  ngOnInit() {
    this.content.getBaseFolder();

    this.sub = this.content.document$.subscribe(data => {
      if (data) {
        this.markdown = this.marked.convert(data.contents);
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  selectDocument = (document: Document) => this.content.getDocument(document);
}
