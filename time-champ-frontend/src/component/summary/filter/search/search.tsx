import './search.scss'

const Search: React.FC<{searchedText:string,setSearchedText:(val:string)=>void}> = ({searchedText,setSearchedText}) => {

    return (
        <div className="searchContainer">
            <div className="searchInput">
                <div className='boxlayout'>
                    <span className="placeholder">search</span>
                    <input className='search' value={searchedText} type="text" onChange={(e) => setSearchedText(e.target.value)} />
                </div>
            </div>
        </div>
    )
}

export default Search;