import React from 'react'
import './cardview.scss'

type Cardprops = {
    heading : string,
    headingClassName:string
}

const CardView: React.FC<Cardprops> = ({ heading,headingClassName }) => {
    return (
        <div className="cardview">
            <div className={headingClassName}>
                <h4>{heading}</h4>
            </div>
            <div className="cardcontent">
                <div className="row">
                    <div className="cl-1">
                        <span className="material-icons-round vertical">account_box</span>
                        <p>Stackoverflow</p>
                    </div>
                    <div className="cl-2">
                        <p>53h 13m</p>
                    </div>
                </div>
                <div className="row">
                    <div className="cl-1">
                        <span className="material-icons-round vertical">account_box</span>
                        <p>Stackoverflow</p>
                    </div>
                    <div className="cl-2">
                        <p>53h 13m</p>
                    </div>
                </div>
                <div className="row">
                    <div className="cl-1">
                        <span className="material-icons-round vertical">account_box</span>
                        <p>Stackoverflow</p>
                    </div>
                    <div className="cl-2">
                        <p>53h 13m</p>
                    </div>
                </div>
                <div className="row">
                    <div className="cl-1">
                        <span className="material-icons-round vertical">account_box</span>
                        <p>Stackoverflow</p>
                    </div>
                    <div className="cl-2">
                        <p>53h 13m</p>
                    </div>
                </div>
                <div className="row">
                    <div className="cl-1">
                        <span className="material-icons-round vertical">account_box</span>
                        <p>Stackoverflow</p>
                    </div>
                    <div className="cl-2">
                        <p>53h 13m</p>
                    </div>
                </div>
                <div className="row">
                    <div className="cl-1">
                        <span className="material-icons-round vertical">account_box</span>
                        <p>Stackoverflow</p>
                    </div>
                    <div className="cl-2">
                        <p>53h 13m</p>
                    </div>
                </div>
                <div className="row">
                    <div className="cl-1">
                        <span className="material-icons-round vertical">account_box</span>
                        <p>Stackoverflow</p>
                    </div>
                    <div className="cl-2">
                        <p>53h 13m</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardView;