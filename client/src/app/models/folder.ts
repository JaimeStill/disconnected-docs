import { Document } from './document';

export interface Folder {
  name: string;
  path: string;
  documents: Document[];
  folders: Folder[];
}
