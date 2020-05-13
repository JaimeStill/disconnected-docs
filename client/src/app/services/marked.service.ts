import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import * as marked from 'marked';
import * as prism from 'prismjs';

import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-csharp';

import { environment } from '../../environments/environment';

@Injectable()
export class MarkedService {
  private renderer = new marked.Renderer();
  private parser = marked;

  constructor(
    private sanitizer: DomSanitizer
  ) {
    this.renderer.code = function(code, lang, escaped) {
      code = this.options.highlight(code, lang);

      if (!lang) {
        return `<pre><code>code</code></pre>`;
      }

      const langClass = `language-${lang}`;

      return `<pre class="${langClass}"><code class="${langClass}">${code}</code></pre>`;
    };

    this.parser.setOptions({
      baseUrl: environment.server,
      renderer: this.renderer,
      highlight: (code, lang) => prism.highlight(code, prism.languages[lang || 'js'], lang || 'js'),
      gfm: true,
      smartLists: true,
      sanitize: false
    });
  }

  convert = (markdown: string) => this.sanitizer.bypassSecurityTrustHtml(this.parser.parse(markdown));
}
