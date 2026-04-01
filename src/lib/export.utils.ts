type ExportRecord = Record<string, string | number | boolean | null | undefined>;

interface ExportOptions {
  filename: string;
  columns?: string[];
}

const CSV_MIME_TYPE = "text/csv;charset=utf-8;";
const XLS_MIME_TYPE = "application/vnd.ms-excel;charset=utf-8;";

function triggerDownload(content: BlobPart, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Delay revocation to avoid zero-byte/blank downloads in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function escapeCsvValue(value: ExportRecord[string]) {
  if (value === null || value === undefined) return "";

  const normalized = String(value).replace(/\r?\n|\r/g, " ");

  if (/[,"\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }

  return normalized;
}

export function exportToCSV(rows: ExportRecord[], options: ExportOptions) {
  if (!rows.length) return;

  const headers = options.columns?.length ? options.columns : Object.keys(rows[0]);
  const csvLines = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeCsvValue(row[header])).join(",")),
  ];

  const csvContent = `\uFEFF${csvLines.join("\r\n")}`;
  triggerDownload(csvContent, options.filename, CSV_MIME_TYPE);
}

function escapeHtml(value: ExportRecord[string]) {
  if (value === null || value === undefined) return "";

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function exportToExcel(rows: ExportRecord[], options: ExportOptions) {
  if (!rows.length) return;

  const headers = options.columns?.length ? options.columns : Object.keys(rows[0]);

  const tableHeader = headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("");
  const tableRows = rows
    .map(
      (row) =>
        `<tr>${headers
          .map((header) => `<td>${escapeHtml(row[header])}</td>`)
          .join("")}</tr>`,
    )
    .join("");

  const html = `
    <table>
      <thead><tr>${tableHeader}</tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
  `;

  triggerDownload(html.trim(), options.filename, XLS_MIME_TYPE);
}
