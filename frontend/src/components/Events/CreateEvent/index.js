import React, { useEffect } from 'react';
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import './CreateEvent.css';
import { thunkCreateEvent } from '../../../store/event';
import { useHistory, useParams } from 'react-router-dom';

function CreateEventComponent() {
    const sessionUser = useSelector(state => state.session.user);
    const { groupId } = useParams();

    const dispatch = useDispatch();
    const history = useHistory();

    const [venueId, setVenueId] = useState("");
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [capacity, setCapacity] = useState(0);
    const [price, setPrice] = useState("");
    const [startDateDay, setStartDateDay] = useState("");
    const [startDateTime, setStartDateTime] = useState("");
    const [endDateDay, setEndDateDay] = useState("");
    const [endDateTime, setEndDateTime] = useState("");
    const [errors, setErrors] = useState([]);

    // useEffect(()=>{
    //     console.log(startDateDay)
    //     console.log(startDateTime)
    //     console.log(endDateDay)
    //     console.log(endDateTime);
    // },[startDateDay, startDateTime, endDateDay,endDateTime])

    function handleSubmit(e) {
        e.preventDefault();
        setErrors([]);
        const startDate = startDateDay + " " + startDateTime;
        const endDate = endDateDay + " " + endDateTime;
        const info = {
            venueId: 2,
            name,
            type,
            description,
            capacity: +capacity,
            price: +price,
            startDate,
            endDate
        }
        return dispatch(thunkCreateEvent(info, groupId))
            .then((res) => {
                history.push(`/event/${res.id}`)
            })
            .catch(async (res) => {
                let data = await res.json();
                if (data && data.errors) {
                    const values = Object.values(data.errors);
                    setErrors(values);
                }
            }
            );

        //add a redirect or to place to read new group
    };

    //inputClass and labl css from signup modal css
    return (
        <>
            <div className="create-event-outer-most-div">
                <div className='create-event-text-div'>Create Event</div>
                <form onSubmit={handleSubmit} className="outerCreateGroupFormDiv">
                    <ul>
                        {errors.map((error, idx) => (
                            <li key={idx} className="createEventErrors">{error} </li>
                        ))}
                    </ul>
                    <label className="label">
                        Name
                    </label>
                    <input
                        className='inputClass'
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <label className="label">
                        Description
                    </label>
                    <textarea
                    className="inputClass createEventTextArea"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required>
                    </textarea>
                    <label className="label">
                        Type
                    </label>
                    <select
                        className='inputClass'
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        required
                    >
                        <option value="" ></option>
                        <option value="In person">In person</option>
                        <option value="Online">Online</option>
                    </select>
                    <label className="label">
                        Capacity
                    </label>
                    <input
                        className='inputClass'
                        type="text"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        required
                    />
                    <label className="label">
                        Price
                    </label>
                    <input
                        className='inputClass'
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                    <label className="label">
                        Start Date:
                    </label>
                    <div className="inputDateDiv">
                        <input
                            className='inputClass inputDate'
                            type="date"
                            value={startDateDay}
                            onChange={(e) => setStartDateDay(e.target.value)}
                            required
                        />
                        <input
                            className='inputClass inputDate'
                            type="time"
                            value={startDateTime}
                            onChange={(e) => setStartDateTime(e.target.value)}
                            required
                        />
                    </div>
                    <label className="label">
                        End Date:
                    </label>
                    <div className="inputDateDiv">
                        <input
                            className='inputClass inputDate'
                            type="date"
                            value={endDateDay}
                            onChange={(e) => setEndDateDay(e.target.value)}
                            required
                        />
                        <input
                            className='inputClass inputDate'
                            type="time"
                            value={endDateTime}
                            onChange={(e) => setEndDateTime(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className='submitCreateEventButton'>Submit</button>
                </form>
            </div>
        </>
    );
}

export default CreateEventComponent;
