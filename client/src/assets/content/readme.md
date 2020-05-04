# Readme

This is a markdown document with some basic information.

```ts
import {
  Component,
  OnInit
} from '@angular/core';

import { SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

import { MarkedService } from '../../services';

@Component({
  selector: 'home-route',
  templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit {
  markdown: SafeHtml;

  constructor(
    private http: HttpClient,
    public marked: MarkedService
  ) { }

  ngOnInit() {
    this.http.get(`assets/content/readme.md`, { responseType: 'text' })
      .subscribe(data => {
        this.markdown = this.marked.convert(data);
      });
  }
}
```
