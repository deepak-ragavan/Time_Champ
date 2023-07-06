import { useEffect, useState } from 'react';
import './search.scss'
import { useDispatch, useSelector } from 'react-redux';
import { saveSearch, selectFilterData } from '../../../store/reducer/reducerFilter';
const Search = () => {
    const [searchtext,setSearchText] = useState("")
    const dispatch = useDispatch();
    const filterData = useSelector(selectFilterData)

    const handleSearch = () => {
        dispatch(saveSearch(searchtext));
    }

    useEffect(()=>{
        if(filterData.search){
            setSearchText(filterData.search);
        }
    
      },[filterData])

    return (
        <div className="searchContainer">
            <div className="searchInput">
                <div className='boxlayout'>
                    <span className="placeholder">search</span>
                    <input onBlur={handleSearch} value={searchtext} type="text" onChange={(e) => setSearchText(e.target.value)} />
                </div>
            </div>
        </div>
    )
}

export default Search;