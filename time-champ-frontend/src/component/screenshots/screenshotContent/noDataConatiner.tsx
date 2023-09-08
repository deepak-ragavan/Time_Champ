import React from 'react'
import NoDataFound from '../../../2953962.jpg'
const NoDataConatiner = () => {
  return (
        <div className='imageContainer noBorder'>
             <div className="noDataContainer"><img src={NoDataFound} alt='No data Found....' className="Nodata" /></div>
        </div>
  )
}

export default NoDataConatiner