import { Component } from '@angular/core';
import * as go from 'gojs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  public selectedNode = null;

  public model: go.TreeModel = new go.TreeModel(
  );

  public setSelectedNode(node: any) {
    this.selectedNode = node;
  }

}