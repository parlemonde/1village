export const exportJsonToCsv = (filename: string, headers: string[], datas: Record<string, string | number>[]) => {
  const escapedHeaders = headers.map((header) => {
    return header.replaceAll(',', '');
  });

  const headersToString = escapedHeaders.toString();

  const datasToString = datas.map((data) => {
    const escapedData = Object.values(data).map((value) => {
      return typeof value === 'string' ? value.replaceAll(',', '') : value;
    });

    return escapedData.toString();
  });

  const datasToCsvFormat = [headersToString, ...datasToString].join('\n');

  downloadToCsv(filename, datasToCsvFormat);
};

const downloadToCsv = (fileName: string, datas: string) => {
  const blob = new Blob([datas], { type: 'application/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.download = fileName + '.csv';
  a.href = url;
  a.style.display = 'none';

  document.body.appendChild(a);

  a.click();

  a.remove();
  URL.revokeObjectURL(url);
};
