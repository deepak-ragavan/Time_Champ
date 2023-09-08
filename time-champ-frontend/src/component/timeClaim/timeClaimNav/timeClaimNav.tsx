import { useRef } from "react"
import NavHeader from "../../navHeader/navHeader"
import WeeklyCalendar from "../../productivity/weeklyDataFilter/weeklyDataFilter"
import './timeClaimNav.scss'


const TimeClaimNav = ({currentWeek,setCurrentWeek}:any) => {
  const filterElement = useRef<HTMLSpanElement>(null)

  const handleFilter = () =>{
    if (filterElement.current) {
      filterElement.current.textContent === 'filter_alt' ? filterElement.current.textContent = 'filter_alt_off' : filterElement.current.textContent = 'filter_alt'
      }
  }

  return (
    <NavHeader>
      <div className="navHeaderContainer">
        <p className="navHeaderChild1">Time Claim</p>
        <WeeklyCalendar currentWeek={currentWeek} setCurrentWeek={setCurrentWeek} />
        <div className="navHeaderChild3">
          <span id='filter_alt' className="material-icons-outlined" onClick={handleFilter} ref={filterElement}>filter_alt</span>
          <span  id='restart_alt' className="material-icons-outlined">restart_alt</span>
        </div>
      </div>
    </NavHeader>
  )
}

export default TimeClaimNav