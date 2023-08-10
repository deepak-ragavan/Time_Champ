import ReactApexChart from "react-apexcharts";

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
            show: true
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
          categories: ['7.00 - 9.00', '9.00 - 11.00', '11.00 - 13.00', '13.00 - 15.00',
          '15.00 - 17.00', '17.00 - 19.00', '19.00 - 21.00', '21.00 - 23.00', '23.00 - 01.00',
          '01.00 - 03.00', '03.00 - 05.00', '05.00 - 07.00',
        ],
        },
        legend: {
          position: 'right',
          offsetY: 40
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