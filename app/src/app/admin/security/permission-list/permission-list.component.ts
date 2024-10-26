import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, Injectable} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';

import { SecurityService }  from '../security.service';
import { ToastService } from '../../../shared/toast.service';
import { ifError } from 'assert';

/**
 * Node for to-do item
 */
export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
  data: any;
  selected: boolean
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
  data: any;
  selected: boolean
}


/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  treedata:any;
  selectedRole: string  = "";
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  get data(): TodoItemNode[] { return this.dataChange.value; }

  constructor(private securityService: SecurityService) {
    // this.initialize();
    this.getData(null);
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    const data = this.buildFileTree(this.treedata, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  getData(role:any) {
    this.selectedRole = role || "";
    this.securityService.getScreenList(role)
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
  buildFileTree(obj: Array<any>, level: number): TodoItemNode[] {

      let _obj =  obj.reduce<TodoItemNode[]>((accumulator, item) => {
      const node = new TodoItemNode();
      node.item = item['title'];
      node.data = {
        'id': item.id,
        'name': item.name,
        'role': this.selectedRole,
        'plist': item.plist || "",
        'resourceid': item.resourceid,
        'selected': item['selected']
      }
      if(item['children']) {
        node.children = this.buildFileTree(item['children'], level + 1);
      }
      return accumulator.concat(node);
    }, []);
    return _obj;
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
  selector: 'app-security-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['permission-list.component.css'],
  providers: [ChecklistDatabase]
})
export class PermissionListComponent {
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

  constructor(private _database: ChecklistDatabase, private securityService: SecurityService, private toast: ToastService) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    _database.dataChange.subscribe(data => {
      this.dataSource.data = data;

      let _treeData = this.treeControl.dataNodes;
      
      for(let i in _treeData) {
        if(_treeData[i].selected) {
          this.checklistSelection.select(_treeData[i]);
        }
      }
      
    });
  }

  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

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
    flatNode.data = node.data;
    flatNode.selected = node.data['selected'] || false;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);

    if(descendants.length == 0 && !node.data.role) {
      return false;
    }
    const descAllSelected = descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    }
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

    let _selected = this.checklistSelection.isSelected(node);
    let  _descendants = this.treeControl.getDescendants(node);
    for(let i in _descendants) {
      _descendants[i].selected = _selected;
    }

    node.selected = _selected;
    this.savePermission(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
    let _parent = this.getParentNode(node), _selected = this.checklistSelection.isSelected(node);
    node.selected = _selected;

    _parent.selected = _selected;
    
    this.savePermission(_parent);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
      
    }
  }

  savePermission(node: TodoItemFlatNode) {
    let role = node.data['role'];
    if(!role) {
      return;
    }
    let _allData = this.treeControl.dataNodes;

    let _treeData = {
      role: role.role,
      data: {}
    };
    for(let i in _allData) {
      let obj = {};
      if(_allData[i]['level'] == 0) {
        obj['screen'] = _allData[i].item;
        obj['screen'] = _allData[i].item;
        obj['isresource'] = false;
        obj['id'] = _allData[i]['data'].id;
        obj['plist'] = _allData[i]['data'].plist||"";
        obj['selected'] = _allData[i].selected;
        let data = {};
        const descendants = this.treeControl.getDescendants(_allData[i]);
        for(let i in descendants) {
          data[descendants[i].data['id']] = {
            id: descendants[i].data['id'],
            name: descendants[i].data['name'],
            resourceid: descendants[i].data['resourceid'] || "",
            selected: descendants[i].selected,
            isresource: true
          }
        }
        obj['resources'] = data;
        _treeData.data[obj['id']] = obj;
      }
    }
    
    this.securityService.grantPermission(_treeData)
    .subscribe(resp => {
      if(resp['Success'] === true) {
        this.toast.success("Cập nhật thành công.", "Thành Công");
      } else {
        this.toast.error("Cập nhật thất bại.", "Lỗi");
      }

    });

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

  /** Select the category so we can insert the new item. */
  addNewItem(node: TodoItemFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    this._database.insertItem(parentNode!, '');
    this.treeControl.expand(node);
  }

  /** Save the node to database */
  saveNode(node: TodoItemFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    this._database.updateItem(nestedNode!, itemValue);
  }
}
