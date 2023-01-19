import React, { useEffect } from 'react';
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import './CreateEvent.css';
import { thunkCreateEvent } from '../../../store/event';
import { useHistory, useParams } from 'react-router-dom';

function CreateEventComponent() {
    const sessionUser = useSelector(state => state.session.user);
    const {groupId} = useParams();

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
            venueId: +venueId,
            name,
            type,
            description,
            capacity: +capacity,
            price: +price,
            startDate,
            endDate
        }
        return dispatch(thunkCreateEvent(info, groupId))
        .then((res)=>{
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

    return (
        <>
            <div className="formDiv">
                <form onSubmit={handleSubmit} className="form">
                    <ul>
                        {errors.map((error, idx) => (
                            <li key={idx}>{error}</li>
                        ))}
                    </ul>
                    <label>
                        VenueId
                        <input
                            type="text"
                            value={venueId}
                            onChange={(e) => setVenueId(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Name
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Description
                        <textarea
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required>

                        </textarea>
                    </label>
                    <label>
                        Type
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            required
                        >
                            <option value="" ></option>
                            <option value="In person">In person</option>
                            <option value="Online">Online</option>
                        </select>
                    </label>
                    <label>
                        Capacity
                        <input
                            type="text"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Price
                        <input
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Start Date: 
                        <input
                            type="date"
                            value={startDateDay}
                            onChange={(e) => setStartDateDay(e.target.value)}
                            required
                        />
                        <input
                            type="time"
                            value={startDateTime}
                            onChange={(e) => setStartDateTime(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        End Date: 
                        <input
                            type="date"
                            value={endDateDay}
                            onChange={(e) => setEndDateDay(e.target.value)}
                            required
                        /> 
                         <input
                            type="time"
                            value={endDateTime}
                            onChange={(e) => setEndDateTime(e.target.value)}
                            required
                        /> 
                    </label>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </>
    );
}

export default CreateEventComponent;
