import ReactApexChart from "react-apexcharts";
import './barchart.scss'

const BarChart = () => {
    const series = [{
        name: 'Working Hours',
        data: [null,null,44, 55, 41, 67, 22, 43]
      }, {
        name: 'Idle',
        data: [null,null,13, 23, 20, 8, 13, 27]
      }]

      const options: ApexCharts.ApexOptions = {
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          toolbar: {
            show: false
          },
          zoom: {
            enabled: true
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 10,
            dataLabels: {
              total: {
                enabled: true,
                style: {
                  fontSize: '13px',
                  fontWeight: 900
                }
              }
            }
          },
        },
        xaxis: {
          type: 'category',
          categories: ['06 AM - 08 AM', '08 AM - 10 AM', '10 AM - 12 PM', '12 PM - 14 PM',
          '14 PM - 16 PM', '16 PM - 18 PM', '18 PM - 20 PM', '20 PM - 22 PM', '22 PM - 00 AM',
          '00 AM - 02 AM', '02 AM - 04 AM', '04 AM - 06 AM',
          ],
        },
        fill: {
          opacity: 1
        }
      }
    return <div id="chart">
    <ReactApexChart options={options} series={series} type="bar" height={350} />
  </div>
}

export default BarChart;