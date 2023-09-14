export const exportJsonToCsv = (filename: string, headers: string[], datas: Record<string, string | number>[]) => {
  const headersToString = headers.toString();

  const datasToString = datas.map((data) => {
    return Object.values(data).toString();
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
