import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'matchHighlight'
})
export class MatchHighlightPipe implements PipeTransform {

  transform(value: string, match: string): string {
    if (!match) {
      return value;
    }
    const rgx = new RegExp(match, 'gi');
    const matchedValue = value.match(rgx);

    if (!matchedValue || !value) {
      return value;
    }

    return value.replace(rgx, `<span class="match">${matchedValue[0]}</span>`);
  }

}
