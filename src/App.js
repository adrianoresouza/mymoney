import { BrowserRouter } from 'react-router-dom';

import Routes from './routes';



import AuthProvider from './contexts/user';
import ResumoProvider from './contexts/resumo';





function App() {
  return (
    
      <AuthProvider>
        <ResumoProvider>
          <BrowserRouter>
            <Routes/>
          </BrowserRouter>
        </ResumoProvider>
      </AuthProvider>
    
      
  );
}

export default App;
