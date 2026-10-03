/**
 * Dependency-free "Export to Excel".
 *
 * Emits a SpreadsheetML 2003 workbook (.xls) — a plain XML file Excel opens as a
 * real, formatted spreadsheet (bold header row, one sheet). Every value is
 * written as text so Excel never mangles a TMID, a phone number, or a leading
 * zero into scientific notation. No SheetJS / exceljs dependency required.
 */

export interface ExcelColumn<T> {
  header: string;
  value: (row: T) => string | number | null | undefined;
}

const esc = (v: unknown): string =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\r\n|\r|\n/g, ' ')
    // Strip control chars Excel's XML parser rejects.
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');

export function exportToExcel<T>(
  filename: string,
  columns: ExcelColumn<T>[],
  rows: T[],
  sheetName = 'Call History',
): void {
  const cell = (v: unknown) => `<Cell><Data ss:Type="String">${esc(v)}</Data></Cell>`;
  const headerRow = `<Row>${columns.map(c => `<Cell ss:StyleID="hdr"><Data ss:Type="String">${esc(c.header)}</Data></Cell>`).join('')}</Row>`;
  const bodyRows = rows.map(r => `<Row>${columns.map(c => cell(c.value(r))).join('')}</Row>`).join('');

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<?mso-application progid="Excel.Sheet"?>\n` +
    `<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n` +
    `<Styles><Style ss:ID="hdr"><Font ss:Bold="1"/><Interior ss:Color="#E5E7EB" ss:Pattern="Solid"/></Style></Styles>\n` +
    `<Worksheet ss:Name="${esc(sheetName).slice(0, 31) || 'Sheet1'}"><Table>${headerRow}${bodyRows}</Table></Worksheet>\n` +
    `</Workbook>`;

  const blob = new Blob(['﻿' + xml], { type: 'application/vnd.ms-excel;charset=UTF-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = /\.xls$/i.test(filename) ? filename : `${filename}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
