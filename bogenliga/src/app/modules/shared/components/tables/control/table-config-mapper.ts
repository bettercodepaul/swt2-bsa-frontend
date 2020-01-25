import {TableActionConfig} from '../types/table-action-config.interface';
import {TableActionType} from '../types/table-action-type.enum';
import {TableColumnConfig} from '../types/table-column-config.interface';
import {TableColumnSortOrder} from '../types/table-column-sort-order.enum';
import {TableColumnType} from '../types/table-column-type.enum';
import {TableConfig} from '../types/table-config.interface';

const DEFAULT_TABLE_ACTION_CONFIG: TableActionConfig = {
  actionTypes:      [],
  width:            4,
  icons:            {
    edit:    {
      active:   'edit',
      inactive: 'edit'
    },
    delete:  {
      active:   'trash',
      inactive: 'trash',
    },
    view:    {
      active:   'eye',
      inactive: 'eye'
    },
    loading: {
      active:   'sync',
      inactive: 'sync'
    },
    add: {
      active:   'plus',
      inactive: 'plus'
    },
    download: {
      active: 'download',
      inactive: 'download'
    }
  },
  localizationKeys: {
    actionColum: 'TABLE.HEADERS.ACTION',
    edit:        'TABLE.ACTIONS.EDIT',
    delete:      'TABLE.ACTIONS.DELETE',
    view:        'TABLE.ACTIONS.VIEW',
    add:         'TABLE.ACTIONS.ADD',
    download: 'TABLE.ACTIONS.DOWNLOAD'
  }
};

const DEFAULT_TABLE_CONFIG: TableConfig = {
  columns: []
};


const DEFAULT_COLUMN_CONFIG: TableColumnConfig = {
  translationKey: '',
  propertyName:   '',

  type:              TableColumnType.TEXT,
  width:             0,
  sortable:          true,
  notLigatabelle:    true,
  currentSortOrder:  TableColumnSortOrder.UNSORTED,
  dateAndTimeFormat: {
    de: {
      language:   'de-DE',
      dateFormat: 'dd.MM.yyyy',
      timeFormat: 'mediumTime'
    },
    en: {
      language:   'en-US',
      dateFormat: 'MM/dd/yyyy',
      timeFormat: 'mediumTime'

    },
  },
  truncationLength:  0
};


function columnConfigWithDefaults(optional: TableColumnConfig): TableColumnConfig {
  // clone defaults
  const columnConfig = Object.assign({}, DEFAULT_COLUMN_CONFIG);

  if (optional.translationKey) {
    columnConfig.translationKey = optional.translationKey;
  }
  if (optional.propertyName) {
    columnConfig.propertyName = optional.propertyName;
  }
  if (optional.type) {
    columnConfig.type = optional.type;
  }
  if (optional.localizationSet) {
    columnConfig.localizationSet = optional.localizationSet;
  }
  if (optional.width) {
    columnConfig.width = optional.width;
  }

  if (optional.sortable != null) {
    columnConfig.sortable = optional.sortable;
  }
  if(optional.notLigatabelle!= null){
    columnConfig.notLigatabelle = optional.notLigatabelle;
  }

  if (optional.currentSortOrder) {
    columnConfig.currentSortOrder = optional.currentSortOrder;
  }

  if (optional.dateAndTimeFormat) {
    columnConfig.dateAndTimeFormat = optional.dateAndTimeFormat;
  }

  if (optional.truncationLength > 0) {
    columnConfig.truncationLength = optional.truncationLength;
  }

  if (optional.propertyMapper) {
    columnConfig.propertyMapper = optional.propertyMapper;
  }

  if (optional.stylesMapper) {
    columnConfig.stylesMapper = optional.stylesMapper;
  }

  if (optional.mappingFunction) {
    columnConfig.mappingFunction = optional.mappingFunction;
  }

  return columnConfig;
}


function tableActionConfigWithDefaults(optional: {
  actionTypes?: TableActionType[],
  width?: number,
  iconUrls?: any,
  localizationKeys?: { columnKey: string, edit: string, delete: string, view: string, add: string, download: string }
} = {}) {
  // clone defaults
  const actionsWithDefaults = Object.assign({}, DEFAULT_TABLE_ACTION_CONFIG);

  if (optional.actionTypes) {
    actionsWithDefaults.actionTypes = optional.actionTypes;
  }

  if (optional.width > 0) {
    actionsWithDefaults.width = optional.width;
  }

  if (optional.iconUrls) {
    actionsWithDefaults.icons = optional.iconUrls;
  }

  if (optional.localizationKeys) {
    actionsWithDefaults.localizationKeys = optional.localizationKeys;
  }

  return actionsWithDefaults;
}


export function tableConfigWithDefaults(optional: {
  columns?: TableColumnConfig[],
  iconUrls?: any,
  actions?: TableActionConfig,
  actionColumnTranslationKey?: string
} = {}): TableConfig {
  // clone defaults
  const tableConfig = Object.assign({}, DEFAULT_TABLE_CONFIG);

  if (optional.columns) {

    const columnConfig: TableColumnConfig[] = [];

    optional.columns.forEach((column: TableColumnConfig) => {
      columnConfig.push(columnConfigWithDefaults(column));
    });

    tableConfig.columns = columnConfig;
  }

  tableConfig.actions = tableActionConfigWithDefaults(optional.actions);

  return tableConfig;
}

