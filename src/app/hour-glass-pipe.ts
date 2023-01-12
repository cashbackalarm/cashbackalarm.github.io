import { Pipe, PipeTransform } from '@angular/core';
import { Cashback } from './models/cashback';

@Pipe({
  name: 'toHourGlass'
})
export class HourGlassPipe implements PipeTransform {

  transform(cashback: Cashback): string {
    let start = cashback.start ? new Date(cashback.start * 1000) : undefined;
    let end = new Date(cashback.end * 1000);
    let now = new Date();
    if (start && start > now) {
      return 'hourglass_full'
    }
    if (end < now) {
      return 'hourglass_empty'
    }
    let limit = new Date(now);
    limit.setDate(limit.getDate() + 7);
    if (end < limit) {
      return 'hourglass_bottom';
    }
    return 'hourglass_top';
  }

}