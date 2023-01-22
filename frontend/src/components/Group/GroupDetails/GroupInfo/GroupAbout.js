import './Group.css';

function GroupAboutComponent(singleGroup) {
    const group = singleGroup.group;
    return (
        <div className='groupAboutOuterDiv'>
            <div id='groupAboutLeftDiv'>
                <div id="groupAboutLeftDivTopHeader">What we're about</div>
                <div>{group.about}</div>
            </div>
            <div id='groupAboutRightDiv'>
                <div id="groupAboutOrganizerText">Organizers</div>
                <div id="groupAboutOrganizerProfileText">
                    <div id="groupAboutIcon">
                        <i class="fa-solid fa-user fa-2xl" id="groupAboutOrganizerIcon"></i>
                    </div>
                    <div id="groupAboutOrganizerInfo">
                        <div>{group.Organizer.firstName} {group.Organizer.lastName[0]}.</div>

                    </div>
                </div>
                <div id="groupAboutMembersDiv">
                    Members {`(${group.numMembers})`}
                </div>
            </div>
        </div>
    );
}

export default GroupAboutComponent;
