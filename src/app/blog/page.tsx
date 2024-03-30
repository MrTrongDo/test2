import Chart from './Chart';

async function getData() {
  const apiUrl = 'https://raw.githubusercontent.com/MrTrongDo/Test/main/API_response.json';

  const res = await fetch(apiUrl, {
    cache: 'force-cache'
  });

  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  const response: any = (await res.json()) as any;

  const period = new Date();
  period.setDate(period.getDate() - 600);

  // Initial x axis
  const current = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 260);

  const initX = [
    {
      year: start.getFullYear(),
      month: start.getMonth(),
      day: start.getDay()
    },
    {
      year: current.getFullYear(),
      month: current.getMonth(),
      day: current.getDay()
    }
  ];

  // Initial format
  const _width = 80;
  const _max = 8;

  // Filter
  const filteredData = response?.data?.TA_STA?.filter((item: any) => item.PR_Ticker === 'AAA');

  // Parse
  const data = filteredData?.map((item: any) => ({
    ...item,
    ActiveBuy: parseFloat(item.PR_ActiveBuy)
  }));

  return { data, _width, _max, initX };
}

export default async function App() {
  const { data, _width, _max } = await getData();

  return <Chart data={{ data, _max, _width }} />;
}
