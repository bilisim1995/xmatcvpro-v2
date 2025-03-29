import { marked } from 'marked';
import { legalContent } from './legal';

export function getLegalContent(page: 'rta' | 'disclaimer' | 'usc2257' | 'dmca' | 'privacy' | 'terms'): string {
  const content = legalContent[page];
  const result = marked.parse(content, { async: false });
  if (typeof result === 'string') {
    return result;
  }
  throw new Error('Unexpected Promise returned from marked.parse');
}