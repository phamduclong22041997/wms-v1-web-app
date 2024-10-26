import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, Injectable} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';

import {MatDialog} from '@angular/material/dialog';
import { AccessControlNodeComponent } from './access-control-node/access-control-node.component';

import { SecurityService } from './security.service';
/**
 * Node for to-do item
 */
export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
  data: any;
  action: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
}

export class NodeItem {
  data: any;
  action: string;
}

@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  treedata:any;

  get data(): TodoItemNode[] { return this.dataChange.value; }

  constructor(private securityService: SecurityService) {
    // this.initialize();
    this.getData();
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    const data = this.buildFileTree(this.treedata, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  getData() {
    this.securityService.getAccessControlList()
    .subscribe((response:any)=>{
      this.treedata  = {};
      if(response.Success) {
        this.treedata = response.Data.rows || {};
      }
      this.initialize();
    })
  }



  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: {[key: string]: any}, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key]||{};
      const node = new TodoItemNode();
      node.item = value['title'] || value['name'];
      node.children = null;

      if(value != null && value.name) {
        if(value.children) {
          node.children = this.buildFileTree(value.children, level + 1);
        } else {
          node.item = value['title'] || value['name'];
        }
        node.data = {
          helplink: value.helplink || "",
          icon: value.icon || "",
          id: value.id || "",
          ismenu: value.ismenu || "",
          level: value.level || "",
          name: value.name || "",
          path: value.path || "",
          position: value.position || "",
          resourceid: value.resourceid || "",
          title: value.title || "",
          isview: value.isview || false
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  /** Add an item to to-do list */
  insertItem(parent: TodoItemNode, name: string) {
    if (parent.children) {
      parent.children.push({item: name} as TodoItemNode);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: TodoItemNode, name: string) {
    node.item = name;
    this.dataChange.next(this.data);
  }
}

/**
 * @title Tree with checkboxes
 */
@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css'],
  providers: [ChecklistDatabase]
})
export class SecurityComponent {

  selectedNode: TodoItemFlatNode
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  constructor(private _database: ChecklistDatabase, public dialog: MatDialog, private se: SecurityService) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    _database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  isMenu = (_: number, _nodeData: TodoItemFlatNode) => !_nodeData.expandable;

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
        ? existingNode
        : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  selectNode(node: TodoItemFlatNode) {
    this.selectedNode = node;
  }
  /** Save the node to database */
  saveNode(node: TodoItemFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    this._database.updateItem(nestedNode!, itemValue);
  }

  createNew() {
    const dialogRef = this.dialog.open(AccessControlNodeComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result === true) {
       this._database.getData();
      }
    });
  }
  createNewChild() {
    const parentNode = this.flatNodeMap.get(this.selectedNode);
    let _nodeData = new NodeItem();
    parentNode['action'] = "ADD";
    _nodeData['data'] = parentNode;

    const dialogRef = this.dialog.open(AccessControlNodeComponent, _nodeData);

    dialogRef.afterClosed().subscribe(result => {
      if(result === true) {
        this._database.getData();
      }
    });
  }

  editNode() {
    const parentNode = this.flatNodeMap.get(this.selectedNode);

    let _nodeData = new NodeItem();
    parentNode['action'] = "EDIT";
    _nodeData['data'] = parentNode;

    const dialogRef = this.dialog.open(AccessControlNodeComponent, _nodeData);

    dialogRef.afterClosed().subscribe(result => {
      if(result === true) {
        this._database.getData();
      }
    });
  }
  removeNode() {
    const parentNode = this.flatNodeMap.get(this.selectedNode);
    let _nodeData = new NodeItem();
    parentNode['action'] = "DELETE";
    _nodeData['data'] = parentNode;
    const dialogRef = this.dialog.open(AccessControlNodeComponent, _nodeData);

    dialogRef.afterClosed().subscribe(result => {
      if(result === true) {
        this._database.getData();
      }
    });
  }
  moveNode() {
    const parentNode = this.flatNodeMap.get(this.selectedNode);
    let _nodeData = new NodeItem();
    parentNode['action'] = "MOVE";
    _nodeData['data'] = parentNode;
    const dialogRef = this.dialog.open(AccessControlNodeComponent, _nodeData);

    dialogRef.afterClosed().subscribe(result => {
      if(result === true) {
        this._database.getData();
      }
    });
  }

  grantPermission() {

  }

}

