import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

interface Block {
  title: string;
  elems: Elem[];
}

interface Elem {
  template: TemplateRef<any>;
  key?: string;
}

@Component({
  template: ''
})
export abstract class StaticComponent implements OnInit {
  @ViewChild('h4Template', { read: TemplateRef, static: true }) h4Template!: TemplateRef<any>;
  @ViewChild('h5Template', { read: TemplateRef, static: true }) h5Template!: TemplateRef<any>;
  @ViewChild('textTemplate', { read: TemplateRef, static: true }) textTemplate!: TemplateRef<any>;
  @ViewChild('interpolTextTemplate', { read: TemplateRef, static: true }) interpolTextTemplate!: TemplateRef<any>;
  @ViewChild('coffeeTemplate', { read: TemplateRef, static: true }) coffeeTemplate!: TemplateRef<any>;
  @ViewChild('cookiesTemplate', { read: TemplateRef, static: true }) cookiesTemplate!: TemplateRef<any>;

  url: string = environment.url;
  email: string = environment.email;
  name: string = environment.name;
  coffee: string = environment.coffee;
  prefix: string;
  blocks: Block[] = [];

  constructor(private translate: TranslateService) {
    this.prefix = this.getPageName();
  }

  ngOnInit(): void {
    const blocksKey = 'blocks';
    const titleKey = 'title';
    const paragraphsKey = 'paragraphs';
    const coffeeKey = 'coffee';
    const cookiesKey = 'cookies';
    this.translate
      .get(this.prefix + '.' + blocksKey)
      .subscribe(data => {
        let blocks: Block[] = [];
        for (let k of Object.keys(data)) {
          let block = data[k];
          let elems: Elem[] = [];
          if (paragraphsKey in block) {
            for (let p of Object.keys(block[paragraphsKey])) {
              if (p == coffeeKey) {
                elems.push({ template: this.coffeeTemplate });
              } else if (p == cookiesKey) {
                elems.push({ template: this.cookiesTemplate });
              } else {
                let par = block[paragraphsKey][p];
                elems.push({ key: (this.prefix + '.' + blocksKey + '.' + k + '.' + paragraphsKey + '.' + p), template: par.includes('{{') ? this.interpolTextTemplate : this.textTemplate });
              }
            }
          }
          blocks.push({ title: (this.prefix + '.' + blocksKey + '.' + k + '.' + titleKey), elems: elems });
        }
        this.blocks = blocks;
      });
  }

  abstract getPageName(): string;

}
