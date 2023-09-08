import './navHeader.scss'

const NavHeader = ({children}:any) => {
  return (
    <div className='navbox'>
      {children}
    </div>
  )
}

export default NavHeader