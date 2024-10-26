/**
 * Copyright (c) 2019 OVTeam
 * Modified by: Huy Nghiem
 * Modified date: 2020/10
 */

const STATUS_BORDER_COLOR = {
  'New': '#d0333a',
  'Assigment': '#E886FF',
  'Picking': '#FFEF72',
  'WaitForConfirm': '#62B1FF',
  'SOPool_Picking': '#FFEF72',
  'Picked': '#A3D8FF',
  'Pending': '#FFF184',
  'InSoPool': '#A3D8FF',
  'Updating': '#FFF184',
  'CreatedPickList': '#71C3FF',
  'Completed': '#00E334',
  'Processed': '#D36FFF',
  'Transportation': '#ABF285',
  'Updated': '#D36FFF',
  'Waiting': '#FFF184',
  'Error': '#f44336'
};

const STATUS_BORDER_CLAIM = {
  'CLAIM_GR_SUCCESS': '#00E334',
  'CLAIM_RETURN_ERROR': '#d0333a',
  'CLAIM_GR_ERROR': '#f44336',
};

const STATUS_BORDER_MASANSTORE = {
  'ACTIVE': '#00E334',
  'ACTIVED': '#00E334',
  'INACTIVE': '#f44336',
  'New':  '#E0FFFF',
  'Canceled':  '#f44336',
};

const STATUS_BORDER_MDL = {
  'Done': '#00E334',
  'Error': '#f44336',
  'Processing': '#d0333a',
  'NotProcessing': '#FFF184'
};

const STATUS_BORDER_OFFER_TYPE = {
  'UnExpired': 'yellow',
  'Valid': 'green',
  'Expired': 'red',
};

const STATUS_BORDER_STO_FINISH = {
  'New': '#E0FFFF',
  'Finished': '#00E334',
  'Picking': '#d0333a',
  'Picked': '#8A2BE2',
  'Processing': '#d0333a',
  SplittingNew: "#8A2BE2",
  CreatedSplitList: "#8A2BE2",
  SplittingOut: "#00c2ff",
  ScanBarcode: "#d0333a",
  Canceled: "#FF33CC",
  ScanCompleted: "#f3c74c",
  CreatedSO: "#d0333a",
  WaitingForCreateSO: "#f3c74c",
  NotScanFull: "#8A2BE2",
  NotScan: "#FF33CC",
  CompletedOnSystem: "#00E334",
  PickingAfterPacked: "#d0333a",
  PickedAfterPacked: "#d0333a",
  StoringAfterPacked: "#d0333a",
  StoredAfterPacked: "#00E334",
  AssignedPicker:"#7bbd7b",
  AssignedDriver:"#2A9CFF",
  CreatedPO: "#00E334",
  ProcessingSO: "#f3c74c",
  TransportHandon: "#f3c74c",
  ReadyToShip:"#88c476",
  Delivering:"#f7ce06",
  Delivered:"#00E334",
  "ReturnedOnWarehouse":"#FFA500",
  "Delay":"#f3c74c",
  "Error":"#f44336",
  "CreatedTrip":"#f3c74c",
  "OnReturn":"#FFA500",
  "ReNew":"#E0FFFF",
  "ReProcessing": "#f7ce06",
  "Completed": "#00E334",
  "ReCompleted": "#00E334",
  "WaitingConfirm": "#f7ce06",
  "ProcessingConfirm":"#f7ce06",
  "Closed":"#00E334",
  "Normal": "#E0FFFF",
  "Locked": "#fda521",
  "WaitingForLocked": "#f3c74c",
  "WaitingForUnlock": "#f3c74c",
  "Packed":"#f7ce06",
  "DefinedStorageLocation": "#2196f3"
};

const STATUS_BORDER_PKGPACKAGE = {
  'New': '#f44336',
  'Finished': '#00E334',
  'Picking': '#d0333a',
  'Picked': '#8A2BE2',
  'Processing': '#d0333a',
};

const STATUS_BORDER_SCAN_PACKED = {
  'New': '#f44336',
  'Finished': '#00E334',
  'Picking': '#d0333a',
  'Picked': '#8A2BE2',
  'Processing': '#d0333a',
  'Cancel': '#FF33CC'
};

const STATUS_BORDER_STO_PROCESS = {
  'Processed': '#00E334',
  'Processing': '#d0333a',
};

const STATUS_BORDER_STOCK_GOOD_LIMIT = {
  'IN_LIMIT': '#00E334',
  'OVER_LIMIT': '#f44336',
};

const STATUS_BORDER_CONFIRM_PICKING_COLOR = {
  'Completed': '#00E334',
  'PickAgain': '#de8913'
};
const STATUS_PACKAGE_PRODUCT_ITEMS_COLOR = {
  Open: "#fff",
  Closed: "#00E334",
};

const REGION_WAREHOUSE = {
  '11': 'MIENNAM',
  '01': 'MIENNAM',
  '02': 'MIENNAM',
  '03': 'MIENNAM',
  '41': 'MIENTRUNG',
  '04': 'MIENNAM',
  '12': 'MIENBAC',
  '42': 'MIENTRUNG',
  '13': 'MIENBAC',
  '14': 'MIENBAC',
  '21': 'MIENTAY',
};

const PO_STATUS = {
  "New": "New",
  "Canceled": "Canceled",
  "Processing": "Processing",
  "Finished": "Finished",
  "Draft": "Draft",
  "Transforming": "Transforming"
};

const SPLITLIST_STATUS = {
  New: "New",
  Canceled: "Canceled",
  Processing: "Processing",
  Finished: "Finished",
  Draft: "Draft",
  Transforming: "Transforming",
};


const RECEIVING_STATUS = {
  "New": "New",
  "Receiving": "Receiving",
  "Finished": "Finished",
  "Processing": "Processing",
  Canceled:"Canceled"
};

const SO_STATUS = {
  "New": "New",
  "Processing": "Processing",
  "Finished": "Finished",
  "Canceled": "Canceled",
  "Picking": "Picking",
  "Picked": "Picked",
  "Packing": "Packing",
  "Packed": "Packed",
  "AssignedPicker": "AssignedPicker",
  "3PLHandOn": "3PLHandOn",
  "Delivering": "Delivering",
  "Delay": "Delay",
  "Delivered": "Delivered",
  "Returned": "Returned",
  "PickedAfterPacked": "PickedAfterPacked",
  "SO2Store": "SO2Store",
  "CompletedOnSystem": "CompletedOnSystem",
  "PickingAfterPacked": "PickingAfterPacked",
  "StoredAfterPacked": "StoredAfterPacked",
  "DefinedStorageLocation": "DefinedStorageLocation",
  "ReadyToShip": "ReadyToShip",
  "TransportHandon": "TransportHandon",
  "AssignedDriver": "AssignedDriver"
};

const CONFIRM_PICKING_STATUS = {
  "Completed": "Completed",
  "PickAgain": "PickAgain"
}

const SO_CANCELED_STATUS = [
  SO_STATUS.New
  // SO_STATUS.Picked,
  // SO_STATUS.Picking,
  // SO_STATUS.Packed,
  // SO_STATUS.Packing,
  // SO_STATUS.PickedAfterPacked
];

const PO_SOURCE = {
  "API": "1",
  "Web": "2",
  "Import": "3"
}

const PO_CONDITIONTYPE = {
  "New": "1",
  "Quarantine": "2",
  "Damage": "3",
  "Other": "0"
}

const DEVICE_STATUS = {
  "Empty": "Empty",
  "Inputing": "Inputing",
  "Storing": "Storing",
  "WaitingRelease": "WaitingRelease"
};

const DEVICE_TYPE = {
  "Tote": "Tote",
  "Pallet": "Pallet"
};

const BIN_STATUS = {
  "Empty": "Empty",
  "Inputing": "Inputing",
  "Storing": "Storing"
};

const BIN_TYPE = {
  "Pickable": "Pickable",
  "UnPickable": "UnPickable",
  "Lost": "Lost",
  "Found": "Found"
};

const DOCUMENT_TYPE = {
  "POReceipt": "POReceipt",
  "SOInvoice": "SOInvoice"
}

const DOCUMENT_OBJECTTYPE = {
  "PO": "PO",
  "SO": "SO"
}
const NUMBERIC = {
  CM3ToM3: 0.000001,
  N100: 100,
  N1000: 1000,
}
const CONFIRMQTY = true;
const ISSUE_STATUS = {
  "NEW": "New",
  "CANCELED": "Canceled",
  "PROCESSING": "Processing",
  "COMPLETED": "Completed",
  "SETTLEMENT": "Settlement",
  "MATCHEDLOSTANDFOUND": "MatchedLostAndFound",
  "PARTIALLYPROCESSED": "PartiallyProcessed"
}
const STATUS_COLOR = {
  "New": "#62B1FF",
  "Canceled": "#d0333a",
  "Active": "#00E334",
  Finished: "#00E334",
  ReceivingByLine: "#62B1FF",
  Picked: "#2196f3",
  Packed: "#2196f3",
  AssignedPicker: "#2196f3",
  DefinedStorageLocation: "#2196f3",
  PickingAfterPacked: "#2196f3",
  PickedAfterPacked: "#2196f3",
  CountingAndEnclosing: "#FFA500",
  CountedAndEnclosed: "#FFA500",
  StoringAfterPacked: "#FFA500",
  StoredAfterPacked: "#FFA500",
  ReadyToShip: "#FFA500",
  TransportHandon: "#FFA500",
  AssignedDriver: "#FFA500",
  Delivering: "#2196f3",
  Delivered:"#00E334",
  ReturnedOnWarehouse:"#FFA500",
  Delay:"#f3c74c",
  SplittingNew: "#8A2BE2",
  CreatedSplitList: "#8A2BE2",
  SplittingOut: "#00c2ff",
  "Error":"#f44336",
  "CreatedTrip":"#f3c74c",
  "OnReturn":"#FFA500",
  "ReNew":"#E0FFFF",
  "ReProcessing": "#f7ce06",
  "Completed": "#00E334",
  "ReCompleted": "#00E334",
  "WaitingConfirm": "#f7ce06",
  "ProcessingConfirm":"#f7ce06",
  "Closed":"#00E334",
  "Normal": "#E0FFFF",
  "Locked": "#fda521",
  "WaitingForLocked": "#f3c74c",
  "WaitingForUnlock": "#f3c74c"
};

const STATUS_BORDER = {
    New: "#9c27b0",
    Picked: "#2196f3",
    Packed: "#2196f3",
    AssignedPicker: "#2196f3",
    DefinedStorageLocation: "#2196f3",
    PickingAfterPacked: "#2196f3",
    PickedAfterPacked: "#2196f3",
    CountingAndEnclosing: "#ff9800",
    CountedAndEnclosed: "#ff9800",
    StoringAfterPacked: "#ff9800",
    StoredAfterPacked: "#ff9800",
    ReadyToShip: "#ff9800",
    TransportHandon: "#ff9800",
    AssignedDriver: "#ff9800",
    Delivering: "#2196f3",
    "Delivered":"#00E334",
    "ReturnedOnWarehouse":"#FFA500"
}

const PICKUP_METHODS = {
  "FEFO": "FEFO - Hết hạn trước xuất trước",
  "FIFO": "FIFO - Nhập trước xuất trước",
  "LIFO": "LIFO - Nhập sau xuất trước"
}

const STATUS_BORDER_BOOKING = {
  'New':  '#E0FFFF',
  'Canceled':  '#f44336',
};

export {
  STATUS_BORDER,

  STATUS_BORDER_COLOR,
  STATUS_BORDER_CLAIM,
  STATUS_BORDER_MASANSTORE,
  STATUS_BORDER_OFFER_TYPE,
  STATUS_BORDER_STO_FINISH,
  STATUS_BORDER_STO_PROCESS,
  STATUS_BORDER_STOCK_GOOD_LIMIT,
  STATUS_BORDER_PKGPACKAGE,
  STATUS_BORDER_SCAN_PACKED,
  STATUS_BORDER_MDL,
  CONFIRM_PICKING_STATUS,
  STATUS_BORDER_CONFIRM_PICKING_COLOR,
  REGION_WAREHOUSE,
  PO_STATUS,
  RECEIVING_STATUS,
  DEVICE_STATUS,
  DEVICE_TYPE,
  PO_SOURCE,
  PO_CONDITIONTYPE,
  DOCUMENT_TYPE,
  DOCUMENT_OBJECTTYPE,
  SO_STATUS,
  SO_CANCELED_STATUS,
  BIN_TYPE,
  BIN_STATUS,
  NUMBERIC,
  CONFIRMQTY,
  ISSUE_STATUS,
  STATUS_COLOR,
  SPLITLIST_STATUS,
  STATUS_PACKAGE_PRODUCT_ITEMS_COLOR,
  PICKUP_METHODS,
  STATUS_BORDER_BOOKING
};
