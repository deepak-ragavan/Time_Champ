import { MultiSelect } from 'react-multi-select-component';
import './lineManager.scss'
import { useRef } from 'react';

type lineManagerOptions = {
    label:string,
    value:string
  } 
  
  const LineManager: React.FC<{selectedLineManager:lineManagerOptions[],setSelectedLineManager:(val:lineManagerOptions[])=>void}> = ({selectedLineManager,setSelectedLineManager}) => {
    const refOne = useRef<HTMLDivElement | null>(null);

  
    const options = [
      { label: "Porur", value: "Porur" },
      { label: "Navalur", value: "Navalur" },
      { label: "Bangalore", value: "Bangalore" },
    ];

    return (
      <div className="branchWrap" ref={refOne}>
        <div className='branchDropDown' >
              <MultiSelect
                options={options}
                value={selectedLineManager}
                onChange={(values:lineManagerOptions[]) => setSelectedLineManager(values)}
                labelledBy={"Select"}
              />       
        </div>
      </div>
    );
  };
  
  export default LineManager;