import React from 'react'

export default function Footer() {
    return (
            <div class="footer">
        <div class="container">
            <div class="row item-align-center">
                <div class="col-md-12">
                    <div class="footerWrap">
                        <div class="footerLogoImg">
                            <img src={require('../assets/images/Islamophobia-Logo-White.svg')} alt=""/>
                        </div>
                        <div class="social">
                                {/* <div class="col-md-3">
                                    <img src={require('../assets/images/footer-icon1.png')} alt=""/>
                                </div> */}
                                <ul className="p-0 d-inline-flex">
                                    <li className="px-2"><a href="">
                                        <i aria-hidden="true" class="fa fa-twitter"></i>
                                    </a></li>
                                    <li className="px-2"><a href="">
                                        <i aria-hidden="true" class="fa fa-instagram"></i>
                                    </a></li>
                                    <li className="px-2"><a href="">
                                        <i aria-hidden="true" class="fa fa-youtube"></i>
                                    </a></li>
                                    <li className="px-2"><a href="">
                                        <i aria-hidden="true" class="fa fa-linkedin"></i>
                                    </a></li>
                                </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}
