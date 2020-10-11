import React from 'react'

export default function Casestudies() {
    return (
        <div>
            <div class="caseStudies">
        <div class="row">
            <div class="col-md-12">
                <div class="caseStudiesHeading">
                    <h5>Reports and Case Studies</h5>
                    <hr/>
                </div>
            </div>
            <div class="col-md-3">
                <div class="imgBox">
                    <img src={require('../assets/images/Reports-and-Case-Studies/img-01.png')} alt=""/>
                    <div class="boxHover">
                        <p>Islamophobia in Media</p>
                    </div>

                </div>
            </div>
            <div class="col-md-3">
                <div class="imgBox">
                    <img src={require('../assets/images/Reports-and-Case-Studies/img-02.png')} alt=""/>
                    <div class="boxHover">
                        <p>Islamophobia in Media</p>
                    </div>

                </div>
            </div>
            <div class="col-md-3">
                <div class="imgBox">
                    <img src={require('../assets/images/Reports-and-Case-Studies/img-03.png')} alt=""/>
                    <div class="boxHover">
                        <p>Islamophobia in Media</p>
                    </div>

                </div>
            </div>
            <div class="col-md-3">
                <div class="imgBox">
                    <img src={require('../assets/images/Reports-and-Case-Studies/img-04.png')} alt=""/>
                    <div class="boxHover">
                        <p>Islamophobia in Media</p>
                    </div>

                </div>
            </div>
        </div>
    </div>
        </div>
    )
}
