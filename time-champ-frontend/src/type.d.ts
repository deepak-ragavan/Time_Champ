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
  presentMoment: string;
  setPresentMoment:(value:string) => void;
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