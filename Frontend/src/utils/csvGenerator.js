import React from 'react';
  
  const CsvGenerator = () =>  {
	return (
	  <div>
	  </div>
	);
  }
  
  export default CsvGenerator;
  import { json2csv } from 'json-2-csv'

const csvGenerator = (jsonData) => {
    try {
        const csvData = json2csv(jsonData)
        return csvData
    } catch (err) {
        console.log(err)
    }
}

export default csvGenerator