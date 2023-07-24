import ReactApexChart from "react-apexcharts"
import ApexCharts from 'apexcharts';
import './stackedBars.scss'

const StackedBar : React.FC<{Productive:number,Unproductive:number,Neutral:number,Idle:number,showIdleTimeData:boolean}> = ({Productive,Unproductive,Neutral,Idle,showIdleTimeData}) => {
  console.log(Productive,Unproductive,Neutral,Idle)
  const series = showIdleTimeData 
                 ? [Productive,Unproductive,Neutral,Idle]  
                 : [Productive,Unproductive,Neutral]
  const labels = showIdleTimeData 
                 ? ["Productive","Unproductive","Netural","Idle"]
                 : ["Productive","Unproductive","Netural"]
  const options: ApexCharts.ApexOptions = {
    chart: {
      width: 100,
      type: 'donut',
    },
    labels: labels,
    dataLabels: {
      enabled: false
    },
    fill: {
      type: 'gradient',
    },
    legend: {
      show:false
    },  
  };
 

	return (
      <div className="chart">
        <div className="stackedchartContainer">
        <ReactApexChart 
            options={options} 
            series={series}
            type="donut" 
            width={100}
            apexcharts={ApexCharts}/>
        </div>
    </div>
  )

}

export default StackedBar;