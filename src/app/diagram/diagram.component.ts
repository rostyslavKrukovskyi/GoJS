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

    this.diagram = $(go.Diagram, 'myDiagramDiv',
      // {
      //   layout:
      //     $(go.TreeLayout,
      //       {
      //         isOngoing: true,
      //         treeStyle: go.TreeLayout.StyleLastParents,
      //         arrangement: go.TreeLayout.ArrangementHorizontal,
      //         // properties for most of the tree:
      //         angle: 90,
      //         layerSpacing: 35,
      //         // properties for the "last parents":
      //         alternateAngle: 90,
      //         alternateLayerSpacing: 35,
      //         alternateAlignment: go.TreeLayout.AlignmentBus,
      //         alternateNodeSpacing: 20
      //       }),
      //   'undoManager.isEnabled': true
      // }
    );

  this.diagram.nodeTemplate =
  $(go.Node, "Auto",
    $(go.Shape, "Circle",
      { fill: "white" },
      new go.Binding("fill", "color"),
      { portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer" }),
    $(go.TextBlock, { margin: 5 },
      new go.Binding("text", "key"))
  );

this.diagram.undoManager.isEnabled = true;

// create the Palette
var myPalette =
  $(go.Palette, "myPaletteDiv");

// the Palette's node template is different from the main Diagram's
myPalette.nodeTemplate =
  $(go.Node, "Horizontal",
    $(go.Shape,
      { width: 34, height: 34, fill: "white" },
      new go.Binding("fill", "color")),
    $(go.TextBlock,
      new go.Binding("text", "color"))
  );

// the list of data to show in the Palette
myPalette.model.nodeDataArray = [
  { key: "C", color: "cyan", fig: 'Circle' },
  { key: "LC", color: "lightcyan" },
  { key: "A", color: "aquamarine" },
  { key: "T", color: "turquoise" },
  { key: "PB", color: "powderblue" },
  { key: "LB", color: "lightblue" },
  { key: "LSB", color: "lightskyblue" },
  { key: "DSB", color: "deepskyblue" }
];


    this.diagram.linkTemplate =
      $(go.Link,
        { curve: go.Link.Bezier },  // Bezier curve
        $(go.Shape),
        $(go.Shape, { toArrow: "Standard" })
      );

    myPalette.nodeTemplateMap = this.diagram.nodeTemplateMap;

    this.diagram.model = this.model;

    // when the selection changes, emit event to app-component updating the selected node
    this.diagram.addDiagramListener('ChangedSelection', (e) => {
      const node = this.diagram.selection.first();
      this.nodeClicked.emit(node);
    });
  }

}