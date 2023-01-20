import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import './GroupDetails.css';
import { thunkLoadGroupDetails } from '../../../store/group';
import { useEffect } from 'react';
import { thunkLoadGroups } from '../../../store/group';
import GroupAboutComponent from './GroupInfo/GroupAbout'
import GroupEventComponent from './GroupInfo/GroupEvent';

function GroupDetailsComponent() {
    const { groupId, groupInfo } = useParams();
    const dispatch = useDispatch();

    const sessionUser = useSelector(state => state.session.user);
    const groups = useSelector((state) => state.groups);

    useEffect(() => {
        dispatch(thunkLoadGroups());
        dispatch(thunkLoadGroupDetails(groupId));
    }, [groupId, dispatch])

    const singleGroup = groups.singleGroup;
    if (!groups.allGroups[groupId] || !singleGroup || Object.values(groups).length === 0) {
        return null;
    }

    //find previewImage
    let previewImage;
    singleGroup.GroupImages.forEach((image) => {
        if (image.preview) {
            previewImage = image.url;
        };
    });

    //change based on groupInfo
    let component = null;
    if (groupInfo === 'about') {
        component = <GroupAboutComponent group={singleGroup} />;
    }
    else if (groupInfo === 'events') {
        component = <GroupEventComponent group={singleGroup} />;
    }
    else if (groupInfo === 'members') {
        component = null;
    }
    else if (groupInfo === 'photos') {
        component = null;
    }

    //check if current user is organizer of group
    let organizer;
    if (sessionUser) {
        if (singleGroup.organizerId === sessionUser.id) {
            organizer = true;
        }
        else organizer = false;
    }

    return (
        <>
            <div className='topDiv'>
                <div className='leftDiv'>
                    <img className='previewImage' src={`${previewImage}`} alt='Not Found' />
                </div>
                <div className='rightDiv'>
                    <div className='groupName'>
                        {singleGroup.name}
                    </div>
                    <div className='groupLocation'>
                        <i className="fa-solid fa-location-dot"></i>
                        {singleGroup.city}, {singleGroup.state}
                    </div>
                    <div>
                        <i className="fa-solid fa-user-group"></i> {singleGroup.numMembers} members . {singleGroup.private ? 'Private' : 'In Person'} group
                    </div>
                    <div className='groupOrganizer'>
                        <i className="fa-regular fa-user"></i>
                        Organized by
                        <span className='organizerId'> {singleGroup.Organizer.firstName} {singleGroup.Organizer.lastName[0]}.</span>
                    </div>
                    <div id='iconHolder'>
                        Share: <i className="fa-brands fa-square-facebook icon"></i>  <i className="fa-brands fa-twitter icon"></i>  <i className="fa-brands fa-linkedin icon"></i>  <i className="fa-solid fa-envelope icon"></i>
                    </div>
                </div>


            </div>
            <div className="navigation">
                <NavLink exact to={`/group/${groupId}/about`}>About</NavLink>
                <NavLink exact to={`/group/${groupId}/events`}>Events</NavLink>
                <NavLink exact to={`/group/${groupId}/members`}>Members</NavLink>
                <NavLink exact to={`/group/${groupId}/photos`}>Photos</NavLink>
            </div>
            <div>
                {component}
            </div>

        </>);
}

export default GroupDetailsComponent;
