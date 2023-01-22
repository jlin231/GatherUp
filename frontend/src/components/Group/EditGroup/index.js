import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { thunkEditGroup } from '../../../store/group';
import { thunkLoadGroupDetails } from '../../../store/group';
import './EditGroup.css';

function EditGroupComponent() {
    const dispatch = useDispatch();
    const history = useHistory();
    let { groupId } = useParams();
    groupId = +groupId;

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [about, setAbout] = useState("");
    const [city, setCity] = useState("");
    const [privacy, setPrivacy] = useState("");
    const [state, setState] = useState("");
    const [errors, setErrors] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    //use current user in store, validation already done in previous component
    const groups = useSelector((state) => state.groups.allGroups);

    useEffect(() => {
        if (groups) {
            const singleGroup = groups[groupId];
            if (singleGroup.private) {
                setPrivacy(1);
            }
            else {
                setPrivacy(0);
            }

            setName(singleGroup.name);
            setAbout(singleGroup.about);
            setType(singleGroup.type);
            setCity(singleGroup.city);
            setState(singleGroup.state);
        }

    }, [groups, groupId])

    //if form has been sumitted, and there are no errors
    useEffect(() => {
        if (hasSubmitted && errors.length === 0) {
            dispatch(thunkLoadGroupDetails(groupId));
            history.push(`/group/${groupId}/about`)
        }
    }, [hasSubmitted, groupId, dispatch, errors.length, history])


    function handleSubmit(e) {
        e.preventDefault();
        //keeps track on if form has been submitted
        setErrors([]);
        setHasSubmitted(false);
        console.log('privacy', privacy);
        console.log('privacy', !!Number(privacy));
        const info = {
            name,
            about,
            type,
            private: !!Number(privacy),
            city,
            state
        }
        console.log(JSON.stringify(info));
        console.log('info', info)
        dispatch(thunkEditGroup(info, groupId)).then(() => {
            //if dispatch does not return an error, then set hasSubmitted to be true
            setHasSubmitted(true);
        })
            .catch(
                async (res) => {
                    // console.log('res', res);
                    const data = await res.json();
                    // console.log('data', data);
                    if (data && data.errors) {
                        // console.log('test')
                        const values = Object.values(data.errors);
                        // console.log('values', values);
                        setErrors([values]);
                        setHasSubmitted(false);
                        // console.log('errors', errors);
                    }
                });
    };

    //inputClass and labl css from signup modal css
    return (
        <div className='edit-group-outer-most-div'>
            <div className='edit-group-text-div'>Edit Group</div>
            <form onSubmit={handleSubmit} className="outerFormDiv">
                <ul>
                    {errors.map((error, idx) => (
                        <li key={idx} className="editGroupErrors">{error} </li>
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
                    className='inputClass textAreaClass'
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
                <button type="submit" className="submitEditGroupButton">Submit</button>
            </form>
        </div>
    );
}

export default EditGroupComponent;
