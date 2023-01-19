import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StaticComponent } from '../static/static.component';

@Component({
  selector: 'app-termsofuse',
  templateUrl: '../static/static.component.html',
  styleUrls: ['../static/static.component.scss']
})
export class TermsOfUseComponent extends StaticComponent {

  constructor(translate: TranslateService) {
    super(translate);
  }

  getPageName(): string {
    return 'termsofuse';
  }

}
