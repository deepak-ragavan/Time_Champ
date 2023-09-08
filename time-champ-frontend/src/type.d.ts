type userList = {
    id: number,
    name: string,
    role: string
  }


type ScreenshotDetailsObject = {
    id: number;
    name: string;
    screenshot: string;
    startTime:string;
    user:Object;
    userId:number;
}

type ImageItems = {
  startTime:string;
  endTime:string;
  screenshotDetails:ScreenshotDetailsObject[]
}

type screenshotChartData = {
    id: number;
    keyStroke: number;
    mouseMovement: number;
    startTime: string,
    endTime: string,
    spentTime: number,
    userId: number
}

type screenshotChart = {
  setChartView: React.Dispatch<SetStateAction<{ showChart: boolean; chartType: string; }>>;
  chartData: screenshotChartData[];
  chartType: {showChart:boolean,chartType:string}
}

interface ScreenshotNavProps {
  presentMoment: string;
  setPresentMoment:(value:string) => void;
  setUserID:  React.Dispatch<SetStateAction<string | number>>;
  userID:number|string;
  setChartView: React.Dispatch<SetStateAction<{ showChart: boolean; chartType: string; }>>
}

interface ScreenshotContentProps {
  handleForwardTime: () => void;
  // hourIntervel: string;
  fromTime:string;
  toTime:string;
  handleBackwardTime: () => void;
  screenshotData: Imagedata[] | null;
  isLoading:boolean
}

interface DatePickerProps {
  presentMoment: string;
  setPresentMoment:(value:string) => void;
}


type attendaceData = {
  id: number,
  name:string,
  startTime: string,
  endTime: string,
  idle: number,
  working: number,
  nonWorking: number,
  breakTime: number,
  totalTime: number,
  productive: number,
  unproductive: number,
  neutral: number,
  deskTime: number,
  userActivity: userActivity[]
}

type userProps = {
  id: number,
  name: string,
  role: string
}
