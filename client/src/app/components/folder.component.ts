import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import {
  Document,
  Folder
} from '../models';

@Component({
  selector: 'folder',
  templateUrl: 'folder.component.html'
})
export class FolderComponent {
  @Input() folder: Folder;
  @Input() margin = 8;
  @Output() selected = new EventEmitter<Document>();
}
