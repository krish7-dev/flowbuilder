import App from './App'
import {Routes,BrowserRouter as Router,Route } from "react-router-dom";


function Routing(){
    return(
        <Router>
        <Routes>
            <Route exact path="/" element={<App/>} />
          </Routes>
          </Router>
    )
}
export default Routing;