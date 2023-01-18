import './Group.css';

function GroupEventComponent(singleGroup) {
    console.log('single', singleGroup);
    //dispatch action to get all events from a group by its id 
    //render cards for each event using EventCards
    return (
        <>
            <div>What we're about</div>
            <div>{singleGroup.group.about}</div>
        </>
    );
}

export default GroupEventComponent;
