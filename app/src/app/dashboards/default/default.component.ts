import { Component, OnInit } from '@angular/core';

import {PageComponent} from './../../components/page/page.component';

/** Builds and returns a new User. */
function createNewUser(id: number):any {
  return {
    id: 1,
    name: "hello",
    progress: "",
    color: "red"
  };
}
@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }

}
