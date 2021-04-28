require('./styles/styles.scss');
var Grid = require('ag-grid-community').Grid;
require('ag-grid-enterprise');

// create cols, one for each letter
var columnDefs = [{
    headerName: 'Country',
    field: 'country',
    enableRowGroup: true,
    filter: true,
    width: 200,
    rowDrag: true,
    menuTabs: ['filterMenuTab', 'columnsMenuTab']
}].concat('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => ({ field: letter })));

// create 100 rows, and fill with random numbers
var rowData = [];
var countries = ['United Kingdom', 'Ireland', 'United States', 'India', 'Brazil', 'China', 'Russia'];

for (var i = 0; i < 100; i++) {
    var item = {};

    item.country = countries[i % countries.length];

    for (var j = 1; j < columnDefs.length; j++) {
        var colDef = columnDefs[j];
        item[colDef.field] = Math.floor(Math.random() * 100000);
    }

    rowData.push(item);
}

var gridOptions = {
    // we do not hide the menu icons, so easier to see any style changes that impact the icons
    suppressMenuHide: true,
    defaultColDef: {
        width: 100,
        filter: 'number',
        sortable: true,
        resizable: true,
        menuTabs: ['filterMenuTab', 'columnsMenuTab']
    },
    animateRows: true,
    rowDragManaged: true,
    columnDefs: columnDefs,
    rowData: rowData,
    sideBar: {
        toolPanels: [
            {
                id: 'columns',
                labelDefault: 'Columns',
                labelKey: 'columns',
                iconKey: 'columns',
                toolPanel: 'agColumnsToolPanel'
            },
            {
                id: 'filters',
                labelDefault: 'Filters',
                labelKey: 'filters',
                iconKey: 'filter',
                toolPanel: 'agFiltersToolPanel'
            }
        ],
        defaultToolPanel: 'filters'
    },
    onFilterChanged: onFilterChanged,
};

function onFilterChanged(params) {
    // update grid classList
    let gridDiv = document.querySelector('#myGrid');
    let classList = gridDiv.classList;
    if (classList.length > 1) {
        let toRemove = classList.item(1);
        console.log('first need to remove class', toRemove);
        classList.remove(toRemove);
    }
    let filterModel = params.api.getFilterModel();
    let filterKeysLength = Object.keys(filterModel).length;
    let toAdd = `filter-${filterKeysLength}`;
    console.log(`adding class ${toAdd}`);
    classList.add(toAdd);
    console.log(gridDiv.classList);
}

function initialise() {
    if (cssHasLoaded()) {
        new Grid(document.querySelector('#myGrid'), gridOptions);
    } else {
        setTimeout(initialise, 100);
    }
}

function cssHasLoaded() {
    // test if the theme has loaded by looking for the effect of a known style,
    // in this case we know that the theme applies padding to cells
    const themeEl = document.createElement('div');
    document.body.appendChild(themeEl);

    try {
        themeEl.className = document.querySelector("[class^='ag-theme']").className;

        const cellEl = document.createElement('div');

        cellEl.className = 'ag-cell';
        themeEl.appendChild(cellEl);

        const computedStyle = window.getComputedStyle(cellEl);

        return parseFloat(computedStyle.paddingLeft) > 0;
    } finally {
        document.body.removeChild(themeEl);
    }
}

initialise();
