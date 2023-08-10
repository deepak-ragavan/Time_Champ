import Chart from 'react-apexcharts';
import './piechart.scss'
import React from 'react';
import NoDataFound from '../../../2953962.jpg'




type summaryData = {
    appName:string,
    spentTime:number,
    appIconUrl:string,
}

type dataProps = {
    productive: number,
    unproductive: number,
    neutral: number,
    deskTime: number
}

type Pieprops = {
    heading : string,
    headingClassName:string
    data : dataProps
    topFiveApp: summaryData[]
    
}

const Piechart: React.FC<Pieprops> = ({ heading,headingClassName,data,topFiveApp }) => {
    let label: string[] = []
    let series: number[] = []
    let isDataAvailable = false
    if(heading==="Top 5 Websites & Applications") {
        isDataAvailable = topFiveApp.length > 0 ? true : false;
        topFiveApp.map((values) => {
                series.push(values.spentTime)
                label.push(values.appName)
         });
    } else {
        isDataAvailable = (data.deskTime > 0 || data.productive > 0 || data.unproductive>0 || data.neutral > 0) ? true : false;
        series = [data.productive,data.unproductive,data.neutral,data.deskTime]
        label = ["productive","unproductive","neutral","deskTime"]
    }

    return (
        <div className="piechart">
            <div className='piecontainer'>
                <h4 className={headingClassName}>{heading}</h4>
                <div className='chartContainer'>
                { isDataAvailable ? (
                    <Chart 
                    type="pie"
                    series={series}
                    height={300}
                    options={{
                        legend: {
                            fontSize: '14px',
                            fontFamily: 'Helvetica, Arial',
                            fontWeight: 400,
                            markers: {
                                radius: 0,
                                fillColors:['#fff','#fff','#fff','#fff','#fff','#fff'],
                                customHTML: function() {
                                    return '<span class="material-icons">donut_large</span>'
                                  },
                                  offsetX: -12,
                                  offsetY: 7,
                            },
                        },
                        labels:label,
                    }}
                    ></Chart>  
                ) : (<div className='NoDataFoundImageContainer'><img className='NoDataFound' src={NoDataFound}></img></div>)
                }
                </div>
            </div>          
        </div>
    )
}

export default Piechart;