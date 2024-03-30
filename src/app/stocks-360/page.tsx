import { Suspense } from 'react';
import Information from './information';
import { Content } from './content';

export default function Stocks360Page() {
  return (
    <Suspense>
      <Information />
      <Content />
    </Suspense>
  );
}
