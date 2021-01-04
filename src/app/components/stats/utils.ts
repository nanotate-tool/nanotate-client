import * as xlsx from 'xlsx';
import * as FileSaver from 'file-saver';

const tagsSettings = [
    {
        tag: 'step',
        backgroundColor: '#64c4ed',
        hoverBackgroundColor: '#64c4ed'
    },
    {
        tag: 'sample',
        backgroundColor: '#eb7070',
        hoverBackgroundColor: '#eb7070'
    },
    {
        tag: 'reagent',
        backgroundColor: '#e6e56c',
        hoverBackgroundColor: '#e6e56c'
    },
    {
        tag: 'equipment',
        backgroundColor: '#fd8c04',
        hoverBackgroundColor: '#fd8c04'
    },
    {
        tag: 'input',
        backgroundColor: '#bb2205',
        hoverBackgroundColor: '#bb2205'
    },
    {
        tag: 'output',
        backgroundColor: '#d3de32',
        hoverBackgroundColor: '#d3de32'
    }
]

/**
 * returns the settings for passed tag will be use in chart representation
 * @param tag tag name
 */
export function getTagChartSettings(tag: string) {
    let settings = tagsSettings.find((settings) => settings.tag == tag);
    if (!settings) {
        return getLabelChartSettings(tag);
    }
    return settings;
}

/**
 * returns generic settings for passed label will be use in chart representation
 */
export function getLabelChartSettings(label: string) {
    const randomColor = generateRandomColor();
    return { tag: label, backgroundColor: randomColor, hoverBackgroundColor: randomColor };
}

/**
 * generates a random color in hex format
 */
export function generateRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


export function exportExcel(dataToExport: { data: any, headers: string[] }) {
    const worksheet = xlsx.utils.json_to_sheet(dataToExport.data);
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAsExcelFile(excelBuffer, "Nanopublications");
}

export function saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
}