// const BackendUrl = 'http://203.129.217.246:8005' //live server
// const BackendUrl = 'http://192.168.29.190:8005' // stagging server
// const BackendUrl = 'http://192.168.0.202:8000' // local server
// const BackendUrl = 'http://192.168.0.240:86' // local server

const BackendUrl = process.env.REACT_APP_AUTH_URL;
// const BackendUrl = process.env.REACT_APP_BASE_URL;

export default BackendUrl;
