import React from 'react'

export default function Introduction() {
    return (
        <div className="saferFuture mt-5">
        <div className="container">
            <div className="row item-align-center">
                <div className="col-md-7 card-body">
                    <div className="content ">
                        <h4>For a Safer Future</h4>
                        <hr/>
                        <h2>Islamophobia Australia</h2>
                        <h3>Catalyst for change</h3>
                        <p>The Islamophobia Australia was founded on 2019 in response to the growing anecdotal evidence suggesting a rise in incidents of Islamophobia. The Islamophobia Australia was the first of its kind in Australia to provide a unique
                            platform for incidents of Islamophobia to be reported, recorded and analysed </p>
                        <p> Our findings have informed media and the general public both in Australia and abroad about Islamophobia.</p>
                    </div>
                </div>
                <div className="col-md-5 card-body">
                    <div className="image ">
                        <img src={require('../assets/images/Islamophobia-Australia.png')} alt=""/>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}
