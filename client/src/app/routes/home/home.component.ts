import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  Renderer2,
  ViewChild
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  UrlSegment
} from '@angular/router';

import { SafeHtml } from '@angular/platform-browser';

import {
  combineLatest,
  Subscription
} from 'rxjs';

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
export class HomeComponent implements OnInit, OnDestroy {
  private subs = new Array<Subscription>();

  expanded = true;
  document: Document;
  folder: Folder;

  markdown: SafeHtml;
  docUrl: string;

  constructor(
    private self: ElementRef,
    private marked: MarkedService,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    public content: ContentService,
    public themer: ThemeService
  ) { }

  private reset = () => {
    this.document = null;
    this.folder = null;
  }

  private loadReadme = async (folder: Folder) => this.document = folder.breadcrumbs
    ? await this.content.getDocumentAsync(`${folder.breadcrumbs.join('/')}/readme.md`)
    : await this.content.getDocumentAsync(`readme.md`)

  private initialize = async (url: UrlSegment[], fragment: string) => {
    this.reset();
    await this.loadData(url);
    if (this.document) this.render(this.document, fragment);
  }

  private loadData = async (url: UrlSegment[]) => {
    if (url.length > 0) {
      const paths = url.map(segment => segment.path);

      if (paths[paths.length - 1].endsWith('.md')) {
        this.document = await this.content.getDocumentAsync(paths.join('/'));
        this.folder = await this.content.getFolderAsync(paths.slice(0, paths.length - 1).join('/'));
      } else {
        this.folder = await this.content.getFolderAsync(paths.join('/'));
        if (this.folder.hasReadme) await this.loadReadme(this.folder);
      }
    } else {
      this.folder = await this.content.getFolderAsync(environment.root);
      if (this.folder.hasReadme) await this.loadReadme(this.folder);
    }
  }

  private render = (data: Document, fragment: string) => {
    const outlet = this.self.nativeElement.querySelector('#renderOutlet');
    const doc = this.marked.convert(data.contents);
    this.renderer.setProperty(outlet, 'innerHTML', doc);

    if (fragment) {
      const anchor = outlet.querySelector(`#${fragment}`);
      if (anchor) anchor.scrollIntoView(true);
    }
  }

  ngOnInit() {
    this.subs.push(
      combineLatest([this.route.url, this.route.fragment])
        .subscribe(data => {
          if (data.length > 1)  this.initialize(data[0], data[1]);
        })
    );
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
