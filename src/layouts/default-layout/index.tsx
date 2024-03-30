import React, { ReactNode } from 'react';
import { Header } from './header';

import { Footer } from './footer';

import styles from './default-layout.module.css';

type Props = {
  children: ReactNode;
};
const DefaultLayout = (props: Props) => {
  return (
    <>
      <Header />
      <section className={styles.wrapper}>{props.children}</section>
      <Footer />
    </>
  );
};

export default DefaultLayout;
