import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StaticComponent } from '../static/static.component';

@Component({
  selector: 'app-imprint',
  templateUrl: '../static/static.component.html',
  styleUrls: ['../static/static.component.scss']
})
export class ImprintComponent extends StaticComponent {

  constructor(translate: TranslateService) {
    super(translate);
  }

  getPageName(): string {
    return 'imprint';
  }

}
