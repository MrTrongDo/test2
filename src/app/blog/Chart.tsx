'use client';
import React from 'react';
import { Vega, VisualizationSpec } from 'react-vega';
type Props = {
  data: {
    data: any;
    _width: number;
    _max: number;
  };
};
const Chart = (props: Props) => {
  const { data, _max, _width } = props.data;

  const vegaLiteSpec: VisualizationSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: { values: data },
    transform: [
      { calculate: '360-90', as: 'PoorStartDegrees' },
      { calculate: '30', as: 'Min' },
      { calculate: '70', as: 'Max' },
      {
        calculate: "datum['PoorStartDegrees']+(180*datum['Min']/100)",
        as: 'AverageStartDegrees'
      },
      {
        calculate: "datum['PoorStartDegrees']+(180*datum['Max']/100)",
        as: 'AverageEndDegrees'
      },
      { calculate: '360+90', as: 'GoodEndDegrees' },
      {
        calculate: "2*PI*(datum['PoorStartDegrees']/360)",
        as: 'PoorStartRadians'
      },
      {
        calculate: "datum['PoorStartRadians']+(PI*(datum['Min']/100))",
        as: 'AverageStartRadians'
      },
      {
        calculate: "datum['PoorStartRadians']+(PI*(datum['Max']/100))",
        as: 'AverageEndRadians'
      },
      {
        calculate: "2*PI*(datum['GoodEndDegrees']/360)",
        as: 'GoodEndRadians'
      },
      {
        calculate: "datum['PoorStartRadians']+PI*((datum['ActiveBuy']-0.5)/100)",
        as: 'NeedleStartRadians'
      },
      {
        calculate: "datum['PoorStartRadians']+PI*((datum['ActiveBuy']+0.5)/100)",
        as: 'NeedleEndRadians'
      },
      { calculate: "datum['ActiveBuy']/100", as: 'NeedlePercent2' }
    ],
    params: [
      { name: 'ring_max', value: _width },
      { name: 'ring_width', value: _max },
      { name: 'ring_gap', value: 1 },
      { name: 'ring0_color', value: '#FFFFFF' },
      { name: 'ring0_percent', value: 80 },
      { name: 'ring0_outer', expr: 'ring_max+2' },
      { name: 'ring0_inner', expr: 'ring_max+1' },
      { name: 'ring1_outer', expr: 'ring0_inner-ring_gap' },
      { name: 'ring1_inner', expr: 'ring1_outer-ring_width' },
      { name: 'ring1_middle', expr: '(ring1_outer+ring1_inner)/2' }
    ],
    layer: [
      {
        mark: {
          type: 'arc',
          radius: { expr: 'ring1_outer' },
          radius2: { expr: 'ring1_inner' },
          theta: { expr: "datum['PoorStartRadians']" },
          theta2: { expr: "datum['AverageStartRadians']" }
        },
        encoding: { color: { value: 'red' } }
      },
      {
        mark: {
          type: 'arc',
          radius: { expr: 'ring1_outer' },
          radius2: { expr: 'ring1_inner' },
          theta: { expr: "datum['AverageStartRadians']" },
          theta2: { expr: "datum['AverageEndRadians']" },
          padAngle: { expr: '2*PI*0.01' }
        },
        encoding: { color: { value: '#FFBF00' } }
      },
      {
        mark: {
          type: 'arc',
          radius: { expr: 'ring1_outer' },
          radius2: { expr: 'ring1_inner' },
          theta: { expr: "datum['AverageEndRadians']" },
          theta2: { expr: "datum['GoodEndRadians']" }
        },
        encoding: { color: { value: 'green' } }
      },
      {
        mark: {
          type: 'arc',
          radius: { expr: 'ring1_outer' },
          radius2: 0,
          theta: { expr: "datum['NeedleStartRadians']" },
          theta2: { expr: "datum['NeedleEndRadians']" }
        },
        encoding: { color: { value: 'black' } }
      },
      {
        mark: {
          type: 'text',
          fontSize: 14,
          align: 'center',
          dy: 5,
          color: 'black'
        },
        encoding: { text: { field: 'NeedlePercent2', format: ',.1%' } }
      }
    ]
  };

  return <Vega spec={vegaLiteSpec} renderer={'svg'} actions={false}></Vega>;
};

export default Chart;
