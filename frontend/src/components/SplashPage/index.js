import React, { useState } from "react";
import "./SplashPage.css";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from "../SignupFormModal";

function SplashPage() {
    const history = useHistory();
    const sessionUser = useSelector(state => state.session.user);

    return (
        <>
            <div className="whiteSpace"></div>
            <div className="outerMostDiv">
                <div className="div1">
                    <div className="div1Left">
                        <div id="topInfo">The people platform -Where interests become friendships</div>
                        <div id="botInfo">Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it on Meetup. Events are happening every day—log in to join the fun.</div>
                    </div>
                    <div className="div1Right">
                        <img src="https://secure.meetupstatic.com/next/images/shared/online_events.svg?w=640" alt="Not Found" />
                    </div>
                </div>
                <div className="div2Cards">
                    <div id="div2Card1" >
                        <img className="div2Card_img" src="https://www.classicturf.org/wp-content/uploads/2018/02/Capture-highfive1.jpg" alt="Not Found"></img>
                        <div className="div2Text" onClick={() => history.push('/home/events')}>Make new friends <i class="fa-solid fa-arrow-right"></i></div>
                    </div>
                    <div id="div2Card2">
                        <img className="div2Card_img" src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/hiking-quotes-1586278882.jpg" alt="Not Found"></img>
                        <div className="div2Text" onClick={() => history.push('/home/events')}>Gather together <i class="fa-solid fa-arrow-right"></i></div>
                    </div>
                    <div id="div2Card3">
                        <img className="div2Card_img" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2-dFO62qwVG6qZdKEqFy-rFssgRiw8kFrRg&usqp=CAU" alt="Not Found"></img>
                        <div className="div2Text" onClick={() => history.push('/home/events')}>Collaborate for Goals <i class="fa-solid fa-arrow-right"></i></div>
                    </div>
                </div>
                <div className="div5">
                    <div className="howMeetUpWorks font">How GatherLater works</div>
                    <div className="MeetNewPeople font">Meet new people who share your interests through online and in-person events. It’s free to create an account.</div>
                </div>
                <div className="div6Buttons">
                    <div className='div6Card1'>
                        <img className="div6Card_img" src='https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=256' alt="Not Found"></img>
                        <div className="div6CardText" onClick={() => history.push('/home/groups')}>Join a Group</div>
                        <div>Do what you love, meet others who love it, find your community. The rest is history!</div>
                    </div>
                    <div className='div6Card2'>
                        <img className="div6Card_img" src='https://secure.meetupstatic.com/next/images/shared/ticket.svg?w=256' alt="Not Found"></img>
                        <div className="div6CardText" onClick={() => history.push('/home/events')}>Find an event</div>
                        <div>Events are happening on just about any topic you can think of, from online gaming and photography to yoga and hiking.</div>
                    </div>
                    <div className='div6Card3'>
                        <img className="div6Card_img" src='https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=256' alt="Not Found"></img>
                        <div className="div6CardText" onClick={() => history.push('/group/create')}>Start a group</div>
                        <div>You don’t have to be an expert to gather people together and explore shared interests.</div>
                    </div>
                </div>
                <div className="div7JoinButton">

                        <button className="joinMeetUpButton">Join Meetup</button>
                </div>
            </div>

        </>
    );
}

export default SplashPage;
