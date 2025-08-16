import { useMemo } from 'react';
import styles from './ClampChart.module.scss';
import { formatNumber } from '../utils/clampUtils';

/**
 * ClampChart Component
 * Visualizes how clamp values change across different screen sizes
 */
const ClampChart = ({ formData, outputs }) => {
  const chartData = useMemo(() => {
    if (!formData || !outputs.breakpointTable || outputs.breakpointTable.length === 0) {
      return null;
    }

    const {
      outputUnit,
      rootFontSize,
      minSize,
      maxSize,
      minScreenWidth,
      maxScreenWidth
    } = formData;

    // Convert to numbers
    const minSizeNum = parseFloat(minSize);
    const maxSizeNum = parseFloat(maxSize);
    const minScreenNum = parseFloat(minScreenWidth);
    const maxScreenNum = parseFloat(maxScreenWidth);
    const rootSizeNum = parseFloat(rootFontSize);

    // Calculate slope and intercept
    const slope = (maxSizeNum - minSizeNum) / (maxScreenNum - minScreenNum);
    const intercept = minSizeNum - (slope * minScreenNum);

    // Generate data points for smooth curve
    const dataPoints = [];
    const screenRange = maxScreenNum - minScreenNum;
    const stepSize = Math.max(10, screenRange / 100); // At least 100 points for smooth curve

    for (let screen = 200; screen <= maxScreenNum + 200; screen += stepSize) {
      let value;
      let status;
      
      if (screen <= minScreenNum) {
        value = minSizeNum;
        status = 'min';
      } else if (screen >= maxScreenNum) {
        value = maxSizeNum;
        status = 'max';
      } else {
        value = slope * screen + intercept;
        status = 'fluid';
      }

      // Convert to display unit
      const displayValue = outputUnit === 'rem' ? value / rootSizeNum : value;

      dataPoints.push({
        screen,
        value: displayValue,
        originalValue: value,
        status
      });
    }

    // Chart dimensions and scaling
    const chartWidth = 600;
    const chartHeight = 300;
    const padding = { top: 20, right: 40, bottom: 40, left: 60 };
    const plotWidth = chartWidth - padding.left - padding.right;
    const plotHeight = chartHeight - padding.top - padding.bottom;

    // Find min/max for scaling
    const minScreen = Math.min(...dataPoints.map(d => d.screen));
    const maxScreen = Math.max(...dataPoints.map(d => d.screen));
    const minValue = Math.min(...dataPoints.map(d => d.value));
    const maxValue = Math.max(...dataPoints.map(d => d.value));

    // Add some padding to the value range
    const valueRange = maxValue - minValue;
    const valuePadding = valueRange * 0.1;
    const scaledMinValue = minValue - valuePadding;
    const scaledMaxValue = maxValue + valuePadding;

    // Scale functions
    const scaleX = (screen) => ((screen - minScreen) / (maxScreen - minScreen)) * plotWidth;
    const scaleY = (value) => plotHeight - ((value - scaledMinValue) / (scaledMaxValue - scaledMinValue)) * plotHeight;

    // Generate SVG path
    const pathData = dataPoints.map((point, index) => {
      const x = scaleX(point.screen);
      const y = scaleY(point.value);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    // Generate grid lines
    const xGridLines = [];
    const yGridLines = [];
    
    // X-axis grid lines (every 200px)
    for (let screen = Math.ceil(minScreen / 200) * 200; screen <= maxScreen; screen += 200) {
      const x = scaleX(screen);
      xGridLines.push({
        x1: x,
        y1: 0,
        x2: x,
        y2: plotHeight,
        label: `${screen}px`,
        labelX: x,
        labelY: plotHeight + 15
      });
    }

    // Y-axis grid lines
    const valueStep = (scaledMaxValue - scaledMinValue) / 6;
    for (let i = 0; i <= 6; i++) {
      const value = scaledMinValue + (valueStep * i);
      const y = scaleY(value);
      yGridLines.push({
        x1: 0,
        y1: y,
        x2: plotWidth,
        y2: y,
        label: `${value.toFixed(1)}${outputUnit}`,
        labelX: -10,
        labelY: y + 4
      });
    }

    // Breakpoint markers
    const breakpointMarkers = outputs.breakpointTable.map(bp => {
      const x = scaleX(bp.width);
      const y = scaleY(parseFloat(bp.computedValue));
      return {
        x,
        y,
        width: bp.width,
        value: bp.computedValue,
        status: bp.status,
        name: bp.name,
        device: bp.device,
        id: bp.id
      };
    });

    // Key points (min/max boundaries)
    const keyPoints = [
      {
        x: scaleX(minScreenNum),
        y: scaleY(outputUnit === 'rem' ? minSizeNum / rootSizeNum : minSizeNum),
        label: `Min: ${minScreenNum}px`,
        type: 'min',
        screen: minScreenNum,
        value: outputUnit === 'rem' ? minSizeNum / rootSizeNum : minSizeNum
      },
      {
        x: scaleX(maxScreenNum),
        y: scaleY(outputUnit === 'rem' ? maxSizeNum / rootSizeNum : maxSizeNum),
        label: `Max: ${maxScreenNum}px`,
        type: 'max',
        screen: maxScreenNum,
        value: outputUnit === 'rem' ? maxSizeNum / rootSizeNum : maxSizeNum
      }
    ];

    return {
      chartWidth,
      chartHeight,
      padding,
      plotWidth,
      plotHeight,
      pathData,
      xGridLines,
      yGridLines,
      breakpointMarkers,
      keyPoints,
      dataPoints,
      minScreen,
      maxScreen,
      scaledMinValue,
      scaledMaxValue,
      scaleX,
      scaleY
    };
  }, [formData, outputs]);

  if (!chartData) {
    return null;
  }

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>Clamp Value Visualization</h3>
      </div>
      
      <div className={styles.chartWrapper}>
        <svg
          width={chartData.chartWidth}
          height={chartData.chartHeight}
          viewBox={`0 0 ${chartData.chartWidth} ${chartData.chartHeight}`}
          className={styles.chart}
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--error)" />
              <stop offset="30%" stopColor="var(--accent-primary)" />
              <stop offset="70%" stopColor="var(--accent-primary)" />
              <stop offset="100%" stopColor="var(--success)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Chart area */}
          <g transform={`translate(${chartData.padding.left}, ${chartData.padding.top})`}>
            
            {/* Grid lines */}
            <g className={styles.gridLines}>
              {chartData.xGridLines.map((line, index) => (
                <g key={`x-grid-${index}`}>
                  <line
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    className={styles.gridLine}
                  />
                  <text
                    x={line.labelX}
                    y={line.labelY}
                    className={styles.gridLabel}
                    textAnchor="middle"
                  >
                    {line.label}
                  </text>
                </g>
              ))}
              
              {chartData.yGridLines.map((line, index) => (
                <g key={`y-grid-${index}`}>
                  <line
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    className={styles.gridLine}
                  />
                  <text
                    x={line.labelX}
                    y={line.labelY}
                    className={styles.gridLabel}
                    textAnchor="end"
                  >
                    {line.label}
                  </text>
                </g>
              ))}
            </g>

            {/* Main curve */}
            <path
              d={chartData.pathData}
              className={styles.mainCurve}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              filter="url(#glow)"
            />

            {/* Key boundary points */}
            {chartData.keyPoints.map((point, index) => (
              <g key={`key-point-${index}`}>
                <line
                  x1={point.x}
                  y1={point.y}
                  x2={point.x}
                  y2={chartData.plotHeight}
                  className={`${styles.keyLine} ${styles[`keyLine${point.type}`]}`}
                  strokeDasharray="4,4"
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  className={`${styles.keyPoint} ${styles[`keyPoint${point.type}`]}`}
                />
                <text
                  x={point.x}
                  y={point.y - 12}
                  className={`${styles.keyLabel} ${styles[`keyLabel${point.type}`]}`}
                  textAnchor="middle"
                >
                  {point.label}
                </text>
              </g>
            ))}

            {/* Breakpoint markers */}
            {chartData.breakpointMarkers.map((marker, index) => (
              <g key={`marker-${index}`} className={styles.breakpointMarker}>
                <circle
                  cx={marker.x}
                  cy={marker.y}
                  r="4"
                  className={`${styles.markerPoint} ${styles[`marker${marker.status}`]}`}
                />
                <title>
                  {marker.device}: {marker.width}px → {marker.value}{formData.outputUnit}
                </title>
              </g>
            ))}

            {/* Axes */}
            <line
              x1="0"
              y1={chartData.plotHeight}
              x2={chartData.plotWidth}
              y2={chartData.plotHeight}
              className={styles.axis}
            />
            <line
              x1="0"
              y1="0"
              x2="0"
              y2={chartData.plotHeight}
              className={styles.axis}
            />

            {/* Axis labels */}
            <text
              x={chartData.plotWidth / 2}
              y={chartData.plotHeight + 35}
              className={styles.axisLabel}
              textAnchor="middle"
            >
              Screen Width (px)
            </text>
            <text
              x="-35"
              y={chartData.plotHeight / 2}
              className={styles.axisLabel}
              textAnchor="middle"
              transform={`rotate(-90, -35, ${chartData.plotHeight / 2})`}
            >
              Value ({formData.outputUnit})
            </text>
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.legendMin}`}></div>
          <span>Minimum Value</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.legendFluid}`}></div>
          <span>Fluid Range</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.legendMax}`}></div>
          <span>Maximum Value</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.legendBreakpoint}`}></div>
          <span>Breakpoints</span>
        </div>
      </div>
    </div>
  );
};

export default ClampChart;