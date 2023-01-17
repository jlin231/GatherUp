import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import { thunkLoadGroups } from "./store/group";
import { thunkLoadEvents } from "./store/event";
import CreateGroupComponent from './components/Group/CreateGroup'
import ShowAllGroupsComponent from "./components/Group/ShowAllGroups";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
    dispatch(thunkLoadGroups());
    dispatch(thunkLoadEvents());
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path='/group/create'>
            <CreateGroupComponent />
          </Route>
          <Route exact path='/group/showAll'>
            <ShowAllGroupsComponent />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
