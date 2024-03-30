import { Status } from '../information/type';

const mapColorByStatus = new Map<Status, string>([
  ['up', '#61CA5C'],
  ['down', '#FA6E42'],
  ['balance', '#FFC000'],
  ['normal', '#002060']
]);

export const detectColor = (status: Status) => mapColorByStatus.get(status);
