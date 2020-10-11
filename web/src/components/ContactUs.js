import React, { Fragment } from 'react'

const ContactUs = () => {
    return (
            <section className="ContactPage mb-5">
        <div className="sec-title text-center col-md-12 py-5 bg-grayy">
            <div className="mb-5">
                Get in touch with us now
                <hr/>
            </div>
        </div>
        <div className="col-md-8 mx-auto bg-white p-3 my-5 text-center d-flex">
            <div className="col-md-3 py-3 px-2 shadow-hover">
                <div className="contactWrap">
                    <div className="contactWrapimg">
                        <i className="fa fa-map-marker" aria-hidden="true"></i>
                    </div>
                    <p>Our Address</p>
                    <a href="">
                        <h6>Suite 320 worth street</h6>
                        <h6>Chullora NSW 2190 Austarlia</h6>
                    </a>
                </div>
            </div>
            <div className="col-md-3 py-3 px-2 shadow-hover">
                <div className="contactWrap">
                    <div className="contactWrapimg">
                        <i className="fa fa-phone" aria-hidden="true"></i>
                    </div>
                    <p>Call us </p>
                    <a href="">
                        <h6>
                            <strong>Telephone:</strong> (02) 9887 456 
                        </h6>
                    </a>
                    <a href=""></a>
                    <a href=""></a>

                    <h6>
                        <strong>Mobile:</strong> (02) 9887 456 
                    </h6>
                    <h6>
                        <strong>Fax:</strong> (02) 9887 456 
                    </h6>
                </div>
            </div>
            <div className="col-md-3 py-3 px-2 shadow-hover">
                <div className="contactWrap">
                    <div className="contactWrapimg">
                        <i className="fa fa-envelope" aria-hidden="true"></i>
                    </div>
                    <p>Email & Website:</p>
                    <h6>
                        <strong>Mail:</strong> info@example.com
                    </h6>
                    <h6>
                        <strong>Website:</strong> www.infoExample.com
                    </h6>
                </div>
            </div>
            <div className="col-md-3 py-3 px-2 shadow-hover">
                <div className="contactWrap">
                    <div className="contactWrapimg">
                        <i className="fa fa-globe" aria-hidden="true"></i>
                    </div>
                    <p>Social Media:</p>
                    <h6>
                        <a href="">
                            <i className="fa fa-facebook"></i>
                        </a>
                        <a href="">
                            <i className="fa fa-whatsapp"></i>
                        </a>
                        <a href="">
                            <i className="fa fa-instagram"></i>
                        </a>
                        <a href="">
                            <i className="fa fa-youtube"></i>
                        </a>
                        <a href="">
                            <i className="fa fa-twitter"></i>
                        </a>
                    </h6>
                    
                </div>
            </div>            
        </div>
        {/* <div className="container">
            <hr/>
        </div>
        <div className="sec-title text-center col-md-12 py-3">
            <div className="mb-5">
                Send us a message
                <hr/>
            </div>
        </div>
        <div className="col-md-6 mx-auto ContactForm">
          
            <form>
                <div className="form-row">

                    <div className="form-group col-md-6">
                        <input type="text" className="form-control mb-3 pl-2" id="name" placeholder="Your Name*" required/>
                    </div>
                    <div className="form-group col-md-6">
                        <input type="text" className="form-control mb-3 pl-2" id="subject" placeholder="Subject*" required/>
                    </div>
                    <div className="form-group col-md-6">
                        <input type="text" className="form-control mb-3 pl-2" id="email" placeholder="Email*" required/>
                    </div>
                    <div className="form-group col-md-6">
                        <input type="text" className="form-control mb-3 pl-2" id="phone" placeholder="Phone*" required/>
                    </div>
                    <div className="form-group col-md-12">
                        <textarea id="subject" name="subject" placeholder="Write something.." className="w-100"></textarea>
                    </div>

                </div>
                <button type="submit" className="btn btn-primary border-0 ThemePurpleBGColor px-5 rounded-0 submit mt-5">SUBMIT</button>
            </form>
            
        </div> */}
    </section>
    )
}

export default ContactUs;
