import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderService } from './services/loader.service';
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class AppLoaderComponent {
  color = '#d0333a';
  mode = 'indeterminate';
  value = 10;
  strokeWidth = 2;
  diameter = 50;
  isLoading: Subject<boolean> = this.loaderService.isLoading;
  constructor(private loaderService: LoaderService){}
}