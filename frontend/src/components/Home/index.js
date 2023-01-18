import { NavLink, useParams } from 'react-router-dom';
import './Home.css';
import ShowAllEventsComponent from '../Events/ShowAllEvents';
import ShowAllGroupsComponent from '../Group/ShowAllGroups';

function HomePageComponent() {
    const { homeCategory } = useParams();
    let component;
    if (homeCategory === 'events') {
        component = <ShowAllEventsComponent />
    }
    else if (homeCategory === 'groups') {
        component = <ShowAllGroupsComponent />
    }

    return (
        <>
            <div>
                <NavLink exact to='/home/events'>Events</NavLink>
                <NavLink exact to='/home/groups'>Groups</NavLink>
            </div>
            {component}
        </>
    );
}

export default HomePageComponent;
