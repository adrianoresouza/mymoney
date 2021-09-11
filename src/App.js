import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';
import AuthProvider from './contexts/user';

import Header from './components/Header';


function App() {
  return (
      <AuthProvider>
        <BrowserRouter>
          <Routes/>
        </BrowserRouter>
      </AuthProvider>
  );
}

export default App;
