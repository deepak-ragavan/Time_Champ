import './timesheet.scss'


const Timesheet = () => {

    const data = [
        { name: "Anom", age: 19, gender: "Male" },
        { name: "Megha", age: 19, gender: "Female" },
        { name: "Subham", age: 25, gender: "Male" },
    ]

    return <div className="timesheet">
        <div id="productivity-3" className="ng-star-inserted">
            <div className='selection-div0'>
            <div className="mb-05 ng-star-inserted style">
                <button   className="mat-raised-button mat-primary">
                <span className="mat-button-wrapper">Day</span>
                <div className="mat-button-ripple mat-ripple" ></div>
                <div className="mat-button-focus-overlay"></div></button></div>
            <div className="mb-05 style"><button   className="mat-raised-button">
                <span className="mat-button-wrapper">Week</span>
                <div className="mat-button-ripple mat-ripple" ></div>
                <div className="mat-button-focus-overlay"></div></button></div>
            <div className="mb-05 style"><button   className="mat-raised-button">
                <span className="mat-button-wrapper">Month</span>
                <div className="mat-button-ripple mat-ripple" ></div>
                <div className="mat-button-focus-overlay"></div></button></div>
            <div className="mb-05 ng-star-inserted style">
                <button   className="mat-raised-button">
                    <span className="mat-button-wrapper">Date Range </span>
                    <div className="mat-button-ripple mat-ripple"></div>
                    <div className="mat-button-focus-overlay"></div></button></div></div>
                    </div>
        <div className="nav">
            <ul className="sidenav">
                <div className="App">.
                    <table className='table'>
                        <tr className='row'>
                            <th>Date</th>
                            <th>In time</th>
                            <th>Last seen</th>
                            <th>Working hours</th>
                            <th>Productive hours</th>
                            <th>Ideal hours</th>

                      <tr></tr>  </tr>
                        {data.map((val, key) => {
                            return (
                                <tr key={key} className='cloumn' >

                                    <td>{val.name}</td>
                                    <td>{val.age}</td>
                                    <td>{val.gender}</td>
                                    <td>{val.name}</td>
                                    <td>{val.age}</td    >
                                    <td>{val.gender}</td>
                                </tr>
                            )
                        })}
                    </table>
                </div>
            </ul>

        </div>

    </div>

}

export default Timesheet;