import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as go from 'gojs';
import { Inspector } from './inspector/inspector.js';

const $ = go.GraphObject.make;

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.sass'],
})
export class DiagramComponent {
  public myDiagram: go.Diagram = new go.Diagram();
  public myPalette: go.Palette = new go.Palette();

  @Input()
  public model!: go.Model;

  @Output()
  public nodeClicked = new EventEmitter();

  public ngAfterViewInit() {
    this.myDiagram = $(
      go.Diagram,
      'myDiagramDiv', // must name or refer to the DIV HTML element
      {
        'draggingTool.dragsLink': true,
        'draggingTool.isGridSnapEnabled': true,
        'linkingTool.isUnconnectedLinkValid': true,
        'linkingTool.portGravity': 20,
        'relinkingTool.isUnconnectedLinkValid': true,
        'relinkingTool.portGravity': 20,
        'relinkingTool.fromHandleArchetype': $(go.Shape, 'Diamond', {
          segmentIndex: 0,
          cursor: 'pointer',
          desiredSize: new go.Size(8, 8),
          fill: 'tomato',
          stroke: 'darkred',
        }),
        'relinkingTool.toHandleArchetype': $(go.Shape, 'Diamond', {
          segmentIndex: -1,
          cursor: 'pointer',
          desiredSize: new go.Size(8, 8),
          fill: 'darkred',
          stroke: 'tomato',
        }),
        'linkReshapingTool.handleArchetype': $(go.Shape, 'Diamond', {
          desiredSize: new go.Size(7, 7),
          fill: 'lightblue',
          stroke: 'deepskyblue',
        }),
        'rotatingTool.handleAngle': 270,
        'rotatingTool.handleDistance': 30,
        'rotatingTool.snapAngleMultiple': 15,
        'rotatingTool.snapAngleEpsilon': 15,
        'undoManager.isEnabled': true,
      }
    );

    this.myDiagram.grid = $(
      go.Panel,
      'Grid',
      { gridCellSize: new go.Size(100, 100) },
      $(go.Shape, 'BarV', { fill: 'white', width: 50 }),
      $(go.Shape, 'BarH', { fill: 'white', height: 50 })
    );

    this.myDiagram.toolManager.draggingTool.isGridSnapEnabled = true;

    // when the document is modified, enable the "Save" button
    this.myDiagram.addDiagramListener('Modified', (e) => {});

    var nodeSelectionAdornmentTemplate = $(
      go.Adornment,
      'Auto',
      $(go.Shape, {
        fill: null,
        stroke: 'deepskyblue',
        strokeWidth: 1.5,
        strokeDashArray: [4, 2],
      }),
      $(go.Placeholder)
    );

    var nodeResizeAdornmentTemplate = $(
      go.Adornment,
      'Spot',
      { locationSpot: go.Spot.Right },
      $(go.Placeholder),
      $(go.Shape, {
        alignment: go.Spot.TopLeft,
        cursor: 'nw-resize',
        desiredSize: new go.Size(6, 6),
        fill: 'lightblue',
        stroke: 'deepskyblue',
      }),
      $(go.Shape, {
        alignment: go.Spot.Top,
        cursor: 'n-resize',
        desiredSize: new go.Size(6, 6),
        fill: 'lightblue',
        stroke: 'deepskyblue',
      }),
      $(go.Shape, {
        alignment: go.Spot.TopRight,
        cursor: 'ne-resize',
        desiredSize: new go.Size(6, 6),
        fill: 'lightblue',
        stroke: 'deepskyblue',
      }),

      $(go.Shape, {
        alignment: go.Spot.Left,
        cursor: 'w-resize',
        desiredSize: new go.Size(6, 6),
        fill: 'lightblue',
        stroke: 'deepskyblue',
      }),
      $(go.Shape, {
        alignment: go.Spot.Right,
        cursor: 'e-resize',
        desiredSize: new go.Size(6, 6),
        fill: 'lightblue',
        stroke: 'deepskyblue',
      }),

      $(go.Shape, {
        alignment: go.Spot.BottomLeft,
        cursor: 'se-resize',
        desiredSize: new go.Size(6, 6),
        fill: 'lightblue',
        stroke: 'deepskyblue',
      }),
      $(go.Shape, {
        alignment: go.Spot.Bottom,
        cursor: 's-resize',
        desiredSize: new go.Size(6, 6),
        fill: 'lightblue',
        stroke: 'deepskyblue',
      }),
      $(go.Shape, {
        alignment: go.Spot.BottomRight,
        cursor: 'sw-resize',
        desiredSize: new go.Size(6, 6),
        fill: 'lightblue',
        stroke: 'deepskyblue',
      })
    );

    var nodeRotateAdornmentTemplate = $(
      go.Adornment,
      { locationSpot: go.Spot.Center, locationObjectName: 'ELLIPSE' },
      $(go.Shape, 'Ellipse', {
        name: 'ELLIPSE',
        cursor: 'pointer',
        desiredSize: new go.Size(7, 7),
        fill: 'lightblue',
        stroke: 'deepskyblue',
      }),
      $(go.Shape, {
        geometryString: 'M3.5 7 L3.5 30',
        isGeometryPositioned: true,
        stroke: 'deepskyblue',
        strokeWidth: 1.5,
        strokeDashArray: [4, 2],
      })
    );

    this.myDiagram.nodeTemplate = $(
      go.Node,
      'Spot',
      { locationSpot: go.Spot.Center },
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      {
        selectable: true,
        selectionAdornmentTemplate: nodeSelectionAdornmentTemplate,
      },
      {
        // define a context menu for each node
        contextMenu: $(
          'ContextMenu',
          $(
            'ContextMenuButton',
            {
              'ButtonBorder.fill': 'yellow',
              _buttonFillOver: 'cyan',
              _buttonFillPressed: 'lime',
              height: 100,
            },
            $(go.TextBlock, 'Shift Left'),
            {
              click: (e, obj) => {
                this.shiftNode(obj, -20);
              },
            }
          ),
          $(
            'ContextMenuButton',
            {
              'ButtonBorder.fill': 'yellow',
              _buttonFillOver: 'cyan',
              _buttonFillPressed: 'lime',
            },
            $(go.TextBlock, 'Shift Right'),
            {
              click: (e, obj) => {
                this.shiftNode(obj, +20);
              },
            }
          ),
          $(
            'ContextMenuButton',
            { isEnabled: false },
            $(go.TextBlock, 'Shift Right', { stroke: 'gray' }),
            {
              click: function (e, obj) {
                alert("won't be alerted");
              },
            }
          )
        ), // end Adornment
      },

      {
        resizable: true,
        resizeObjectName: 'PANEL',
        resizeAdornmentTemplate: nodeResizeAdornmentTemplate,
      },
      { rotatable: true, rotateAdornmentTemplate: nodeRotateAdornmentTemplate },
      new go.Binding('angle').makeTwoWay(),
      // the main object is a Panel that surrounds a TextBlock with a Shape
      $(
        go.Panel,
        'Auto',
        { name: 'PANEL' },
        new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(
          go.Size.stringify
        ),
        $(
          go.Shape,
          'Rectangle', // default figure
          {
            portId: '', // the default port: if no spot on link data, use closest side
            fromLinkable: true,
            toLinkable: true,
            cursor: 'pointer',
            fill: 'white', // default color
            strokeWidth: 2,
          },
          new go.Binding('figure'),
          new go.Binding('fill')
        ),
        $(
          go.TextBlock,
          {
            font: 'bold 11pt Helvetica, Arial, sans-serif',
            margin: 8,
            maxSize: new go.Size(160, NaN),
            wrap: go.TextBlock.WrapFit,
            editable: true,
          },
          new go.Binding('text').makeTwoWay()
        )
      ),
      // four small named ports, one on each side:
      this.makePort('T', go.Spot.Top, false, true),
      this.makePort('L', go.Spot.Left, true, true),
      this.makePort('R', go.Spot.Right, true, true),
      this.makePort('B', go.Spot.Bottom, true, false),
      {
        // handle mouse enter/leave events to show/hide the ports
        mouseEnter: (e, node) => this.showSmallPorts(node, true),
        mouseLeave: (e, node) => this.showSmallPorts(node, false),
      }
    );

    var linkSelectionAdornmentTemplate = $(
      go.Adornment,
      'Link',
      $(
        go.Shape,
        // isPanelMain declares that this Shape shares the Link.geometry
        { isPanelMain: true, fill: null, stroke: 'deepskyblue', strokeWidth: 0 }
      ) // use selection object's strokeWidth
    );

    this.myDiagram.linkTemplate = $(
      go.Link, // the whole link panel
      {
        selectable: true,
        selectionAdornmentTemplate: linkSelectionAdornmentTemplate,
      },
      { relinkableFrom: true, relinkableTo: true, reshapable: true },
      {
        routing: go.Link.AvoidsNodes,
        curve: go.Link.JumpOver,
        corner: 10,
        toShortLength: 4,
      },
      new go.Binding('points').makeTwoWay(),
      $(
        go.Shape, // the link path shape
        { isPanelMain: true, strokeWidth: 2 }
      ),
      $(
        go.Shape, // the arrowhead
        { toArrow: 'Standard', stroke: null }
      )
      // $(
      //   go.Panel,
      //   'Auto',
      //   new go.Binding('visible', 'isSelected').ofObject(),
      //   $(
      //     go.Shape,
      //     'RoundedRectangle', // the link shape
      //     { fill: '#F8F8F8', stroke: null }
      //   )
      // $(
      //   go.TextBlock,
      //   // 'transition',
      //   {
      //     textAlign: 'center',
      //     background: 'white',
      //     font: '10pt helvetica, arial, sans-serif',
      //     stroke: 'black',
      //     margin: 2,
      //     minSize: new go.Size(10, 10),
      //     editable: true,
      //     alignmentFocus: new go.Spot(1, 0.5, 3, 0),
      //   },
      //   new go.Binding('text').makeTwoWay()
      // )
      // )
    );

    // initialize the Palette that is on the left side of the page
    this.myPalette = $(
      go.Palette,
      'myPaletteDiv', // must name or refer to the DIV HTML element
      {
        maxSelectionCount: 1,
        nodeTemplateMap: this.myDiagram.nodeTemplateMap, // share the templates used by myDiagram
        // simplify the link template, just in this Palette
        linkTemplate: $(
          go.Link,
          {
            // because the GridLayout.alignment is Location and the nodes have locationSpot == Spot.Center,
            // to line up the Link in the same manner we have to pretend the Link has the same location spot
            locationSpot: go.Spot.Center,
            selectionAdornmentTemplate: $(
              go.Adornment,
              'Link',
              { locationSpot: go.Spot.Center },
              $(go.Shape, {
                isPanelMain: true,
                fill: null,
                stroke: 'deepskyblue',
                strokeWidth: 0,
              }),
              $(
                go.Shape, // the arrowhead
                { toArrow: 'Standard', stroke: null }
              )
            ),
          },
          {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpOver,
            corner: 5,
            toShortLength: 4,
          },
          new go.Binding('points'),
          $(
            go.Shape, // the link path shape
            { isPanelMain: true, strokeWidth: 2 }
          ),
          $(
            go.Shape, // the arrowhead
            { toArrow: 'Standard', stroke: null }
          )
        ),
        model: new go.GraphLinksModel([
          // specify the contents of the Palette
          {
            text: 'Checkout',
            figure: 'RoundedRectangle',
            fill: 'yellow',
            size: '100 80',
            comment: '...some info',
          },
          {
            text: 'Code Scan',
            figure: 'RoundedRectangle',
            fill: 'yellow',
            size: '100 80',
            comment: '...some info',
          },
          {
            text: 'Build',
            figure: 'RoundedRectangle',
            fill: 'yellow',
            size: '100 80',
            comment: '...some info',
          },
          {
            text: 'Deploy',
            figure: 'RoundedRectangle',
            fill: 'yellow',
            size: '100 80',
            comment: '',
          },
          {
            text: 'X',
            fontSize: 30,
            figure: 'Diamond',
            fill: 'orange',
            comment: '',
          },
          {
            text: '',
            figure: 'Ellipse',
            size: '75 75',
            fill: '#8BF26B',
            comment: '',
          },
          {
            text: '',
            figure: 'Ellipse',
            size: '75 75',
            fill: 'orange',
            comment: '',
          },
        ]),
      }
    );

    this.myDiagram.addDiagramListener('ObjectSingleClicked', (e) => {
      var part = e.subject.part;
      if (!(part instanceof go.Link))
        console.log('Clicked on ', part.data.rostik);
    });

    const inspector1 = new Inspector('myInspectorDiv', this.myDiagram, {
      // allows for multiple nodes to be inspected at once
      // multipleSelection: true,
      // max number of node properties will be shown when multiple selection is true
      // showLimit: 4,
      // when multipleSelection is true, when showUnionProperties is true it takes the union of properties
      // otherwise it takes the intersection of properties
      showUnionProperties: true,
      // uncomment this line to only inspect the named properties below instead of all properties on each object:
      // includesOwnProperties: false,
      properties: {
        key: { show: false },
        pos: { show: false },
        loc: { show: false },
        // text: { show: Inspector.showIfNode },
        fill: { show: false },
        points: { show: false },
        from: { show: false },
        to: { show: false },
      },
    });

    inspector1.inspectObject(this.myDiagram.model.modelData);
  }

  // Define a function for creating a "port" that is normally transparent.
  // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
  // and where the port is positioned on the node, and the boolean "output" and "input" arguments
  // control whether the user can draw links from or to the port.
  makePort(name: any, spot: any, output: any, input: any) {
    // the port is basically just a small transparent circle
    return $(go.Shape, 'Circle', {
      fill: null, // not seen, by default; set to a translucent gray by showSmallPorts, defined below
      stroke: null,
      desiredSize: new go.Size(12, 12),
      alignment: spot, // align the port on the main Shape
      alignmentFocus: spot, // just inside the Shape
      portId: name, // declare this object to be a "port"
      fromSpot: spot,
      toSpot: spot, // declare where links may connect at this port
      fromLinkable: output,
      toLinkable: input, // declare whether the user may draw links to/from here
      cursor: 'hand', // show a different cursor to indicate potential link point
    });
  }

  // this is a shared context menu button click event handler, just for demonstration
  cmCommand(e: any, obj: any) {
    var node = obj.part.adornedPart; // the Node with the context menu
    var buttontext = obj.elt(1); // the TextBlock
    alert(buttontext.text + ' command on ' + node.data.key);
  }

  showSmallPorts(node: any, show: any) {
    node.ports.each((port: any) => {
      if (port.portId !== '') {
        // don't change the default port, which is the big shape
        port.fill = show ? 'rgba(0,0,0,.3)' : null;
      }
    });
  }

  linkSelectionAdornmentTemplate = $(
    go.Adornment,
    'Link',
    $(
      go.Shape,
      // isPanelMain declares that this Shape shares the Link.geometry
      { isPanelMain: true, fill: null, stroke: 'deepskyblue', strokeWidth: 0 }
    ) // use selection object's strokeWidth
  );

  save() {
    this.saveDiagramProperties(); // do this first, before writing to JSON
    console.log(
      this.myDiagram.model.toJson(),
      ' this.myDiagram.model.toJson();'
    );
    this.myDiagram.model.toJson();
    this.myDiagram.isModified = false;
  }

  shiftNode(obj: any, dist: any) {
    var adorn = obj.part;
    var node = adorn.adornedPart;
    node.diagram.commit(function (d: any) {
      var pos = node.location.copy();
      pos.x += dist;
      node.location = pos;
    }, 'Shift');
  }

  load() {
    // this.myDiagram.model = go.Model.fromJson(
    //   document.getElementById('mySavedModel').value
    // );
    this.loadDiagramProperties(); // do this after the Model.modelData has been brought into memory
  }

  saveDiagramProperties() {
    this.myDiagram.model.modelData['position'] = go.Point.stringify(
      this.myDiagram.position
    );
  }

  loadDiagramProperties(e?: any) {
    // set Diagram.initialPosition, not Diagram.position, to handle initialization side-effects
    var pos = this.myDiagram.model.modelData['position'];
    if (pos) this.myDiagram.initialPosition = go.Point.parse(pos);
  }
}
