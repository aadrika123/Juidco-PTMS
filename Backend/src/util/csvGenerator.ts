import { json2csv } from 'json-2-csv'

const csvGenerator = (jsonData: any) => {
    try {
        const csvData = json2csv(jsonData)
        return csvData
    } catch (err) {
        console.log(err)
    }
}

export default csvGenerator