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
  const [eventsLoaded, setEventsLoaded] = useState(false);
  const [groupsLoaded, setGroupsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
    dispatch(thunkLoadGroups()).then(() => setEventsLoaded(true));
    dispatch(thunkLoadEvents()).then(() => setGroupsLoaded(true));;
  }, [dispatch]);

  return (
    <>
      {isLoaded && eventsLoaded && groupsLoaded && (
        <Switch>
          <Route exact path='/group/create'>
            <Navigation isLoaded={isLoaded} />
            <CreateGroupComponent />
          </Route>
          <Route exact path='/group/:groupId/event/create'>
            <Navigation isLoaded={isLoaded} />
            <CreateEventComponent />
          </Route>
          <Route exact path='/home/:homeCategory'>
            <Navigation isLoaded={isLoaded} />
            <HomePageComponent />
          </Route>
          <Route exact path='/group/:groupId/edit'>
            <Navigation isLoaded={isLoaded} />
            <EditGroupComponent />
          </Route>
          <Route exact path='/group/:groupId/:groupInfo'>
            <Navigation isLoaded={isLoaded} type={"groupDetails"} />
            <GroupDetailsComponent />
          </Route>
          <Route exact path='/event/:eventId'>
            <Navigation isLoaded={isLoaded} />
            <EventDetailsComponent />
          </Route>
          <Route exact path='/'>
            <Navigation isLoaded={isLoaded} />
            <SplashPage />
          </Route>
          <Route path='*'>
            <div>404 Not Found</div>
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
