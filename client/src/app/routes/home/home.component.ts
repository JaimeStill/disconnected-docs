import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  Renderer2,
  ViewChild
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import {
  ContentService,
  MarkedService,
  ThemeService
} from '../../services';

import {
  Document,
  Folder
} from '../../models';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'home-route',
  templateUrl: 'home.component.html'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private subs = new Array<Subscription>();

  markdown: SafeHtml;
  docUrl: string;
  expanded = true;

  constructor(
    private dom: ElementRef,
    private marked: MarkedService,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    public content: ContentService,
    public themer: ThemeService
  ) { }

  @ViewChild('renderOutlet', { static: true }) renderOutlet: ElementRef<HTMLElement>;

  private renderAsInnerHTML = (data: Document) => {
    this.markdown = this.marked.convert(data.contents);
  }

  private render = (data: Document) => {
    const outlet = this.dom.nativeElement.querySelector('#renderOutlet');
    const doc = this.marked.convertRaw(data.contents);
    this.renderer.setProperty(outlet, 'innerHTML', doc);

    if (this.route.snapshot.fragment) {
      const anchor = outlet.querySelector(`#${this.route.snapshot.fragment}`);
      anchor && anchor.scrollIntoView(true);
    }
  }

  ngAfterViewInit() {
    this.route.url.subscribe(url => {
      this.markdown = null;
      this.docUrl = null;
      this.content.clear();

      if (url.length > 0) {
        const paths = url.map(segment => segment.path);

        if (paths[paths.length - 1].endsWith('.md')) {
          this.docUrl = paths[paths.length - 1];
          this.content.getDocument(paths.join('/'));
          this.content.getFolder(paths.slice(0, paths.length - 1).join('/'));
        } else {
          this.content.getFolder(paths.join('/'));
        }
      } else {
        this.content.getFolder(environment.root);
      }

      this.subs.push(
        this.content.document$.subscribe(data => {
          if (data) {
            this.render(data);
            this.markdown = this.marked.convert(data.contents);
          }
        })
      );

      this.subs.push(
        this.content.folder$.subscribe(data => {
          if (this.markdown || this.docUrl) {
            return;
          }

          if (data && data.hasReadme) {
            data.breadcrumbs
              ? this.content.getDocument(`${data.breadcrumbs.join('/')}/readme.md`)
              : this.content.getDocument(`readme.md`);
          }
        })
      );
    });
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  toggleExpanded = () => this.expanded = !this.expanded;

  navigateUp = (folder: Folder) => this.router.navigate(
    folder && folder.breadcrumbs && folder.breadcrumbs.length > 1
      ? folder.breadcrumbs.slice(0, folder.breadcrumbs.length - 1)
      : ['/']
  )

  selectDocument = (document: Document) => {
    this.router.navigate([...document.breadcrumbs, document.name]);
  }

  selectFolder = (folder: Folder) => {
    this.router.navigate([...folder.breadcrumbs]);
  }
}
