import ReactApexChart from "react-apexcharts";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useSelector } from "react-redux";
import { selectUserDataReducer } from "../store/reducer/reducerUserData"; 
import NoDataFound from '../../2953962.jpg'
// type activityData ={

//   id: number,
//   keyStroke: number,
//   mouseMovement: number,
//   startTime: string,
//   endTime: string,
//   spentTime: number,
//   userId: number
// }

function getFormattedDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const checkinTimeFormater = (inputDateString: string) => {
  const date = new Date(inputDateString);
  const outputDateString = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

  return outputDateString

}


const KeyStrokeChart = () => {
  const axiosPrivate = useAxiosPrivate();
  const userId = useSelector(selectUserDataReducer).id;
  const today = getFormattedDate();
  const [keyStroke, setKeyStroke] = useState([])
  const [mouseMovement, setMouseMovement] = useState([])
  const [startTime, setStartTime] = useState([])
  const [chartData, setCharData] = useState(false)

  // Loop through each object in the data

  useEffect(() => {
    async function fetchData() {
      try {
        const keyStrokeArray: any = [];
        const mouseMovementArray: any = [];
        const startTimeArray: any = [];
        const response = await axiosPrivate.get('/tracker-chartdetails/getMouseAndKeyActvity', { params: { userId: userId, date: today } });
        console.log(response.data)
        const data = response.data ? response.data.forEach((item: any) => {
          if (item.spentTime > 0) {
            keyStrokeArray.push(item.keyStroke);
            mouseMovementArray.push(item.mouseMovement);
            startTimeArray.push(checkinTimeFormater(item.startTime));
          }
        }) : null;
        setKeyStroke(keyStrokeArray)
        setMouseMovement(mouseMovementArray)
        setStartTime(startTimeArray)
        setCharData(true)
        // console.log(`=======>${keyStroke}`)
      } catch (error) {
        console.log('Error fetching data:', error);

      }
    }

    fetchData();

  }, [userId, today]);

  const series = [{
    name: 'Mouse Movement',
    data: mouseMovement, //[0, 0, 44, 55, 41, 67, 22, 43, 0, 0, 0, 0]
  }, {
    name: 'Keystroke',
    data: keyStroke //[0, 0, 13, 23, 20, 8, 13, 27, 0, 0, 0, 0]
  }]

  const options: ApexCharts.ApexOptions = {
    chart: {
      id: "chart2",
      type: "area",
      height: 230,
      foreColor: "black",
      toolbar: {
        autoSelected: "pan",
        show: false
      },

    },
    title: {
      text: "Keystroke & Mouse Movements",
      align: 'left',
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        fontFamily: undefined,
        color: '#263238'
      },
    },

    colors: ["#00BAEC"],
    stroke: {
      width: 3
    },
    grid: {
      borderColor: "#555",
      yaxis: {
        lines: {
          show: false
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0
      }
    },
    markers: {
      size: 5,
      colors: ["#000524"],
      strokeWidth: 3
    },
    tooltip: {
      theme: "dark"
    },
    xaxis: {
      type: 'category',
      categories: startTime, // ['7.00 - 9.00', '9.00 - 11.00', '11.00 - 13.00', '13.00 - 15.00',
      //   '15.00 - 17.00', '17.00 - 19.00', '19.00 - 21.00', '21.00 - 23.00', '23.00 - 01.00',
      //   '01.00 - 03.00', '03.00 - 05.00', '05.00 - 07.00',
      // ],
    },
    legend: {
      position: 'right',
      offsetY: 40
    }
  }
  return <div id="chart">
    {chartData ? <ReactApexChart options={options} series={series} type="area" height={350} /> : (<div className='piecontainer'>
      <h4 className="chartheading1">Keystroke Chart</h4><div className='NoDataFoundImageContainer'><img className='NoDataFound' src={NoDataFound}></img></div></div>)}

  </div>
}

export default KeyStrokeChart;