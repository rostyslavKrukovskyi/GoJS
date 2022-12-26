import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as go from 'gojs';

const $ = go.GraphObject.make;

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.sass']
})
export class DiagramComponent {

  public diagram: go.Diagram = new go.Diagram;
  public myPalette: go.Palette = new go.Palette;


  @Input()
  public model!: go.Model;

  @Output()
  public nodeClicked = new EventEmitter();


  constructor() {
    // this.diagram = null;
  }

  public ngAfterViewInit() {

    this.myPalette = $(go.Palette, "myPaletteDiv");

    this.myPalette.nodeTemplate =
        $(go.Node, "Horizontal",
        { locationObjectName: "TB", locationSpot: go.Spot.Center },
        $(go.Shape,
          { width: 50, height: 50, fill: "white" },
          new go.Binding("fill", "color")),
        $(go.TextBlock, { name: "TB" },
          new go.Binding("text", "color"))
      );
    
    // the list of data to show in the Palette
  this.myPalette.model.nodeDataArray = [
    { key: "C", color: "cyan" },
    { key: "LC", color: "lightcyan" },
    { key: "A", color: "aquamarine" },
    { key: "T", color: "turquoise" }
  ];

    this.diagram = $(go.Diagram, 'myDiagramDiv',
      {
        layout:
          $(go.TreeLayout,
            {
              isOngoing: true,
              // treeStyle: go.TreeLayout.StyleLastParents,
              arrangement: go.TreeLayout.ArrangementHorizontal,
              // properties for most of the tree:
              angle: 90,
              layerSpacing: 35,
              // properties for the "last parents":
              alternateAngle: 90,
              alternateLayerSpacing: 35,
              alternateAlignment: go.TreeLayout.AlignmentBus,
              alternateNodeSpacing: 20
            }),
        'undoManager.isEnabled': true
      }
    );

    this.diagram.linkTemplate =
      $(go.Link,
        { curve: go.Link.Bezier },  // Bezier curve
        $(go.Shape),
        $(go.Shape, { toArrow: "Standard" })
      );

    // define the Node template
    this.diagram.nodeTemplate =
      $(go.Node, 'ForceDirectedLayout',
        $(go.Shape, 'RoundedRectangle', { stroke: null },
          new go.Binding('fill', 'color')
        ),
        $(go.TextBlock, { margin: 8 },
          new go.Binding('text', 'key'))
      );
     

    this.diagram.model = this.model;

    // when the selection changes, emit event to app-component updating the selected node
    this.diagram.addDiagramListener('ChangedSelection', (e) => {
      const node = this.diagram.selection.first();
      this.nodeClicked.emit(node);
    });
  }

}