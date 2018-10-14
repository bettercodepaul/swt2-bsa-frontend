import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'truncation'
})
export class TruncationPipe implements PipeTransform {

  transform(input: string, truncationLength: number): string {
    if (input.length > truncationLength) {
      return input.substring(0, truncationLength) + '...';
    } else {
      return input;
    }
  }

}
