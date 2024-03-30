import React from 'react';
import { Vega, VisualizationSpec } from 'react-vega';
import useSWR from 'swr';
import { styled } from '@/core';

const fetcher = async () => {
  const response = await fetch('https://raw.githubusercontent.com/MrTrongDo/Test/main/API_response.json');

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
    _width: 1330,
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
    BPT_DATE: new Date(item.FIBO_BPT_DATE),
    BPT: parseFloat(item.FIBO_BPT),
    'Thay đổi %': parseFloat(item.PR_PERCENT_CHANGE),
    'Khối lượng': parseFloat(item.PR_VOLUME),
    'KL TB20': parseFloat(item.PR_VMA20),
    FIBO_0_VALUE: parseFloat(item.FIBO_0_VALUE),
    FIBO_100_VALUE: parseFloat(item.FIBO_100_VALUE),
    FIBO_236_VALUE: parseFloat(item.FIBO_236_VALUE),
    FIBO_386_VALUE: parseFloat(item.FIBO_386_VALUE),
    FIBO_500_VALUE: parseFloat(item.FIBO_500_VALUE),
    FIBO_618_VALUE: parseFloat(item.FIBO_618_VALUE),
    ColorCode: parseFloat(item.ELL_COLORCODE),
    Close: parseFloat(item.ELL_CLOSE),
    Open: parseFloat(item.ELL_OPEN),
    Low: parseFloat(item.ELL_LOW),
    High: parseFloat(item.ELL_HIGH),
    'Kháng cự chính': parseFloat(item.ELL_HIGH_RESIST),
    'Kháng cự phụ': parseFloat(item.ELL_LOW_RESIST),
    'Hỗ trợ phụ': parseFloat(item.ELL_HIGH_SUPP),
    'Hỗ trợ chính': parseFloat(item.ELL_LOW_SUPP),
    TAICHI_MINUS: parseFloat(item.PR_TAICHI_MINUS),
    TAICHI_PLUS: parseFloat(item.PR_TAICHI_PLUS),
    'Money Flow': parseFloat(item.PR_MONEY_FLOW),
    ADX: parseFloat(item.PR_ADX),
    DIMinus: parseFloat(item.PR_DI_MINUS),
    DIPlus: parseFloat(item.PR_DI_PLUS),
    RENKO_O: parseFloat(item.PR_RENKO_O),
    RENKO_C: parseFloat(item.PR_RENKO_C),
    RENKO_RES: parseFloat(item.PR_RENKO_RES),
    RENKO_SUP: parseFloat(item.PR_RENKO_SUP),
    RENKO_COLOR: parseFloat(item.PR_RENKO_COLOR)
  }));

  return { data, initFormat, initX };
};

type Props = {
  width: number;
};

const VegaWrapper = styled(Vega)<{ $width: number }>`
  svg {
    width: ${(props) => `${props.$width}px`};
  }
`;

export const ChartEdiotDay = (props: Props) => {
  const { data } = useSWR('elliot_d', fetcher);

  const { width: _width } = props;

  const { data: _data, initFormat, initX } = data ?? {};

  const { _fontsize_norm, _heigh_adx, _heigh_bru, _heigh_cha, _heigh_mon, _heigh_ren, _heigh_tim, _heigh_vol } =
    initFormat ?? {};

  const vegaLiteSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: { values: _data },
    params: [
      {
        name: '_chart',
        value: 'Nến',
        bind: {
          input: 'radio',
          options: ['Nến', 'Thanh'],
          name: 'Đồ thị: '
        }
      }
    ],
    encoding: {
      x: {
        field: 'Ngày',
        type: 'nominal',
        axis: {
          format: 'dd-MMM',
          formatType: 'pbiFormat',
          labelAngle: 0,
          labelColor: '#002060',
          labelFontSize: 0
        },
        title: null
      }
    },
    vconcat: [
      {
        width: _width,
        height: _heigh_cha,
        transform: [
          { filter: { param: 'brush' } },
          { calculate: "_chart == 'Nến' ? 1 : 0", as: '_candle' },
          { calculate: "_chart == 'Thanh' ? 1 : 0", as: '_bar' },
          {
            joinaggregate: [
              {
                op: 'max',
                field: 'Ngày',
                as: '_max_date'
              }
            ]
          },
          {
            calculate: "timeOffset( 'day', datum['_max_date'], -60 )",
            as: '_note_x2'
          },
          {
            calculate: "timeOffset( 'day', datum['_max_date'], -120 )",
            as: '_note_x1'
          },
          { calculate: "format(datum.MA50,',.1f')+'- MA50'", as: 'MA50_lb' },
          { calculate: "format(datum.Close,',.1f')+'- Đóng cửa'", as: 'Close_lb' },
          { calculate: "format(datum['FIBO_0_VALUE'],',.1f')+'- Fibo 0'", as: 'FIBO_0_VALUE_lb' },
          { calculate: "format(datum['FIBO_100_VALUE'],',.1f')+'- Fibo 100'", as: 'FIBO_100_VALUE_lb' },
          { calculate: "format(datum['FIBO_500_VALUE'],',.1f')+'- Fibo 50'", as: 'FIBO_500_VALUE_lb' },
          { calculate: "format(datum['FIBO_236_VALUE'],',.1f')+'- Fibo 23.6'", as: 'FIBO_236_VALUE_lb' },
          { calculate: "format(datum['FIBO_386_VALUE'],',.1f')+'- Fibo 38.6'", as: 'FIBO_386_VALUE_lb' },
          { calculate: "format(datum['FIBO_618_VALUE'],',.1f')+'- Fibo 61.8'", as: 'FIBO_618_VALUE_lb' }
        ],
        title: '',
        encoding: {
          x: {
            field: 'Ngày',
            type: 'nominal',
            axis: null,
            title: null
          },
          color: {
            condition: [
              { test: "datum['Open'] < datum['Close'] && datum['ColorCode'] === 1", value: 'blue' },
              { test: "datum['Open'] < datum['Close'] && datum['ColorCode'] === 2", value: '#5EC959' },
              { test: "datum['Open'] > datum['Close'] && datum['ColorCode'] === 2", value: '#FFC000' },
              { test: "datum['Open'] > datum['Close'] && datum['ColorCode'] === 1", value: '#FA6E42' }
            ],
            value: '#FA6E42'
          }
        },
        layer: [
          {
            mark: {
              type: 'rule'
            },
            encoding: {
              y: {
                field: 'Low',
                type: 'quantitative',
                scale: { zero: false },
                axis: {
                  labelAngle: 0,
                  labelColor: '#002060',
                  labelFontSize: _fontsize_norm,
                  tickCount: 5,
                  grid: false
                }
              },
              y2: {
                field: 'High'
              }
            }
          },
          {
            mark: {
              type: 'bar',
              tooltip: true,
              opacity: { expr: "datum['_candle']" }
            },
            encoding: {
              y: {
                field: 'Open',
                type: 'quantitative',
                title: null
              },
              y2: {
                field: 'Close'
              },
              size: { value: 6 }
            }
          },
          {
            mark: {
              type: 'line',
              tooltip: true
            },
            encoding: {
              y: {
                field: 'BPT',
                type: 'quantitative',
                title: null
              },
              x: {
                field: 'BPT_DATE',
                type: 'nominal',
                axis: {
                  format: 'dd-MMM',
                  formatType: 'pbiFormat',
                  labelAngle: -90,
                  labelColor: '#002060',
                  labelFontSize: 0
                },
                title: null
              },
              size: { value: 1.5 },
              color: { value: 'grey' }
            }
          },
          {
            mark: {
              type: 'tick',
              xOffset: 0,
              tooltip: true,
              opacity: { expr: "datum['_candle']" }
            },
            encoding: {
              y: {
                field: 'Open',
                type: 'quantitative',
                title: null
              },
              size: { value: 5 }
            }
          },
          {
            mark: {
              type: 'tick',
              xOffset: 0,
              tooltip: true,
              opacity: { expr: "datum['_candle']" }
            },
            encoding: {
              y: {
                field: 'Close',
                type: 'quantitative',
                title: null
              },
              size: { value: 5 }
            }
          },
          {
            mark: {
              type: 'tick',
              xOffset: -1,
              tooltip: true,
              opacity: { expr: "datum['_bar']" }
            },
            encoding: {
              y: {
                field: 'Open',
                type: 'quantitative',
                title: null
              },
              size: { value: 2.5 }
            }
          },
          {
            mark: {
              type: 'tick',
              xOffset: 1,
              tooltip: true,
              opacity: { expr: "datum['_bar']" }
            },
            encoding: {
              y: {
                field: 'Close',
                type: 'quantitative',
                title: null
              },
              size: { value: 2.5 }
            }
          },
          {
            mark: {
              type: 'text',
              align: 'left',
              size: 10,
              dy: 0,
              dx: 10
            },
            encoding: {
              text: {
                aggregate: { argmax: 'Ngày' },
                field: 'Close_lb'
              },
              x: {
                aggregate: 'max',
                type: 'nominal',
                field: 'Ngày',
                title: null
              },
              y: {
                aggregate: { argmax: 'Ngày' },
                field: 'Close',
                type: 'quantitative',
                title: null
              },
              color: {
                condition: {
                  test: "datum['Open'] < datum['Close']",
                  value: '#5EC959'
                },
                value: '#FA6E42'
              }
            }
          },
          {
            mark: { type: 'rule' },
            encoding: {
              x: {
                field: '_note_x2',
                type: 'temporal'
              },
              x2: { field: '_max_date' },
              y: {
                field: 'FIBO_618_VALUE',
                type: 'quantitative'
              },
              color: { value: '#823D97' }
            }
          },
          {
            mark: {
              type: 'rule'
            },
            encoding: {
              x: {
                field: '_note_x2',
                type: 'temporal'
              },
              x2: { field: '_max_date' },
              y: {
                field: 'FIBO_500_VALUE',
                type: 'quantitative'
              },
              color: { value: '#FFC000' }
            }
          },
          {
            mark: {
              type: 'rule'
            },
            encoding: {
              x: {
                field: '_note_x2',
                type: 'temporal'
              },
              x2: { field: '_max_date' },
              y: {
                field: 'FIBO_386_VALUE',
                type: 'quantitative'
              },
              color: { value: '#FA6E42' }
            }
          },
          {
            mark: {
              type: 'rule'
            },
            encoding: {
              x: {
                field: '_note_x2',
                type: 'temporal'
              },
              x2: { field: '_max_date' },
              y: {
                field: 'FIBO_236_VALUE',
                type: 'quantitative'
              },
              color: { value: '#FA6E42' }
            }
          },
          {
            mark: {
              type: 'rule'
            },
            encoding: {
              x: {
                field: '_note_x1',
                type: 'temporal'
              },
              x2: { field: '_max_date' },
              y: {
                field: 'FIBO_0_VALUE',
                type: 'quantitative'
              },
              color: { value: 'grey' }
            }
          },
          {
            mark: {
              type: 'rule'
            },
            encoding: {
              x: {
                field: '_note_x1',
                type: 'temporal'
              },
              x2: { field: '_max_date' },
              y: {
                field: 'FIBO_100_VALUE',
                type: 'quantitative'
              },
              color: { value: 'grey' }
            }
          },
          {
            mark: {
              type: 'text',
              align: 'left',
              size: 10,
              dy: 0,
              dx: 10
            },
            encoding: {
              text: {
                aggregate: { argmax: 'Ngày' },
                field: 'FIBO_100_VALUE_lb'
              },
              x: {
                field: '_max_date',
                title: null
              },
              y: {
                field: 'FIBO_100_VALUE',
                type: 'quantitative',
                title: null
              },
              color: { value: 'grey' }
            }
          },
          {
            mark: {
              type: 'text',
              align: 'left',
              size: 10,
              dy: 0,
              dx: 10
            },
            encoding: {
              text: {
                aggregate: { argmax: 'Ngày' },
                field: 'FIBO_0_VALUE_lb'
              },
              x: {
                field: '_max_date',
                title: null
              },
              y: {
                field: 'FIBO_0_VALUE',
                type: 'quantitative',
                title: null
              },
              color: { value: 'grey' }
            }
          },
          {
            mark: {
              type: 'text',
              align: 'left',
              size: 10,
              dy: 0,
              dx: 10
            },
            encoding: {
              text: {
                aggregate: { argmax: 'Ngày' },
                field: 'FIBO_236_VALUE_lb'
              },
              x: {
                field: '_max_date',
                title: null
              },
              y: {
                field: 'FIBO_236_VALUE',
                type: 'quantitative',
                title: null
              },
              color: { value: '#FF3271' }
            }
          },
          {
            mark: {
              type: 'text',
              align: 'left',
              size: 10,
              dy: 0,
              dx: 10
            },
            encoding: {
              text: {
                aggregate: { argmax: 'Ngày' },
                field: 'FIBO_386_VALUE_lb'
              },
              x: {
                field: '_max_date',
                title: null
              },
              y: {
                field: 'FIBO_386_VALUE',
                type: 'quantitative',
                title: null
              },
              color: { value: '#FA6E42' }
            }
          },
          {
            mark: {
              type: 'text',
              align: 'left',
              size: 10,
              dy: 0,
              dx: 10
            },
            encoding: {
              text: {
                aggregate: { argmax: 'Ngày' },
                field: 'FIBO_500_VALUE_lb'
              },
              x: {
                field: '_max_date',
                title: null
              },
              y: {
                field: 'FIBO_500_VALUE',
                type: 'quantitative',
                title: null
              },
              color: { value: '#FFC000' }
            }
          },
          {
            mark: {
              type: 'text',
              align: 'left',
              size: 10,
              dy: 0,
              dx: 10
            },
            encoding: {
              text: {
                aggregate: { argmax: 'Ngày' },
                field: 'FIBO_618_VALUE_lb'
              },
              x: {
                field: '_max_date',
                title: null
              },
              y: {
                field: 'FIBO_618_VALUE',
                type: 'quantitative',
                title: null
              },
              color: { value: '#823D97' }
            }
          },
          {
            mark: {
              type: 'line',
              interpolate: 'monotone',
              strokeDash: [6, 3],
              tooltip: true
            },
            encoding: {
              y: {
                field: 'Kháng cự phụ',
                type: 'quantitative',
                title: null
              },
              size: { value: 1 },
              color: {
                value: '#FA6E42'
              }
            }
          },
          {
            mark: {
              type: 'line',
              interpolate: 'monotone',
              tooltip: true
            },
            encoding: {
              y: {
                field: 'Kháng cự chính',
                type: 'quantitative',
                title: null
              },
              size: { value: 1 },
              color: {
                value: '#FF3271'
              }
            }
          },
          {
            mark: {
              type: 'line',
              interpolate: 'monotone',
              strokeDash: [6, 3],
              tooltip: true
            },
            encoding: {
              y: {
                field: 'Hỗ trợ phụ',
                type: 'quantitative',
                title: null
              },
              size: { value: 1 },
              color: {
                value: '#5EC959'
              }
            }
          },
          {
            mark: {
              type: 'line',
              interpolate: 'monotone',
              tooltip: true
            },
            encoding: {
              y: {
                field: 'Hỗ trợ chính',
                type: 'quantitative',
                title: null
              },
              size: { value: 1 },
              color: {
                value: '#57BED1'
              }
            }
          },
          {
            layer: [
              {
                transform: [{ filter: "datum['TAICHI_PLUS']>datum['TAICHI_MINUS']" }],
                mark: 'area',
                encoding: { color: { value: '#5EC959' } }
              },
              {
                transform: [{ filter: "datum['TAICHI_PLUS']<datum['TAICHI_MINUS']" }],
                mark: 'area',
                encoding: { color: { value: '#FA6E42' } }
              }
            ],
            encoding: {
              y: {
                field: 'TAICHI_PLUS',
                type: 'quantitative',
                title: 'Taichi',
                stack: false,
                scale: { zero: false },
                axis: {
                  labelAngle: 90,
                  labelColor: '#002060',
                  labelFontSize: 0,
                  tickCount: 0,
                  grid: false,
                  tickColor: '#F5F6FA',
                  domainColor: '#F5F6FA'
                }
              },
              y2: { field: 'TAICHI_MINUS', type: 'quantitative' },
              size: { value: 0.01 },
              opacity: { value: 0.2 }
            }
          },
          {
            mark: {
              type: 'line',
              interpolate: 'monotone',
              tooltip: true,
              opacity: 0.8
            },
            encoding: {
              y: {
                field: 'CHANNEL_LOWER_1',
                type: 'quantitative',
                title: null
              },
              size: { value: 0.5 },
              color: { value: '#57BED1' }
            }
          },
          {
            mark: {
              type: 'line',
              interpolate: 'monotone',
              tooltip: true,
              opacity: 0.8
            },
            encoding: {
              y: {
                field: 'CHANNEL_LOWER_2',
                type: 'quantitative',
                title: null
              },
              size: { value: 0.5 },
              color: { value: '#57BED1' }
            }
          },
          {
            mark: {
              type: 'area',
              interpolate: 'monotone',
              tooltip: true,
              opacity: 0.39
            },
            encoding: {
              y: {
                field: 'CHANNEL_LOWER_1',
                type: 'quantitative',
                title: null
              },
              y2: {
                field: 'CHANNEL_LOWER_2',
                title: null
              },
              color: { value: '#57BED1' }
            }
          },
          {
            mark: {
              type: 'line',
              interpolate: 'monotone',
              tooltip: true,
              opacity: 0.8
            },
            encoding: {
              y: {
                field: 'CHANNEL_UPPER_1',
                type: 'quantitative',
                title: null
              },
              size: { value: 0.5 },
              color: { value: '#57BED1' }
            }
          },
          {
            mark: {
              type: 'line',
              interpolate: 'monotone',
              tooltip: true,
              opacity: 0.8
            },
            encoding: {
              y: {
                field: 'CHANNEL_UPPER_2',
                type: 'quantitative',
                title: null
              },
              size: { value: 0.5 },
              color: { value: '#57BED1' }
            }
          },
          {
            mark: {
              type: 'area',
              interpolate: 'monotone',
              tooltip: true,
              opacity: 0.39
            },
            encoding: {
              y: {
                field: 'CHANNEL_UPPER_1',
                type: 'quantitative',
                title: null
              },
              y2: {
                field: 'CHANNEL_UPPER_2',
                title: null
              },
              color: { value: '#57BED1' }
            }
          },
          {
            mark: {
              type: 'line',
              interpolate: 'monotone',
              tooltip: true,
              opacity: 1
            },
            encoding: {
              y: {
                field: 'ST_CHANNEL_LOWER_1',
                type: 'quantitative',
                title: null
              },
              size: { value: 0.5 },
              color: { value: '#823D97' }
            }
          },
          {
            mark: {
              type: 'line',
              interpolate: 'monotone',
              tooltip: true,
              opacity: 1
            },
            encoding: {
              y: {
                field: 'ST_CHANNEL_LOWER_2',
                type: 'quantitative',
                title: null
              },
              size: { value: 0.5 },
              color: { value: '#823D97' }
            }
          },
          {
            mark: {
              type: 'area',
              interpolate: 'monotone',
              tooltip: true,
              opacity: 0.39
            },
            encoding: {
              y: {
                field: 'ST_CHANNEL_LOWER_1',
                type: 'quantitative',
                title: null
              },
              y2: {
                field: 'ST_CHANNEL_LOWER_2',
                title: null
              },
              color: { value: '#823D97' }
            }
          },
          {
            mark: {
              type: 'line',
              interpolate: 'monotone',
              tooltip: true,
              opacity: 0.8
            },
            encoding: {
              y: {
                field: 'ST_CHANNEL_UPPER_1',
                type: 'quantitative',
                title: null
              },
              size: { value: 0.5 },
              color: { value: '#823D97' }
            }
          },
          {
            mark: {
              type: 'line',
              interpolate: 'monotone',
              tooltip: true,
              opacity: 0.8
            },
            encoding: {
              y: {
                field: 'ST_CHANNEL_UPPER_2',
                type: 'quantitative',
                title: null
              },
              size: { value: 0.5 },
              color: { value: '#823D97' }
            }
          },
          {
            mark: {
              type: 'area',
              interpolate: 'monotone',
              tooltip: true,
              opacity: 0.39
            },
            encoding: {
              y: {
                field: 'ST_CHANNEL_UPPER_1',
                type: 'quantitative',
                title: null
              },
              y2: {
                field: 'ST_CHANNEL_UPPER_2',
                title: null
              },
              color: { value: '#823D97' }
            }
          },
          {
            selection: {
              range: {
                type: 'interval',
                empty: 'none',
                encodings: ['x'],
                mark: { fillOpacity: 0.0 }
              }
            },
            mark: 'area',
            encoding: {
              y: null,
              opacity: { value: 0.0 }
            }
          },
          {
            transform: [
              { filter: { selection: 'range' } },
              {
                aggregate: [
                  { op: 'argmin', field: 'Ngày', as: 'left' },
                  { op: 'argmax', field: 'Ngày', as: 'right' }
                ]
              },
              { calculate: 'datum.left.Ngày', as: 'left_date' },
              { calculate: 'datum.right.Ngày', as: 'right_date' },
              { calculate: 'datum.left.Open', as: 'left_value' },
              { calculate: 'datum.right.Close', as: 'right_value' },
              { calculate: "abs(datum['right_date']-datum['left_date'])/(1000*60*60*24)", as: 'no_day' },
              { calculate: "datum.no_day+' ngày'", as: 'no_day_fm' },
              { calculate: "timeOffset('day',datum['left_date'],datum['no_day']/2)", as: 'note_date' },
              { calculate: "(datum['right_value']+datum['left_value'])/2", as: 'note_value' },
              { calculate: "(datum['right_value']-datum['left_value'])/datum['left_value']", as: 'change' },
              {
                calculate: "datum['right_value']>datum['left_value']?datum['right_value']:datum['left_value']",
                as: 'max_value'
              },
              {
                calculate: "datum['right_value']<datum['left_value']?datum['right_value']:datum['left_value']",
                as: 'min_value'
              },
              {
                calculate: "(datum['right_value']-datum['left_value'])+datum['right_value']",
                as: 'target_value'
              },
              { calculate: "'Giá mục tiêu:'+format(datum.target_value,',.1f')", as: 'target_value_fm' },
              {
                calculate: "(datum['target_value']-datum['right_value'])/datum['right_value']",
                as: 'target_change'
              },
              { calculate: "(datum['right_value']+datum['target_value'])/2", as: 'note_targetperc' },
              { calculate: "datum['change']<0?'#FA6E42':'#5EC959'", as: 'target_color' },
              { calculate: "(datum['change']*0.386+1)*datum['left_value']", as: 'Fibo_386' },
              { calculate: "'Fibo Re 38.6:'+format(datum.Fibo_386,',.1f')", as: 'Fibo_386_fm' },
              { calculate: "(datum['change']*0.618+1)*datum['left_value']", as: 'Fibo_618' },
              { calculate: "'Fibo Re 61.8:'+format(datum.Fibo_618,',.1f')", as: 'Fibo_618_fm' }
            ],
            layer: [
              {
                mark: {
                  type: 'rect',
                  fill: '#002060',
                  fillOpacity: 0.05,
                  strokeWidth: 1,
                  stroke: '#002060',
                  opacity: 1,
                  strokeOpacity: 1,
                  tooltip: null
                },
                encoding: {
                  x: { field: 'left_date', type: 'temporal' },
                  x2: { field: 'right_date', type: 'temporal' },
                  y: { field: 'left_value', type: 'quantitative' },
                  y2: { field: 'right_value', type: 'quantitative' }
                }
              },
              {
                mark: { type: 'rule', stroke: 'grey', opacity: 0, size: 2 },
                encoding: { x: null, y: { field: 'left_value', type: 'quantitative' } }
              },
              {
                mark: { type: 'rule', stroke: '#002060', opacity: 1, size: 2, yOffset: 20 },
                encoding: {
                  x: { field: 'left_date', type: 'temporal' },
                  x2: { field: 'right_date', type: 'temporal' },
                  y: { field: 'min_value', type: 'quantitative' }
                }
              },
              {
                mark: { type: 'rule', stroke: '#002060', opacity: 1, size: 2, xOffset: 20 },
                encoding: {
                  x: { field: 'right_date', type: 'temporal' },
                  y: { field: 'left_value', type: 'quantitative' },
                  y2: { field: 'right_value', type: 'quantitative' }
                }
              },
              {
                mark: { type: 'point', shape: 'triangle-left', opacity: 1, size: 100, xOffset: 3, yOffset: 20 },
                encoding: {
                  x: { field: 'left_date', type: 'temporal' },
                  y: { field: 'min_value', type: 'quantitative' },
                  color: { value: '#002060' }
                }
              },
              {
                mark: { type: 'point', shape: 'triangle-up', opacity: 1, size: 100, xOffset: 20, yOffset: 3 },
                encoding: {
                  x: { field: 'right_date', type: 'temporal' },
                  y: { field: 'max_value', type: 'quantitative' },
                  color: { value: '#002060' }
                }
              },
              {
                mark: { type: 'point', shape: 'triangle-down', opacity: 1, size: 100, xOffset: 20, yOffset: -3 },
                encoding: {
                  x: { field: 'right_date', type: 'temporal' },
                  y: { field: 'min_value', type: 'quantitative' },
                  color: { value: '#002060' }
                }
              },
              {
                mark: {
                  type: 'text',
                  fontSize: _fontsize_norm,
                  dx: -20,
                  dy: 20,
                  strokeWidth: 5,
                  stroke: 'white'
                },
                encoding: {
                  x: { field: 'right_date' },
                  y: { field: 'min_value', type: 'quantitative' },
                  text: { field: 'no_day_fm' },
                  color: { value: '#002060' }
                }
              },
              {
                mark: { type: 'text', fontSize: _fontsize_norm, dx: -20, dy: 20 },
                encoding: {
                  x: { field: 'right_date' },
                  y: { field: 'min_value', type: 'quantitative' },
                  text: { field: 'no_day_fm' },
                  color: { value: '#002060' }
                }
              },
              {
                mark: { type: 'text', fontSize: _fontsize_norm, dx: 20, dy: 0, strokeWidth: 5, stroke: 'white' },
                encoding: {
                  x: { field: 'right_date' },
                  y: { field: 'note_value', type: 'quantitative' },
                  text: { field: 'change', format: ',.1%' },
                  color: { value: '#002060' }
                }
              },
              {
                mark: { type: 'text', fontSize: _fontsize_norm, dx: 20, dy: 0 },
                encoding: {
                  x: { field: 'right_date' },
                  y: { field: 'note_value', type: 'quantitative' },
                  text: { field: 'change', format: ',.1%' },
                  color: { value: '#002060' }
                }
              },
              {
                mark: {
                  type: 'rule',
                  stroke: { expr: "datum['target_color']" },
                  opacity: 1,
                  size: 2,
                  xOffset: 20
                },
                encoding: {
                  x: { field: 'right_date', type: 'temporal' },
                  y: { field: 'right_value', type: 'quantitative' },
                  y2: { field: 'target_value', type: 'quantitative' }
                }
              },
              {
                mark: { type: 'point', shape: 'circle', opacity: 1, size: 60, xOffset: 20, yOffset: 0 },
                encoding: {
                  x: { field: 'right_date', type: 'temporal' },
                  y: { field: 'target_value', type: 'quantitative' },
                  color: { condition: { test: "datum['change']>0", value: '#5EC959' }, value: '#FA6E42' }
                }
              },
              {
                mark: { type: 'text', fontSize: _fontsize_norm, dx: 20, dy: 0, strokeWidth: 5, stroke: 'white' },
                encoding: {
                  x: { field: 'right_date' },
                  y: { field: 'note_targetperc', type: 'quantitative' },
                  text: { field: 'target_change', format: ',.1%' },
                  color: { value: '#002060' }
                }
              },
              {
                mark: { type: 'text', fontSize: _fontsize_norm, dx: 20, dy: 0 },
                encoding: {
                  x: { field: 'right_date' },
                  y: { field: 'note_targetperc', type: 'quantitative' },
                  text: { field: 'target_change', format: ',.1%' },
                  color: { condition: { test: "datum['change']>0", value: '#5EC959' }, value: '#FA6E42' }
                }
              },
              {
                mark: { type: 'text', fontSize: _fontsize_norm, dx: -35, dy: 0, strokeWidth: 5, stroke: 'white' },
                encoding: {
                  x: { field: 'right_date' },
                  y: { field: 'target_value', type: 'quantitative' },
                  text: { field: 'target_value_fm' },
                  color: { value: '#002060' }
                }
              },
              {
                mark: { type: 'text', fontSize: _fontsize_norm, dx: -35, dy: 0 },
                encoding: {
                  x: { field: 'right_date' },
                  y: { field: 'target_value', type: 'quantitative' },
                  text: { field: 'target_value_fm' },
                  color: { condition: { test: "datum['change']>0", value: '#5EC959' }, value: '#FA6E42' }
                }
              },
              {
                mark: { type: 'line', interpolate: 'monotone', tooltip: true, strokeDash: [6, 3] },
                encoding: {
                  x: { field: 'left_date', type: 'temporal' },
                  x2: { field: 'right_date', type: 'temporal' },
                  y: { field: 'Fibo_386', type: 'quantitative' },
                  color: { value: 'white' },
                  size: { value: 5 }
                }
              },
              {
                mark: { type: 'line', interpolate: 'monotone', tooltip: true, strokeDash: [6, 3] },
                encoding: {
                  x: { field: 'left_date', type: 'temporal' },
                  x2: { field: 'right_date', type: 'temporal' },
                  y: { field: 'Fibo_386', type: 'quantitative' },
                  color: { value: '#5EC959' },
                  size: { value: 2 }
                }
              },
              {
                mark: { type: 'text', fontSize: _fontsize_norm, dx: -50, dy: 0, strokeWidth: 5, stroke: 'white' },
                encoding: {
                  x: { field: 'left_date' },
                  y: { field: 'Fibo_386', type: 'quantitative' },
                  text: { field: 'Fibo_386_fm' },
                  color: { value: '#5EC959' }
                }
              },
              {
                mark: { type: 'text', fontSize: _fontsize_norm, dx: -50, dy: 0 },
                encoding: {
                  x: { field: 'left_date' },
                  y: { field: 'Fibo_386', type: 'quantitative' },
                  text: { field: 'Fibo_386_fm' },
                  color: { value: '#5EC959' }
                }
              },
              {
                mark: { type: 'line', interpolate: 'monotone', tooltip: true, strokeDash: [6, 3] },
                encoding: {
                  x: { field: 'left_date', type: 'temporal' },
                  x2: { field: 'right_date', type: 'temporal' },
                  y: { field: 'Fibo_618', type: 'quantitative' },
                  color: { value: 'white' },
                  size: { value: 5 }
                }
              },
              {
                mark: { type: 'line', interpolate: 'monotone', tooltip: true, strokeDash: [6, 3] },
                encoding: {
                  x: { field: 'left_date', type: 'temporal' },
                  x2: { field: 'right_date', type: 'temporal' },
                  y: { field: 'Fibo_618', type: 'quantitative' },
                  color: { value: '#823D97' },
                  size: { value: 2 }
                }
              },
              {
                mark: { type: 'text', fontSize: _fontsize_norm, dx: -50, dy: 0, strokeWidth: 5, stroke: 'white' },
                encoding: {
                  x: { field: 'left_date' },
                  y: { field: 'Fibo_618', type: 'quantitative' },
                  text: { field: 'Fibo_618_fm' },
                  color: { value: '#823D97' }
                }
              },
              {
                mark: { type: 'text', fontSize: _fontsize_norm, dx: -50, dy: 0 },
                encoding: {
                  x: { field: 'left_date' },
                  y: { field: 'Fibo_618', type: 'quantitative' },
                  text: { field: 'Fibo_618_fm' },
                  color: { value: '#823D97' }
                }
              }
            ]
          },
          {
            mark: 'rule',
            encoding: {
              opacity: {
                condition: { value: 0.3, param: 'hover', empty: false },
                value: 0
              },
              tooltip: [
                { field: 'Ngày', type: 'temporal' },
                { field: 'Thay đổi %', type: 'quantitative', format: ',.1%' },
                { field: 'Open', type: 'quantitative', format: ',.1f' },
                { field: 'Close', type: 'quantitative', format: ',.1f' },
                { field: 'High', type: 'quantitative', format: ',.1f' },
                { field: 'Low', type: 'quantitative', format: ',.1f' },
                { field: 'Kháng cự chính', type: 'quantitative', format: ',.1f' },
                { field: 'Kháng cự phụ', type: 'quantitative', format: ',.1f' },
                { field: 'Hỗ trợ chính', type: 'quantitative', format: ',.1f' },
                { field: 'Hỗ trợ phụ', type: 'quantitative', format: ',.1f' }
              ]
            },
            params: [
              {
                name: 'hover',
                select: {
                  type: 'point',
                  fields: ['Ngày'],
                  nearest: true,
                  on: 'mouseover',
                  clear: 'mouseout'
                }
              }
            ]
          }
        ]
      },
      {
        width: _width,
        height: _heigh_tim,
        transform: [{ filter: { param: 'brush' } }],
        title: '',
        encoding: {
          x: {
            field: 'Ngày',
            type: 'temporal',
            axis: {
              format: 'dd-MMM',
              formatType: 'pbiFormat',
              labelAngle: 0,
              labelColor: '#002060',
              labelFontSize: 8,
              tickColor: '#F5F6FA',
              domainColor: '#F5F6FA'
            },
            title: null
          },
          color: {
            value: '#823D97'
          }
        },
        layer: [
          {
            mark: {
              type: 'line',
              interpolate: 'monotone',
              tooltip: true
            },
            encoding: {
              y: {
                field: 'Close',
                type: 'quantitative',
                title: null,
                axis: {
                  labelAngle: 90,
                  labelColor: '#002060',
                  labelFontSize: 0,
                  tickCount: 0,
                  grid: false,
                  tickColor: '#F5F6FA',
                  domainColor: '#F5F6FA'
                }
              },
              size: { value: 2 },
              color: {
                value: 'white'
              }
            }
          }
        ]
      },
      {
        title: '',
        transform: [{ filter: { param: 'brush' } }],
        width: _width,
        height: _heigh_vol,
        encoding: {
          x: {
            field: 'Ngày',
            type: 'nominal',
            axis: null,
            title: null
          }
        },
        layer: [
          {
            mark: {
              type: 'bar',
              tooltip: true
            },
            encoding: {
              y: {
                field: 'Khối lượng',
                type: 'quantitative',
                title: 'Khối lượng',
                axis: {
                  labelAngle: 0,
                  labelColor: '#002060',
                  labelFontSize: 0,
                  tickCount: 0,
                  grid: false
                }
              },
              size: { value: 4 },
              color: {
                value: '#FA6E42'
              }
            }
          },
          {
            mark: {
              type: 'bar',
              tooltip: true
            },
            encoding: {
              y: {
                field: 'Bull_Vol',
                type: 'quantitative',
                title: 'Khối lượng',
                axis: {
                  labelAngle: 0,
                  labelColor: '#002060',
                  labelFontSize: 0,
                  tickCount: 0,
                  grid: false
                }
              },
              size: { value: 4 },
              color: {
                value: '#5EC959'
              }
            }
          },
          {
            mark: {
              type: 'area',
              interpolate: 'monotone',
              tooltip: true
            },
            encoding: {
              y: {
                field: 'KL TB20',
                type: 'quantitative',
                title: 'Khối lượng'
              },
              size: { value: 1 },
              color: {
                value: '#00B0F0'
              },
              opacity: { value: 0.1 }
            }
          },
          {
            mark: {
              type: 'line',
              interpolate: 'monotone',
              tooltip: true
            },
            encoding: {
              y: {
                field: 'KL TB20',
                type: 'quantitative',
                title: null,
                axis: null
              },
              size: { value: 1 },
              color: {
                value: '#00B0F0'
              },
              opacity: { value: 0.5 }
            }
          },
          {
            mark: 'rule',
            encoding: {
              opacity: {
                condition: { value: 0.3, param: 'hover', empty: false },
                value: 0
              },
              tooltip: [
                { field: 'Ngày', type: 'temporal' },
                { field: 'Khối lượng', type: 'quantitative', format: ',.1f' },
                { field: 'KL TB20', type: 'quantitative', format: ',.1f' }
              ]
            },
            params: [
              {
                name: 'hover',
                select: {
                  type: 'point',
                  fields: ['Ngày'],
                  nearest: true,
                  on: 'mouseover',
                  clear: 'mouseout'
                }
              }
            ]
          }
        ]
      },
      {
        width: _width,
        height: _heigh_mon,
        transform: [
          { filter: { param: 'brush' } },
          { calculate: '30', as: '_lower' },
          { calculate: '70', as: '_upper' }
        ],
        title: '',
        encoding: {
          x: {
            field: 'Ngày',
            type: 'nominal',
            axis: null,
            title: null
          },
          color: {
            value: '#823D97'
          }
        },
        layer: [
          {
            mark: {
              type: 'line',
              interpolate: 'monotone',
              tooltip: true
            },
            encoding: {
              y: {
                field: 'Money Flow',
                type: 'quantitative',
                title: 'Dòng tiền',
                axis: {
                  labelAngle: 90,
                  labelColor: '#002060',
                  labelFontSize: 0,
                  tickCount: 0,
                  grid: false
                }
              },
              size: { value: 2 },
              color: {
                value: '#823D97'
              }
            }
          },
          {
            mark: {
              type: 'circle',
              size: 39
            },
            encoding: {
              x: {
                aggregate: 'max',
                type: 'nominal',
                field: 'Ngày',
                title: null
              },
              y: {
                aggregate: { argmax: 'Ngày' },
                field: 'Money Flow',
                type: 'quantitative'
              },
              color: { value: '#823D97' }
            }
          },
          {
            mark: {
              type: 'text',
              align: 'left',
              size: _fontsize_norm,
              dy: 0,
              dx: 10
            },
            encoding: {
              text: {
                aggregate: { argmax: 'Ngày' },
                field: 'Money Flow',
                type: 'quantitative',
                formatType: 'pbiFormat',
                format: '#,#'
              },
              x: {
                aggregate: 'max',
                type: 'nominal',
                field: 'Ngày',
                title: null
              },
              y: {
                aggregate: { argmax: 'Ngày' },
                field: 'Money Flow',
                type: 'quantitative'
              },
              color: { value: '#823D97' }
            }
          },
          {
            mark: {
              type: 'line',
              interpolate: 'monotone',
              tooltip: true,
              strokeDash: [6, 3]
            },
            encoding: {
              y: {
                field: '_lower',
                type: 'quantitative',
                title: 'Dòng tiền',
                axis: {
                  labelAngle: 90,
                  labelColor: '#002060',
                  labelFontSize: 0,
                  tickCount: 0,
                  grid: false
                }
              },
              size: { value: 1 },
              color: {
                value: '#5EC959'
              }
            }
          },
          {
            mark: {
              type: 'line',
              interpolate: 'monotone',
              tooltip: true,
              strokeDash: [6, 3]
            },
            encoding: {
              y: {
                field: '_upper',
                type: 'quantitative',
                title: null,
                axis: null
              },
              size: { value: 1 },
              color: {
                value: '#FA6E42'
              }
            }
          },
          {
            mark: 'rule',
            encoding: {
              opacity: {
                condition: { value: 0.3, param: 'hover', empty: false },
                value: 0
              },
              tooltip: [
                { field: 'Ngày', type: 'temporal' },
                { field: 'Money Flow', type: 'quantitative' }
              ]
            },
            params: [
              {
                name: 'hover',
                select: {
                  type: 'point',
                  fields: ['Ngày'],
                  nearest: true,
                  on: 'mouseover',
                  clear: 'mouseout'
                }
              }
            ]
          }
        ]
      },
      {
        width: _width,
        height: _heigh_adx,
        transform: [{ filter: { param: 'brush' } }, { calculate: '25', as: '_axis0' }],
        title: '',
        encoding: {
          x: { field: 'Ngày', type: 'nominal', axis: null, title: null },
          color: { condition: { test: "datum['DIPlus']<datum['DIMinus']", value: '#FA6E42' }, value: '#5EC959' }
        },
        layer: [
          {
            mark: { type: 'bar', tooltip: true },
            encoding: {
              y: {
                field: 'DIMinus',
                type: 'quantitative',
                title: 'Xuhướng',
                axis: { labelAngle: 90, labelColor: '#002060', labelFontSize: 0, tickCount: 0, grid: false }
              },
              y2: { field: 'DIPlus', type: 'quantitative' }
            }
          },
          {
            mark: { type: 'line', interpolate: 'monotone', tooltip: true },
            encoding: {
              y: {
                field: 'ADX',
                type: 'quantitative',
                title: 'Xuhướng',
                axis: { labelAngle: 90, labelColor: '#002060', labelFontSize: 0, tickCount: 0, grid: false }
              },
              size: { value: 2 },
              color: { value: '#823D97' }
            }
          },
          {
            mark: { type: 'circle', size: 39 },
            encoding: {
              x: { aggregate: 'max', type: 'nominal', field: 'Ngày', title: null },
              y: { aggregate: { argmax: 'Ngày' }, field: 'ADX', type: 'quantitative' },
              color: { value: '#823D97' }
            }
          },
          {
            mark: { type: 'text', align: 'left', size: _fontsize_norm, dy: 0, dx: 10 },
            encoding: {
              text: {
                aggregate: { argmax: 'Ngày' },
                field: 'ADX',
                type: 'quantitative',
                formatType: 'pbiFormat',
                format: '#,#'
              },
              x: { aggregate: 'max', type: 'nominal', field: 'Ngày', title: null },
              y: { aggregate: { argmax: 'Ngày' }, field: 'ADX', type: 'quantitative' },
              color: { value: '#823D97' }
            }
          },
          {
            mark: { type: 'line', interpolate: 'monotone', tooltip: true, strokeDash: [6, 3] },
            encoding: {
              y: { field: '_axis0', type: 'quantitative', title: null, axis: null },
              size: { value: 1 },
              color: { value: '#FFC000' }
            }
          },
          {
            mark: 'rule',
            encoding: {
              opacity: { condition: { value: 0.3, param: 'hover', empty: false }, value: 0 },
              tooltip: [
                { field: 'Ngày', type: 'temporal' },
                { field: 'ADX', type: 'quantitative' }
              ]
            },
            params: [
              {
                name: 'hover',
                select: { type: 'point', fields: ['Ngày'], nearest: true, on: 'mouseover', clear: 'mouseout' }
              }
            ]
          }
        ]
      },
      {
        width: _width,
        height: _heigh_ren,
        transform: [{ filter: { param: 'brush' } }],
        title: '',
        encoding: {
          x: {
            field: 'Ngày',
            type: 'nominal',
            axis: null,
            title: null
          },
          color: {
            condition: [
              { test: 'datum.RENKO_COLOR === 29', value: 'blue' },
              { test: 'datum.RENKO_COLOR === 4', value: '#FA6E42' }
            ],
            value: '#5EC959'
          }
        },
        layer: [
          {
            mark: {
              type: 'bar',
              tooltip: true
            },
            encoding: {
              y: {
                field: 'RENKO_O',
                type: 'quantitative',
                title: 'Đảo chiều',
                axis: {
                  labelAngle: 90,
                  labelColor: '#002060',
                  labelFontSize: 0,
                  tickCount: 0,
                  grid: false
                }
              },
              y2: {
                field: 'RENKO_C',
                type: 'quantitative'
              },
              size: { value: 6 }
            }
          },
          {
            mark: {
              type: 'line',
              interpolate: 'monotone',
              tooltip: true
            },
            encoding: {
              y: {
                field: 'RENKO_RES',
                type: 'quantitative',
                title: 'Đảo chiều',
                axis: {
                  labelAngle: 90,
                  labelColor: '#002060',
                  labelFontSize: 0,
                  tickCount: 0,
                  grid: false
                }
              },
              size: { value: 1 },
              color: {
                value: '#FF3271'
              }
            }
          },
          {
            mark: {
              type: 'line',
              interpolate: 'monotone',
              tooltip: true
            },
            encoding: {
              y: {
                field: 'RENKO_SUP',
                type: 'quantitative',
                title: null,
                axis: null
              },
              size: { value: 1 },
              color: {
                value: '#57BED1'
              }
            }
          },
          {
            mark: 'rule',
            encoding: {
              opacity: {
                condition: { value: 0.3, param: 'hover', empty: false },
                value: 0
              },
              tooltip: [{ field: 'Ngày', type: 'temporal' }]
            },
            params: [
              {
                name: 'hover',
                select: {
                  type: 'point',
                  fields: ['Ngày'],
                  nearest: true,
                  on: 'mouseover',
                  clear: 'mouseout'
                }
              }
            ]
          }
        ]
      },
      {
        width: _width,
        height: _heigh_bru,
        encoding: {
          x: {
            field: 'Ngày',
            type: 'temporal',
            axis: {
              format: 'dd-MMM-yy',
              formatType: 'pbiFormat',
              labelAngle: 0,
              labelColor: '#002060',
              labelFontSize: 8,
              grid: false
            },
            title: null
          }
        },
        layer: [
          {
            mark: { type: 'line' },
            selection: { brush: { type: 'interval', encodings: ['x'], init: { x: initX } } },
            encoding: {
              y: { field: 'Close', type: 'quantitative', title: null, scale: { zero: false }, axis: null },
              x: {
                field: 'Ngày',
                axis: {
                  orient: 'top',
                  labelAngle: 0,
                  labelColor: '#002060',
                  labelPadding: 0,
                  labelFontSize: _fontsize_norm,
                  grid: false,
                  tickColor: '#F5F6FA',
                  domainColor: '#F5F6FA',
                  title: 'Kéo chọn vùng thời gian',
                  titleColor: '#002060'
                },
                type: 'temporal'
              },
              opacity: { value: 0.3 }
            }
          }
        ]
      }
    ],
    config: {
      view: { stroke: '#F5F6FA' },
      axis: { grid: false }
    }
  };

  return <VegaWrapper $width={_width} spec={vegaLiteSpec as any} renderer={'svg'} actions={false}></VegaWrapper>;
};
