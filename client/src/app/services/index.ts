import { ContentService } from './content.service';
import { MarkedService } from './marked.service';
import { ThemeService } from './theme.service';

export const Services = [
  ContentService,
  MarkedService,
  ThemeService
];

export * from './content.service';
export * from './marked.service';
export * from './theme.service';
