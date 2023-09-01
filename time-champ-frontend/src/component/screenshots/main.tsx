import './main.scss'
import moment from "moment";
import React, { useEffect, useState, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { selectUserDataReducer } from '../store/reducer/reducerUserData'; 
import ScreenshotNav from "./screenshotNav/screensotNav";
import ScreenshotContent from "./screenshotContent/content";
import ScreenshotChart from "./screenshotChart/screenshotChart";




const Screenshots: React.FC = () => {

  const [presentMoment, setPresentMoment] = useState(moment().format("ddd, MMM DD, YYYY"));
  const [screenshotData, setScreenshotData] = useState<Imagedata[]>([]);
  const [modifiedScreenshotData, setmodifiedScreenshotData] = useState<Imagedata[]>([]);
  const [hourIntervel, setHourIntervel] = useState('');
  const axiosPrivate = useAxiosPrivate();
  const [userId, setUserId] = useState<number | string>(useSelector(selectUserDataReducer).id);
  const currentDate = moment(new Date(presentMoment)).format("YYYY-MM-DD");
  const [userDetails, setUserDetails] = useState([]);
  const [chartView, setChartView] = useState({ showChart: false, chartType: 'bar' });
  const [chartData, setChartData] = useState<screenshotChartData[]>([]);

 

  const handleBackwardTime = () => {
    const hourIntervelEnd = hourIntervel.split('-')[0];
    const hourIntervalStart = moment(new Date(`${presentMoment} ${hourIntervelEnd}`)).subtract(1, 'hours').format('hh:mm A');
    const hourIntervelString = `${moment(new Date(`${presentMoment} ${hourIntervalStart}`)).format('hh:mm A')} - ${hourIntervelEnd}`
    setHourIntervel(hourIntervelString);
    storingModifiedData(screenshotData, hourIntervelString);

  };

  const handleForwardTime = () => {
    const hourIntervalStart = hourIntervel.split('-')[1];
    const hourIntervelEnd = moment(new Date(`${presentMoment} ${hourIntervalStart}`)).add(1, 'hours').format('hh:mm A');
    const hourIntervelString = `${moment(new Date(`${presentMoment} ${hourIntervalStart}`)).format('hh:mm A')} - ${hourIntervelEnd}`
    setHourIntervel(hourIntervelString);
    storingModifiedData(screenshotData, hourIntervelString);
  }

  const storingModifiedData = (screenshotData: Imagedata[], hourIntervel: String) => {
    const hourIntervelStarts = hourIntervel.split('-')[0];
    const hourIntervelEnds = hourIntervel.split('-')[1];
    const modifiedScreenshots = screenshotData.filter((data) => {
      return ((new Date(data.startTime) >= new Date(`${presentMoment} ${hourIntervelStarts}`)) && (new Date(data.startTime) <= new Date(`${presentMoment} ${hourIntervelEnds}`)))
    })
    setmodifiedScreenshotData(modifiedScreenshots);
  }

  const setHourIntervalTime = (data: Imagedata[]) => {
    const hourIntervalStart = data.length !== 0 ? new Date(data[0].startTime) : new Date();
    hourIntervalStart.setMinutes(0);
    hourIntervalStart.setSeconds(0);
    const hourIntervelEnd = new Date(JSON.parse(JSON.stringify(hourIntervalStart)));
    hourIntervelEnd.setHours(hourIntervelEnd.getHours() + 1);
    const hourIntervelString = `${hourIntervalStart.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${hourIntervelEnd.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
    setHourIntervel(hourIntervelString);
    storingModifiedData(data, hourIntervelString);
  }

  const getIamgeItems = async (userId: string | number) => {
    try {
      const imageItems = await axiosPrivate.get('/screenshot-Details/getScreenshot', { params: { userId: userId, date: currentDate } });
      const data: Imagedata[] = imageItems.data
      setScreenshotData(data);
      data.sort((a: Imagedata, b: Imagedata) => Date.parse(a.startTime) - Date.parse(b.startTime));
      setHourIntervalTime(data);
      getChartDatas(userId);
    }
    catch (err) {
      setHourIntervalTime([]);
      setScreenshotData([]);
    }
  }

  const getUserDetails = async () => {
    try {
      const Userdetails = await axiosPrivate.get('users', { params: { userId: userId } });
      setUserDetails(Userdetails.data);
    }
    catch (err) {
      setUserDetails([]);
    }
  }

  const setUserID = (e: ChangeEvent<HTMLSelectElement>) => {
    setUserId(e.target.value);
    getIamgeItems(e.target.value);
    getChartDatas(e.target.value);
  }

  const getChartDatas = async (userId: string | number) => {
    try {
      const mouseAndKeyActivity = await axiosPrivate.get('/tracker-chartdetails/getMouseAndKeyActvity', { params: { userId: userId, date: currentDate } });
      const chartData: screenshotChartData[] = mouseAndKeyActivity.data;
      chartData.sort((a, b) => Date.parse(a.startTime) - Date.parse(b.startTime));
      setChartData(chartData);
    }
    catch (err) {
      setChartData([]);
    }
  }

  useEffect(() => {
    getUserDetails();
  }, [])

  useEffect(() => {
    getIamgeItems(userId);
    getChartDatas(userId);
  }, [presentMoment])

  return (

    <div className="screenshotContainer">
      <h2>Screenshots</h2>
      <ScreenshotNav
        presentMoment={presentMoment}
        setPresentMoment={setPresentMoment}
        setUserID={setUserID}
        userDetails={userDetails}
        setChartView={setChartView}
      />
      {chartView.showChart && <ScreenshotChart setChartView={setChartView} chartType={chartView} chartData={chartData} />}
      <ScreenshotContent
        handleBackwardTime={handleBackwardTime}
        hourIntervel={hourIntervel}
        handleForwardTime={handleForwardTime}
        modifiedScreenshotData={modifiedScreenshotData}
      />
    </div>

  );

};

export default Screenshots;