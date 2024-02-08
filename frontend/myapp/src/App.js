import Sidebar from './Sidebar';
import Navb from './Navb';
import Productcategory from './Productcategory';
import Product from './Product';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div>
      <BrowserRouter>
        <div>  <Navb /> </div>
        <div className='d-flex'>
          <div> <Sidebar /> </div>

          <Routes>
            <Route path='/' element={<Productcategory />} />
            <Route path='/category' element={<Productcategory />} />
            <Route path='/product' element={<Product />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>

  );
}

export default App;
