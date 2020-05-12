import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'toolbar',
  templateUrl: 'toolbar.component.html'
})
export class ToolbarComponent {
  @Input() color = 'primary';
  @Input() titleLink = '/';
  @Input() title = 'Documentation';
  @Input() elevation = 'el8';
  @Input() isLight = true;
  @Input() lightColor = 'accent';
  @Input() lightIcon = 'brightness_5';
  @Input() darkColor = 'default';
  @Input() darkIcon = 'brightness_3';

  @Output() theme = new EventEmitter();
}
