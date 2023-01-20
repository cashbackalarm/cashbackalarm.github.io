import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

interface Block {
  key: string;
  parKeys: string[];
}

@Component({
  template: ''
})
export abstract class StaticComponent {

  url: string = environment.url;
  email: string = environment.email;
  name: string = environment.name;
  coffee: string = environment.coffee;
  prefix: string;
  blocks: Block[] = [];

  constructor(private translate: TranslateService) {
    this.prefix = this.getPageName();
    const blocksKey = 'blocks';
    const paragraphsKey = 'paragraphs';
    this.translate
      .get(this.prefix + '.' + blocksKey)
      .subscribe(data => {
        let blocks: Block[] = [];
        for (let blockKey of Object.keys(data)) {
          let block = data[blockKey];
          blocks.push({ key: blockKey, parKeys: (paragraphsKey in block? Object.keys(block[paragraphsKey]) : []) });
        }
        this.blocks = blocks;
      });
  }

  abstract getPageName(): string;

}
