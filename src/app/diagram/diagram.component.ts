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
    $(go.Shape,
      { fill: "white" },
      new go.Binding("fill", "color"),
      new go.Binding("figure","fig"),
      { portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer" }),
    $(go.TextBlock, { margin: 15 },
      new go.Binding("text", "text"))
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
      new go.Binding("figure","fig"),
    $(go.TextBlock,
      new go.Binding("text", "color"))
  );

// the list of data to show in the Palette
myPalette.model.nodeDataArray = [
  { key: "C", color: "green", "fig": "Square", "text": "Alpha", group: "Alpha", isGroup: true },
  { key: "LC", color: "lightcyan", "fig": "Circle", "text": "OOO"  },
  { key: "A", color: "aquamarine", "fig": "Circle",  "text": "OOO" },
  { key: "T", color: "turquoise", "fig": "Circle",  "text": "OOO" },
  { key: "PB", color: "powderblue", "fig": "Circle",  "text": "OOO" },
  { key: "LB", color: "lightblue", "fig": "Circle", "text": "OOO" },
  { key: "LSB", color: "lightskyblue", "fig": "Circle", "text": "OOO" },
  { key: "DSB", color: "deepskyblue", "fig": "Circle",  "text": "OOO" }
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
      // alert('sdf')
    });
  }

}