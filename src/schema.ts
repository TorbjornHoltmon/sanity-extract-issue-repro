import type { SingleWorkspace } from 'sanity';
import { testDocument, youtubeObject } from './single-document';

export const schema: SingleWorkspace['schema'] = {
  types: [testDocument, youtubeObject],
};
