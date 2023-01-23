import { useParams } from 'react-router-dom';
import './Home.css';
import ShowAllEventsComponent from '../Events/ShowAllEvents';
import ShowAllGroupsComponent from '../Group/ShowAllGroups';
import { useHistory } from 'react-router-dom';
import { thunkLoadEvents } from '../../store/event';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function HomePageComponent() {
    const { homeCategory } = useParams();
    const history = useHistory();

    let component;
    let GroupTabClass;
    let EventTabClass;

    

    if (homeCategory === 'events') {
        component = <ShowAllEventsComponent />
        GroupTabClass = 'tab'
        EventTabClass = 'tab color'
    }
    else if (homeCategory === 'groups') {
        component = <ShowAllGroupsComponent />
        GroupTabClass = 'tab color'
        EventTabClass = 'tab'
    }

    return (
        <div id="homeOuterMostDiv">
            <div id="eventGroupBarDiv">
                <div className={EventTabClass} onClick={() => history.push('/home/events')}>Events</div>
                <div className={GroupTabClass} onClick={() => history.push('/home/groups')}>Groups</div>
            </div>
            {component}
        </div>
    );
}

export default HomePageComponent;
