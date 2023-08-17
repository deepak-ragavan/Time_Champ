type userList = {
    id: number,
    name: string,
    role: string
  }


type Imagedata = {
    id: number;
    name: string;
    screenshot: string;
    startTime:string;
    user:Object;
    userId:number;
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
  handleBackwardDate: () => void;
  verifiedCurrentDate: boolean;
  presentMoment: string;
  handleForwardDate: () => void;
  calanderView: () => void;
  calnderShow: boolean;
  calanderToDateChange: (date: Date) => void;
  setUserID: (event: ChangeEvent<HTMLSelectElement>) => void;
  userDetails: userList[];
  setChartView: React.Dispatch<SetStateAction<{ showChart: boolean; chartType: string; }>>
}

interface ScreenshotContentProps {
  handleForwardTime: () => void;
  hourIntervel: string;
  handleBackwardTime: () => void;
  modifiedScreenshotData: Imagedata[];
}