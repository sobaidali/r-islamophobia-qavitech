import React from 'react'

export default function Categories() {
    return (
    <div class="catergories">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="catergoriesheading">
                        <h5>Islamophobia Catergories</h5>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="catergoriesWrap">
                        <div class="categories-img">
                            <img src={require('../assets/images/Islamophobia-Catergories/Online-Harrasment.png')} alt=""/>
                        </div>
                        <p>Online Harrasment</p>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="catergoriesWrap">
                        <div class="categories-img">
                            <img src={require('../assets/images/Islamophobia-Catergories/Public-Transport.png')} alt=""/>
                        </div>
                        <p>Public Transport Incidents</p>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="catergoriesWrap">
                        <div class="categories-img">
                            <img src={require('../assets/images/Islamophobia-Catergories/Verbal-Physical-Attacks.png')} alt=""/>
                        </div>
                        <p>Verbal/Physical Attacks</p>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="catergoriesWrap">
                        <div class="categories-img">
                            <img src={require('../assets/images/Islamophobia-Catergories/Property-Damage.png')} alt=""/>
                        </div>
                        <p>Property Damage</p>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="catergoriesWrap">
                        <div class="categories-img">
                            <img src={require('../assets/images/Islamophobia-Catergories/Discrimination-School-Work.png')} alt=""/>
                        </div>
                        <p>Discrimination at school/work</p>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="catergoriesWrap">
                        <div class="categories-img">
                            <img src={require('../assets/images/Islamophobia-Catergories/Hate-Post-Email.png')} alt=""/>
                        </div>
                        <p>Hate Post/Email</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}
