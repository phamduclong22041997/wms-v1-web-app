import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-page-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class PageHeaderComponent implements OnInit {
  @Input() title:string;
  pageInfo:any;
  helpLink:any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.helpLink = true;
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .pipe(map(() => this.activatedRoute))
      .pipe(filter(route => route.outlet === 'primary'))
      .subscribe(event => {
        this.helpLink = true;
        if(event['snapshot']['data'] && event['snapshot']['data']['helplink']) {
          this.helpLink = event['snapshot']['data']['helplink'];
        }
      });
  }
  ngOnInit() {
    
  }
}
