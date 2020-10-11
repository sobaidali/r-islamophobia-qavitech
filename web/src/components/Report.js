import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Report() {
    return (
        <div>
            <div class="reports">
        <div class="container">
            <div class="recorsWrap">
                <div class="row">
                    <div class="col-md-3">
                        <div class="recordsBox">
                            <h2>200</h2>
                            <p>Different Suburbs Reported Incidents</p>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="recordsBox">
                            <h2>70%</h2>
                            <p>Victims are women and children</p>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="recordsBox box-2">
                            <h2>12,000</h2>
                            <p>Reports Submitted</p>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="recordsBox">
                            <h2>35%</h2>
                            <p>Submissions are reported to the Police</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="reportsSecond">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="reportsSecondHeading">
                        <h4>You can report incidents of Islamophobia and anti-Muslim sentiments if:</h4>
                    </div>
                </div>
                <div class="col-md-5">
                    <div class="reportsSecText">
                        <p>If you are the victim who had the Islamophobic behaviour directed at you (whether it is because of your Islamic faith or perceived Islamic faith)</p>
                    </div>
                </div>
                <div class="col-md-2 text-center">
                    <p>OR</p>
                </div>
                <div class="col-md-5">
                    <div class="reportsSecText">
                        <p>If you are the victim who had the Islamophobic behaviour directed at you (whether it is because of your Islamic faith or perceived Islamic faith)</p>
                    </div>
                </div>
                <div class="col-md-12 text-center">
                    <NavLink to="/incident">
                        <button class="btn btn-primery register">REPORT</button>
                    </NavLink>
                </div>
            </div>
        </div>

    </div>
        </div>
    )
}
