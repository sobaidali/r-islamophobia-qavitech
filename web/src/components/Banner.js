import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Banner() {
    return (
        <div class="banner">
        <div class="bannerText ">
            <h6>IslamophobiaAustralia </h6>
            <h1>Report Incidents of Islamophobia</h1>
            <h2>& anti-Muslim Sentiments in Australia</h2>
            <NavLink to="/incident">
                <button class="btn btn-primery">Report</button>
            </NavLink>
        </div>
    </div>
    )
}
