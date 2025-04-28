import { AsteriskIcon } from '@sanity/icons';
import type { StructureBuilder } from 'sanity/structure';
import type { SanityConfigOptions } from './create-config';

export function getFrontPageStructure(S: StructureBuilder, options: SanityConfigOptions) {
  return;
}

export function getStructure(options: SanityConfigOptions) {
  return (S: StructureBuilder) => {
    return S.list()
      .title('Content')
      .items([
        S.listItem().title('Test').icon(AsteriskIcon).child(S.document().schemaType('test').documentId('testID')),
      ]);
  };
}
