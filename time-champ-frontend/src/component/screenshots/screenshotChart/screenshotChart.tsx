import './chart.scss'
import Chart from 'react-apexcharts'
import moment from 'moment'


const ScreenshotChart = (props: screenshotChart) => {
    const { setChartView,chartType, chartData } = props
    const chartDetails = {
        options: {
            dataLabels: {
                enabled: false,
            },
            xaxis: {
                categories: (chartData && chartData.map((data: screenshotChartData) => { return moment(new Date(data.startTime)).format("HH:mm") })),
                labels:{
                    rotateAlways: true,
                    datetimeFormatter: {
                        hour: 'HH:mm',
                    },
                   
                }
            },
        },
        series: [{
            name: 'Key Stroke',
            data: (chartData && chartData.map((data: screenshotChartData) => { return data.keyStroke }))
        }, {
            name: 'Mouse Activity',
            data: (chartData && chartData.map((data: screenshotChartData) => { return data.mouseMovement }))
        }],

    }

    return (
        <div className='screenshotChartOverlay' onClick={() => setChartView((prevState:{showChart:boolean,chartType:string})=>{return{...prevState, showChart:false}})}>
            <div className='screenshotChart'>
                {chartData.length !== 0 ? <Chart
                    type={chartType.chartType === 'bar' ? 'bar' :'area'}
                    series={chartDetails.series}
                    options={chartDetails.options}
                    height="300"
                /> : <>No data Found....</>}
            </div>
        </div>
    )
}


export default ScreenshotChart