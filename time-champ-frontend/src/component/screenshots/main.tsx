import './main.scss'
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { selectUserDataReducer } from '../store/reducer/reducerUserData';
import ScreenshotNav from "./screenshotNav/screensotNav";
import ScreenshotContent from "./screenshotContent/content";
import ScreenshotChart from "./screenshotChart/screenshotChart";
import Loading from './loading';


const Screenshots: React.FC = () => {
  const axiosPrivate = useAxiosPrivate();
  const [presentMoment, setPresentMoment] = useState(moment().format("ddd, MMM DD, YYYY"));
  const [fromTime, setFromTime] = useState(moment().startOf('hour').format('HH:mm:ss'));
  const [endTime, setEndTime] = useState(moment().endOf('hour').format('HH:mm:ss'));
  const [screenshotData, setScreenshotData] = useState<ScreenshotDetailsObject[] | null>(null);
  const [userId, setUserId] = useState<number | string>(useSelector(selectUserDataReducer).id);
  const currentDate = moment(new Date(presentMoment)).format("YYYY-MM-DD");
  const [chartView, setChartView] = useState({ showChart: false, chartType: 'bar' });
  const [chartData, setChartData] = useState<screenshotChartData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const[isMounting,SetIsMounting] = useState(false);


  const handleBackwardTime = () => {
    setFromTime(moment(new Date(`${presentMoment} ${fromTime}`)).startOf('hour').subtract(1, 'hours').format('HH:mm:ss'))
    setEndTime(moment(new Date(`${presentMoment} ${endTime}`)).endOf('hour').subtract(1, 'hours').format('HH:mm:ss'))
  };


  const handleForwardTime = () => {
    setFromTime(moment(new Date(`${presentMoment} ${fromTime}`)).startOf('hour').add(1, 'hours').format('HH:mm:ss'))
    setEndTime(moment(new Date(`${presentMoment} ${endTime}`)).endOf('hour').add(1, 'hours').format('HH:mm:ss'))
  }

  const getIamgeItems = async () => {
    try {
      setIsLoading(true);
      const response = await axiosPrivate.get('/screenshot-Details/getScreenshot', { params: { userId: userId, fromDate: `${currentDate} ${fromTime}`, toDate: `${currentDate} ${endTime}` } });
      const data: ImageItems = response.data;
      const ImageItems: ScreenshotDetailsObject[] = data.screenshotDetails;
      setScreenshotData(ImageItems);
      setIsLoading(false);
    }
    catch (err) {
      setScreenshotData([]);
      setIsLoading(false);
    }
  }


  const getChartDatas = async () => {
    try {
      const mouseAndKeyActivity = await axiosPrivate.get('/tracker-chartdetails/getMouseAndKeyActvity', { params: { userId: userId, date: currentDate } });
      const chartData: screenshotChartData[] = mouseAndKeyActivity.data;
      setChartData(chartData);
    }
    catch (err) {
      setChartData([]);
    }
  }


  useEffect(() => {
    if(isMounting){
      setFromTime(prevTime=> prevTime === moment().startOf('hour').format('HH:mm:ss') ? `${moment().startOf('hour').format('HH:mm:ss')}.01` : moment().startOf('hour').format('HH:mm:ss') );
      setEndTime(moment().endOf('hour').format('HH:mm:ss'));
    }
    getChartDatas();
    SetIsMounting(true);
  }, [presentMoment])


  useEffect(() => {
    getIamgeItems();
  }, [userId, fromTime])


  return (

    <div className="screenshotContainer">
      <ScreenshotNav
        presentMoment={presentMoment}
        setPresentMoment={setPresentMoment}
        setUserID={setUserId}
        userID={userId}
        setChartView={setChartView}
      />
      {chartView.showChart && <ScreenshotChart setChartView={setChartView} chartType={chartView} chartData={chartData} />}
      <div className='screenshotContentMain'>
        {screenshotData ? (<ScreenshotContent
          handleBackwardTime={handleBackwardTime}
          fromTime={fromTime}
          toTime={endTime}
          handleForwardTime={handleForwardTime}
          screenshotData={screenshotData}
          isLoading={isLoading}
        />) : (<div className='screenshotContent'><Loading /></div>)}
      </div>
    </div>

  );

};

export default Screenshots;