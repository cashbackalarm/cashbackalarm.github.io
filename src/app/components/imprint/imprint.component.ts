import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-imprint',
  templateUrl: './imprint.component.html'
})
export class ImprintComponent {

  url: string = environment.url;
  email: string = environment.email;

  constructor() {
  }

}
