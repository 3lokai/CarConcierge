import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Portal from './components/Portal';
import Footer from './components/Footer';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="App">
        <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route 
            path="/login" 
            render={(props) => <Login {...props} setIsAuthenticated={setIsAuthenticated} />} 
          />
          <Route 
            path="/portal" 
            render={(props) => 
              isAuthenticated ? (
                <Portal {...props} />
              ) : (
                <Redirect to="/login" />
              )
            } 
          />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;