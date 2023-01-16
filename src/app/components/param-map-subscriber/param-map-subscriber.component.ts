import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, UrlSegment } from '@angular/router';

@Component({
  template: ''
})
export abstract class ParamMapSubscriberComponent implements OnInit {

  info: string | null = null;
  error: string | null = null;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.queryParamMap
      .subscribe((paramMap: ParamMap) => {
        this.handleParamMap(paramMap);
      });
  }

  protected handleParamMap(paramMap: ParamMap): void {
    this.info = paramMap.get('info');
    this.error = paramMap.get('error');
  }

  protected setInfo(info: string | null): void {
    this.info = info;
    this.error = null;
  }

  protected setError(error: string | null): void {
    this.info = null;
    this.error = error;
  }

}
