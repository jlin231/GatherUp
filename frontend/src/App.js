import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import { thunkLoadGroups } from "./store/group";
import { thunkLoadEvents } from "./store/event";
import CreateGroupComponent from './components/Group/CreateGroup'
import GroupDetailsComponent from "./components/Group/GroupDetails";
import HomePageComponent from "./components/Home";
import EditGroupComponent from "./components/Group/EditGroup"
import EventDetailsComponent from "./components/Events/EventDetails";
import CreateEventComponent from "./components/Events/CreateEvent";
import SplashPage from "./components/SplashPage";

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
          <Route exact path='/group/create'>
            <CreateGroupComponent />
          </Route>
          <Route exact path='/group/:groupId/event/create'>
            <CreateEventComponent />
          </Route>
          <Route exact path='/home/:homeCategory'>
            <HomePageComponent />
          </Route>
          <Route exact path='/group/:groupId/edit'>
            <EditGroupComponent />
          </Route>
          <Route exact path='/group/:groupId/:groupInfo'>
            <GroupDetailsComponent />
          </Route>
          <Route exact path='/event/:eventId'>
            <EventDetailsComponent />
          </Route>
          <Route exact path='/'>
            <SplashPage />
          </Route>

        </Switch>
      )}
    </>
  );
}

export default App;
