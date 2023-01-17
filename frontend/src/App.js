import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import { thunkLoadGroups } from "./store/group";
import { thunkLoadEvents } from "./store/event";


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  //load groups, events
  useEffect(()=>{
    dispatch(thunkLoadGroups()); 
    dispatch(thunkLoadEvents());
  }, [dispatch])

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path='/group/create'>
            
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
