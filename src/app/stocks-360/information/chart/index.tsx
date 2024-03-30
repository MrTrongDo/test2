'use client';
import React from 'react';
import useSWR from 'swr';
import { Vega } from 'react-vega';
import { Spin } from '@/core';

const fetcher = async () => {
  const response = await fetch('https://raw.githubusercontent.com/MrTrongDo/Test/main/API_response_5M.json');
  const _response = await response.json();

  // Filter
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

  // Initial format

  const initFormat = {
    _width: 270,
    _heigh_cha: 60,
    _heigh_tim: 1,
    _heigh_vol: 25,
    _fontsize_norm: 10
  };

  // Filter
  const filteredData = _response.data.TA_FT.filter((item: any) => item.DATA_TYPE === '5M');

  // Parse
  const data = filteredData.map((item: any) => ({
    Giờ: new Date(item.PR_DATE),
    'Thay đổi %': parseFloat(item.PR_PERCENT_CHANGE),
    MA50: parseFloat(item.PR_MA50),
    'Khối lượng': parseFloat(item.PR_VOLUME),
    'KL TB20': parseFloat(item.PR_VMA20),
    Close: parseFloat(item.PR_CLOSE),
    Open: parseFloat(item.PR_OPEN),
    Low: parseFloat(item.PR_LOW),
    High: parseFloat(item.PR_HIGH),
    TC: parseFloat(item.ADD_PR_TC)
  }));

  return { data, initX, initFormat };
};

export const Chart = () => {
  const { data, isLoading } = useSWR(
    'https://raw.githubusercontent.com/MrTrongDo/Test/main/API_response_5M.json',
    fetcher
  );

  if (isLoading) return <Spin />;

  const { data: _data, initFormat } = data ?? {};

  const vegaLiteSpec: any = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: { values: _data },
    encoding: {
      x: {
        field: 'Giờ',
        type: 'nominal',
        axis: {
          format: 'dd-MMM',
          formatType: 'pbiFormat',
          labelAngle: -90,
          labelColor: '#002060',
          labelFontSize: 0
        },
        title: null
      }
    },
    vconcat: [
      {
        width: initFormat?._width,
        height: initFormat?._heigh_cha,
        title: '',
        encoding: {
          x: { field: 'Giờ', type: 'nominal', axis: null, title: null },
          color: { condition: { test: "datum['Open']<datum['Close']", value: '#5EC959' }, value: '#FA6E42' }
        },
        layer: [
          {
            mark: { type: 'rule' },
            encoding: {
              y: { field: 'Low', type: 'quantitative', scale: { zero: false }, axis: null },
              y2: { field: 'High' }
            }
          },
          {
            mark: { type: 'bar', tooltip: true, opacity: { expr: "datum['_candle']" } },
            encoding: {
              y: { field: 'Open', type: 'quantitative', title: null },
              y2: { field: 'Close' },
              size: { value: 2.5 }
            }
          },
          {
            mark: { type: 'text', align: 'left', size: 10, dy: 0, dx: 5 },
            encoding: {
              text: {
                aggregate: { argmax: 'Giờ' },
                field: 'Close',
                type: 'quantitative',
                formatType: 'pbiFormat',
                format: '#,#.#'
              },
              x: { aggregate: 'max', type: 'nominal', field: 'Giờ', title: null },
              y: { aggregate: { argmax: 'Giờ' }, field: 'Close', type: 'quantitative', title: null },
              color: { condition: { test: "datum['Open']<datum['Close']", value: '#5EC959' }, value: '#FA6E42' }
            }
          },
          {
            mark: { type: 'line', interpolate: 'monotone', tooltip: true },
            encoding: {
              y: { field: 'MA50', type: 'quantitative', title: null },
              size: { value: 1 },
              color: { value: '#00B0F0' }
            }
          },
          {
            mark: { type: 'text', align: 'left', size: 10, dy: 0, dx: 5 },
            encoding: {
              text: {
                aggregate: { argmax: 'Giờ' },
                field: 'MA50',
                type: 'quantitative',
                formatType: 'pbiFormat',
                format: '#,#.#'
              },
              x: { aggregate: 'max', type: 'nominal', field: 'Giờ', title: null },
              y: { aggregate: { argmax: 'Giờ' }, field: 'MA50', type: 'quantitative', title: null },
              color: { value: '#00B0F0' }
            }
          },
          {
            mark: { type: 'line', interpolate: 'monotone', strokeDash: [6, 3], tooltip: true },
            encoding: {
              y: { field: 'TC', type: 'quantitative', title: null },
              size: { value: 1 },
              color: { value: 'grey' }
            }
          },
          {
            mark: { type: 'text', align: 'left', size: 10, dy: 0, dx: 5 },
            encoding: {
              text: {
                aggregate: { argmax: 'Giờ' },
                field: 'TC',
                type: 'quantitative',
                formatType: 'pbiFormat',
                format: '#,#.#'
              },
              x: { aggregate: 'max', type: 'nominal', field: 'Giờ', title: null },
              y: { aggregate: { argmax: 'Giờ' }, field: 'TC', type: 'quantitative', title: null },
              color: { value: 'grey' }
            }
          },
          {
            mark: 'rule',
            encoding: {
              opacity: { condition: { value: 0.3, param: 'hover', empty: false }, value: 0 },
              tooltip: [
                { field: 'Giờ', type: 'temporal', timeUnit: 'binnedhoursminutes' },
                { field: 'Thay đổi %', type: 'quantitative', format: ',.1%' },
                { field: 'Open', type: 'quantitative', format: ',.2f' },
                { field: 'Close', type: 'quantitative', format: ',.2f' },
                { field: 'High', type: 'quantitative', format: ',.2f' },
                { field: 'Low', type: 'quantitative', format: ',.2f' },
                { field: 'MA50', type: 'quantitative', format: ',.2f' }
              ]
            },
            params: [
              {
                name: 'hover',
                select: { type: 'point', fields: ['Giờ'], nearest: true, on: 'mouseover', clear: 'mouseout' }
              }
            ]
          }
        ]
      },
      {
        title: '',
        width: initFormat?._width,
        height: initFormat?._heigh_vol,
        encoding: {
          x: { field: 'Giờ', type: 'nominal', axis: null, title: null },
          color: { condition: { test: "datum['Open']<datum['Close']", value: '#5EC959' }, value: '#FA6E42' }
        },
        layer: [
          {
            mark: { type: 'bar', tooltip: true },
            encoding: {
              y: { field: 'Khối lượng', type: 'quantitative', title: null, axis: null },
              size: { value: 1.8 }
            }
          },
          {
            mark: { type: 'area', interpolate: 'monotone', tooltip: true },
            encoding: {
              y: { field: 'KL TB20', type: 'quantitative', title: 'Khối lượng' },
              size: { value: 1 },
              color: { value: '#00B0F0' },
              opacity: { value: 0.1 }
            }
          },
          {
            mark: { type: 'line', interpolate: 'monotone', tooltip: true },
            encoding: {
              y: { field: 'KL TB20', type: 'quantitative', title: null },
              size: { value: 1 },
              color: { value: '#00B0F0' },
              opacity: { value: 0.5 }
            }
          },
          {
            mark: 'rule',
            encoding: {
              opacity: { condition: { value: 0.3, param: 'hover', empty: false }, value: 0 },
              tooltip: [
                { field: 'Giờ', type: 'temporal', timeUnit: 'binnedhoursminutes' },
                { field: 'Khối lượng', type: 'quantitative', format: ',.1f' },
                { field: 'KL TB20', type: 'quantitative', format: ',.1f' }
              ]
            },
            params: [
              {
                name: 'hover',
                select: { type: 'point', fields: ['Giờ'], nearest: true, on: 'mouseover', clear: 'mouseout' }
              }
            ]
          }
        ]
      }
    ],
    config: { view: { stroke: null }, axis: { grid: false } }
  };

  return <Vega spec={vegaLiteSpec} renderer={'svg'} actions={false}></Vega>;
};
