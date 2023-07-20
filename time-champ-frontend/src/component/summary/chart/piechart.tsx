import Chart from 'react-apexcharts';
import './piechart.scss'
 import React from 'react';

type Pieprops = {
    heading : string,
    headingClassName:string
}

const Piechart: React.FC<Pieprops> = ({ heading,headingClassName }) => {
    return (
        <div className="piechart">
            <div className='piecontainer'>
                <h4 className={headingClassName}>{heading}</h4>
                <div className='chartContainer'>
                <Chart 
                    type="pie"
                    series={[23,43,50,54,65]}
                    options={{
                        labels:["intellij","Eclipse","vscode","chrome","files",]
                    }}></Chart>  
                </div>
            </div>          
        </div>
    )
}

export default Piechart;