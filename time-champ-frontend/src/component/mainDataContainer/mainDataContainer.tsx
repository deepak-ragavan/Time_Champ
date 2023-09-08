import './mainDataContainer.scss'

const MainDataContainer = ({children}:any) => {
  return (
  <div className='mainOuterConatainer'>
    <div className='mainInnerContainer'>
      {children}
    </div>
  </div>
  )
}

export default MainDataContainer