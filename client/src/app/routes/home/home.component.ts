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
  outlet: HTMLElement;

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

    if (this.outlet) {
      if (this.outlet.hasChildNodes()) {
        this.outlet.childNodes.forEach(node => this.renderer.removeChild(this.outlet, node));
      }

      this.renderer.removeAttribute(this.outlet, 'fxFlex');
    }
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
    const doc = this.marked.convert(data.contents);
    this.renderer.setProperty(this.outlet, 'innerHTML', doc);
    this.renderer.setAttribute(this.outlet, 'fxFlex', '');

    if (fragment) {
      const images = this.outlet.querySelectorAll('img');
      let loaded = 0;

      images.forEach((img: HTMLImageElement) =>
        img.addEventListener('load', () => {
          loaded++;
          if (loaded === images.length) {
            const anchor = this.outlet.querySelector(`#${fragment}`) as HTMLHeadingElement;
            if (anchor) this.renderer.setProperty(this.outlet, 'scrollTop', anchor.offsetTop - this.outlet.offsetTop);
            images.forEach((i: HTMLImageElement) => i.removeEventListener('load', null));
          }
        }));
      // const anchor = outlet.querySelector(`#${fragment}`);
      // if (anchor) this.renderer.setProperty(outlet, 'scrollTop', anchor.offsetTop - outlet.offsetTop);
    }
  }

  ngOnInit() {
    this.outlet = this.self.nativeElement.querySelector('#renderOutlet');

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
    this.reset();
    this.router.navigate([...document.breadcrumbs, document.name]);
  }

  selectFolder = (folder: Folder) => {
    this.reset();
    this.router.navigate([...folder.breadcrumbs]);
  }
}
