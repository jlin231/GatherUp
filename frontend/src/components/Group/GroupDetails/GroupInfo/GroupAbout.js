import './Group.css';

function GroupAboutComponent(singleGroup) {
    console.log('single', singleGroup);
    const group = singleGroup.group;
    return (
        <div className='GroupAboutOuterDiv'>
            <div id='GroupAboutLeftDiv'>
                <div>What we're about</div>
                <div>{group.about}</div>
            </div>
            <div id='GroupAboutRightDiv'>
                <div>Organizers</div>
                <div id="organizerInfo">
                    <div id="organizerDiv"><i class="fa-solid fa-user fa-2xl" id="organizerIcon"></i></div>
                    <div>{group.Organizer.firstName} {group.Organizer.lastName[0]}.</div>
                </div>
                <div>
                    Members {`(${group.numMembers})`}
                </div>
            </div>
        </div>
    );
}

export default GroupAboutComponent;
