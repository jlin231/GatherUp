import React from 'react';
import { useState } from 'react'
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './CreateGroup.css';
import { thunkCreateGroup } from '../../../store/group';

function CreateGroupComponent() {
    const sessionUser = useSelector(state => state.session.user);

    const dispatch = useDispatch();

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
        const info = {
            name,
            type,
            about,
            city,
            private: privacy,
            state,
            previewImage
        }
        console.log('info Before', info)
        return dispatch(thunkCreateGroup(info)).catch(
            async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            }
        );


        //add a redirect to home, or to place to read new group
    };

    return (
        <form onSubmit={handleSubmit}>
            <ul>
                {errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                ))}
            </ul>
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
                About
                <textarea
                    type="text"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    required>

                </textarea>
            </label>
            <label>
                Type
                <select
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                >
                    <option value="In person">In person</option>
                    <option value="Online">Online</option>
                </select>
            </label>
            <label>
                Type
                <select
                    value={privacy}
                    onChange={(e) => setPrivacy(e.target.value)}
                    required
                >
                    <option value={true}>True</option>
                    <option value={false}>False</option>
                </select>
            </label>
            <label>
                City
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                />
            </label>
            <label>
                State
                <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                />
            </label>
            <label>
                State
                <input
                    type="file"
                    value={previewImage}
                    onChange={(e) => setPreviewImage(e.target.value)}
                    required
                />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
}

export default CreateGroupComponent;
