import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';

class StockChart extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			symbol: null,
			prices: null,

			// Highcharts configs
			chartOptions: {
				// Title
				title: {},

				// Data
				series: [],

				// Theme - below is taken from https://github.com/highcharts/highcharts/blob/master/js/themes/dark-unica.js
				colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
					'#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
				chart: {
					backgroundColor: {
						linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
						stops: [
							[0, '#2a2a2b'],
							[1, '#3e3e40']
						]
					},
					style: {
						fontFamily: '\'Unica One\', sans-serif'
					},
					plotBorderColor: '#606063'
				},
				subtitle: {
					style: {
						color: '#E0E0E3',
						textTransform: 'uppercase'
					}
				},
				xAxis: {
					gridLineColor: '#707073',
					labels: {
						style: {
							color: '#E0E0E3'
						}
					},
					lineColor: '#707073',
					minorGridLineColor: '#505053',
					tickColor: '#707073',
					title: {
						style: {
							color: '#A0A0A3'
						}
					}
				},
				yAxis: {
					gridLineColor: '#707073',
					labels: {
						style: {
							color: '#E0E0E3'
						}
					},
					lineColor: '#707073',
					minorGridLineColor: '#505053',
					tickColor: '#707073',
					tickWidth: 1,
					title: {
						style: {
							color: '#A0A0A3'
						}
					}
				},
				tooltip: {
					backgroundColor: 'rgba(0, 0, 0, 0.85)',
					style: {
						color: '#F0F0F0'
					}
				},
				plotOptions: {
					series: {
						dataLabels: {
							color: '#F0F0F3',
							style: {
								fontSize: '13px'
							}
						},
						marker: {
							lineColor: '#333'
						}
					},
					boxplot: {
						fillColor: '#505053'
					},
					candlestick: {
						lineColor: 'white'
					},
					errorbar: {
						color: 'white'
					}
				},
				legend: {
					backgroundColor: 'rgba(0, 0, 0, 0.5)',
					itemStyle: {
						color: '#E0E0E3'
					},
					itemHoverStyle: {
						color: '#FFF'
					},
					itemHiddenStyle: {
						color: '#606063'
					},
					title: {
						style: {
							color: '#C0C0C0'
						}
					}
				},
				credits: {
					style: {
						color: '#666'
					}
				},
				labels: {
					style: {
						color: '#707073'
					}
				},
				drilldown: {
					activeAxisLabelStyle: {
						color: '#F0F0F3'
					},
					activeDataLabelStyle: {
						color: '#F0F0F3'
					}
				},
				navigation: {
					buttonOptions: {
						symbolStroke: '#DDDDDD',
						theme: {
							fill: '#505053'
						}
					}
				},
				rangeSelector: {
					buttonTheme: {
						fill: '#505053',
						stroke: '#000000',
						style: {
							color: '#CCC'
						},
						states: {
							hover: {
								fill: '#707073',
								stroke: '#000000',
								style: {
									color: 'white'
								}
							},
							select: {
								fill: '#000003',
								stroke: '#000000',
								style: {
									color: 'white'
								}
							}
						}
					},
					inputBoxBorderColor: '#505053',
					inputStyle: {
						backgroundColor: '#333',
						color: 'silver'
					},
					labelStyle: {
						color: 'silver'
					}
				},
				navigator: {
					handles: {
						backgroundColor: '#666',
						borderColor: '#AAA'
					},
					outlineColor: '#CCC',
					maskFill: 'rgba(255,255,255,0.1)',
					series: {
						color: '#7798BF',
						lineColor: '#A6C7ED'
					},
					xAxis: {
						gridLineColor: '#505053'
					}
				},
				scrollbar: {
					barBackgroundColor: '#808083',
					barBorderColor: '#808083',
					buttonArrowColor: '#CCC',
					buttonBackgroundColor: '#606063',
					buttonBorderColor: '#606063',
					rifleColor: '#FFF',
					trackBackgroundColor: '#404043',
					trackBorderColor: '#404043'
				}
			}
		};
	}

	prepareChart() {
		let high = this.state.prices.high;
		let low = this.state.prices.low;

		// Update the chartOptions in state
		this.setState({
			chartOptions: {
				title: {
					text: `${this.state.symbol} - $${this.state.prices.high[0][1]}`,
					style: {
						color: '#E0E0E3',
						textTransform: 'uppercase',
						fontSize: '20px'
					}
				},
				series: [
					{
						name: `${this.state.symbol} High Price`,
						data: high.reverse()
					},
					{
						name: `${this.state.symbol} Low Price`,
						data: low.reverse()
					}
				],
			}
		})
	}

	componentDidMount() {
		// Populate the chart with the initial data
		const data = this.props.data;

		this.setState({
			symbol: data.symbol,
			prices: data.prices
		}, () => this.prepareChart());
	}

	componentDidUpdate(prevProps) {
		// While componentDidUpdate() will fire whenever the data passed in this component has changed, we only care when the data is changed for single stock data
		if (this.props.type === "single") {
			let prevSymbol = prevProps.data.symbol;
			let currSymbol = this.props.data.symbol;

			// Check if the symbol in props are different
			if (prevSymbol !== currSymbol) {
				const data = this.props.data;

				// Update the state and then reload the chart
				this.setState({
					symbol: data.symbol,
					prices: data.prices
				}, () => this.prepareChart());
			}
		}
	}

	render() {
		return (
			<HighchartsReact
				options={this.state.chartOptions}
				highcharts={Highcharts}
				constructorType={'stockChart'}
			/>
		)
	}
}

export default StockChart;