import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import "./SplashPage.css";

function SplashPage() {

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
                <div className="div5">
                    <div className="howMeetUpWorks font">How GatherLater works</div>
                    <div className="MeetNewPeople font">Meet new people who share your interests through online and in-person events. It’s free to create an account.</div>
                </div>
                <div className="div6Buttons">

                </div>
            </div>
        </>
    );
}

export default SplashPage;
