'use client';
import React, { useRef, useState } from 'react';
import { Spin, clsx, useContainerDimensions } from '@/core';
import styles from './left-side.module.css';
import { DayChart } from './day';
import useSWR from 'swr';
import { ChartEdiotDay } from './elliot-day';

const navsMap = new Map<string, string>([
  ['Đa chiều', 'Đồ thị giá kết hợp đa khung thời gian'],
  ['Ngày', 'Đồ thị giá - ngày'],
  ['Giờ', 'Đồ thị giá - giờ'],
  ['Tuần', 'Đồ thị giá - tuần'],
  ['Tháng', 'Đồ thị giá - tháng'],
  ['Elliot - D', 'Sóng Elliot - ngày'],
  ['Elliot - W', 'Sóng Elliot - tuần'],
  ['Chu kỳ', 'Chu kì theo thời gian']
]);

const getNavDetail = (key: string) => navsMap.get(key) ?? '';

const fetcher = async () => {
  const response = await fetch('https://raw.githubusercontent.com/MrTrongDo/Test/main/API_response.json');
  const _response = await response.json();

  const period = new Date();
  period.setDate(period.getDate() - 600);

  // Initial x axis
  const current = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 260);

  const initX = [
    { year: start.getFullYear(), month: start.getMonth(), day: start.getDay() },
    { year: current.getFullYear(), month: current.getMonth(), day: current.getDay() }
  ];

  const initialFormat = {
    _width: 658,
    _heigh_cha: 305,
    _heigh_tim: 3,
    _heigh_vol: 60,
    _heigh_mon: 69,
    _heigh_adx: 48,
    _heigh_ren: 69,
    _heigh_bru: 40,
    _fontsize_norm: 10
  };

  const filteredData = _response.data.TA_FT.filter((item: any) => item.DATA_TYPE === 'D');

  // Parse
  const data = filteredData.map((item: any) => ({
    Ngày: new Date(item.PR_DATE),
    'Thay đổi %': parseFloat(item.PR_PERCENT_CHANGE),
    'Kháng cự chính': parseFloat(item.PR_HIGH_RESIST),
    'Kháng cự phụ': parseFloat(item.PR_LOW_RESIST),
    'Hỗ trợ chính': parseFloat(item.PR_LOW_SUPP),
    'Hỗ trợ phụ': parseFloat(item.PR_HIGH_SUPP),
    MA50: parseFloat(item.PR_MA50),
    'Khối lượng': parseFloat(item.PR_VOLUME),
    'KL TB20': parseFloat(item.PR_VMA20),
    Bull_Vol: parseFloat(item.ADD_BULL_VOL),
    Close: parseFloat(item.PR_CLOSE),
    Open: parseFloat(item.PR_OPEN),
    Low: parseFloat(item.PR_LOW),
    High: parseFloat(item.PR_HIGH),
    CHANNEL_LOWER_1: parseFloat(item.CHANNEL_LOWER_1),
    CHANNEL_LOWER_2: parseFloat(item.CHANNEL_LOWER_2),
    CHANNEL_UPPER_1: parseFloat(item.CHANNEL_UPPER_1),
    CHANNEL_UPPER_2: parseFloat(item.CHANNEL_UPPER_2),
    'ATR Stop': parseFloat(item.PR_ATR_STOP),
    ATR_Spot: parseFloat(item.ADD_ATR_SPOT),
    'Money Flow': parseFloat(item.PR_MONEY_FLOW),
    ADX: parseFloat(item.PR_ADX),
    DIMinus: parseFloat(item.PR_DI_MINUS),
    DIPlus: parseFloat(item.PR_DI_PLUS),
    Axis0: parseFloat(item.FIX_AXIS),
    Buy_Spot: parseFloat(item.ADD_BUY_SPOT),
    RENKO_O: parseFloat(item.PR_RENKO_O),
    RENKO_C: parseFloat(item.PR_RENKO_C),
    RENKO_RES: parseFloat(item.PR_RENKO_RES),
    RENKO_SUP: parseFloat(item.PR_RENKO_SUP),
    RENKO_COLOR: parseFloat(item.PR_RENKO_COLOR),
    TAICHI_MINUS: parseFloat(item.PR_TAICHI_MINUS),
    TAICHI_PLUS: parseFloat(item.PR_TAICHI_PLUS),
    ST_CHANNEL_LOWER_1: parseFloat(item.CHANNEL_LOWER_1_ST),
    ST_CHANNEL_LOWER_2: parseFloat(item.CHANNEL_LOWER_2_ST),
    ST_CHANNEL_UPPER_1: parseFloat(item.CHANNEL_UPPER_1_ST),
    ST_CHANNEL_UPPER_2: parseFloat(item.CHANNEL_UPPER_2_ST)
  }));

  return { data, initX, initialFormat };
};

export const LeftSide = () => {
  const sectionRef = useRef(null);
  const [currentNav, setCurrentNav] = useState<string>(getNavDetail('Đa chiều'));

  const { data, isLoading } = useSWR('multiple', fetcher);

  const { width } = useContainerDimensions(sectionRef);

  const renderNavs = () => {
    return (
      <div className='flex'>
        {Array.from(navsMap).map(([key, value]) => {
          return (
            <span
              key={key}
              onClick={() => setCurrentNav(getNavDetail(key))}
              className={clsx(styles.nav, {
                [styles.navActive]: value === currentNav
              })}
            >
              {key}
            </span>
          );
        })}
      </div>
    );
  };

  const renderCharts = () => {
    const chartsHandler = {
      [getNavDetail('Đa chiều')]: (
        <DayChart data={data?.data} initX={data?.initX} initialFormat={data?.initialFormat} width={width} />
      ),
      [getNavDetail('Elliot - D')]: <ChartEdiotDay width={width} />
    };

    return chartsHandler?.[currentNav];
  };

  return (
    <section className={styles.wrapper} ref={sectionRef}>
      <div className={styles.header}>
        <div className={styles.title}>{currentNav}</div>
        <div className={styles.navs}>{renderNavs()}</div>
      </div>

      {!isLoading ? (
        <div className={styles.charts}>
          <div className={styles.chartsContent}>{renderCharts()}</div>
        </div>
      ) : (
        <Spin />
      )}
    </section>
  );
};
