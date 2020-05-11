import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import {
  ContentService,
  MarkedService
} from '../../services';

import {
  Document,
  Folder
} from '../../models';

@Component({
  selector: 'home-route',
  templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  private subs = new Array<Subscription>();

  markdown: SafeHtml;

  constructor(
    private marked: MarkedService,
    private route: ActivatedRoute,
    private router: Router,
    public content: ContentService
  ) { }

  ngOnInit() {
    this.route.url.subscribe(url => {
      if (url.length > 0) {
        const paths = url.map(segment => segment.path);

        if (paths[paths.length - 1].endsWith('.md')) {
          this.content.getDocument(paths.join('/'));
          this.content.getFolder(paths.slice(0, paths.length - 1).join('/'));
        } else {
          this.content.getFolder(paths.join('/'));
        }
      } else {
        this.content.getBaseFolder();
      }
    });

    this.subs.push(
      this.content.document$.subscribe(data => {
        if (data) {
          this.markdown = this.marked.convert(data.contents);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  selectDocument = (document: Document) => {
    this.router.navigate([...document.breadcrumbs, document.name]);
  }

  selectFolder = (folder: Folder) => {
    this.router.navigate([...folder.breadcrumbs]);
  }
}
