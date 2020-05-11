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
  @Input() showSelf = true;
  @Output() documentSelected = new EventEmitter<Document>();
  @Output() folderSelected = new EventEmitter<Folder>();
}
