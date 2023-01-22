import React from 'react';
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import './CreateGroup.css';
import { thunkCreateGroup } from '../../../store/group';
import { useHistory } from 'react-router-dom';

function CreateGroupComponent() {
    const sessionUser = useSelector(state => state.session.user);

    const dispatch = useDispatch();
    const history = useHistory();

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [about, setAbout] = useState("");
    const [city, setCity] = useState("");
    const [privacy, setPrivacy] = useState("");
    const [state, setState] = useState("");
    const [previewImage, setPreviewImage] = useState("");
    const [errors, setErrors] = useState([]);

    function handleSubmit(e) {
        e.preventDefault();
        setErrors([]);
        const info = {
            name,
            type,
            about,
            city,
            private: !!Number(privacy),
            state,
            previewImage
        }
        return dispatch(thunkCreateGroup(info)).then((res) => {
            console.log('gets to push');
            history.push(`/group/${res.id}/about`);
        }).catch(async (res) => {
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
        <div className='create-group-outer-most-div'>
            <div className='create-group-text-div'>Create Group</div>
            <form onSubmit={handleSubmit} className="outerCreateEventFormDiv">
                <ul>
                    {errors.map((error, idx) => (
                        <li key={idx} className="createGroupErrors">{error}</li>
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
                    About
                </label>
                <textarea
                    className='inputClass createGroupTextArea'
                    type="text"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
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
                    Private
                </label>
                <select
                    className='inputClass'
                    value={privacy}
                    onChange={(e) => setPrivacy(e.target.value)}
                    required
                >
                    <option value=""></option>
                    <option value={1}>True</option>
                    <option value={0}>False</option>
                </select>
                <label className="label">
                    City
                </label>
                <input
                    className='inputClass'
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                />
                <label className="label">
                    State
                </label>
                <input
                    className='inputClass'
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                />
                <label className="label">
                    Image
                </label>
                <input
                    className='inputClass'
                    type="url"
                    value={previewImage}
                    onChange={(e) => setPreviewImage(e.target.value)}
                    required
                />
                <button type="submit" className='submitCreateGroupButton'>Submit</button>
            </form>
        </div>
    );
}

export default CreateGroupComponent;
