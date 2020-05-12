import { Injectable } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Injectable()
export class ThemeService {
  isLight = true;
  toggleTheme = () => {
    this.isLight = !this.isLight;
    this.setOverlayContainerTheme();
  }

  constructor(
    private overlay: OverlayContainer
  ) {
    this.setOverlayContainerTheme();
  }

  setOverlayContainerTheme = () => {
    if (this.isLight) {
      this.overlay.getContainerElement().classList.remove('dark');
      this.overlay.getContainerElement().classList.add('light');
    } else {
      this.overlay.getContainerElement().classList.remove('light');
      this.overlay.getContainerElement().classList.add('dark');
    }
  }
}
