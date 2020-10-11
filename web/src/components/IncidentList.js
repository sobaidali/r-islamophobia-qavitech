import React, { Component, Fragment } from 'react';
import Axios from '../constants/constants';
import InfiniteScroll from 'react-infinite-scroll-component';
import dayjs from 'dayjs'

import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

//Immutability helper
import update from 'immutability-helper';

//React Image Lightbox
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

class IncidentList extends Component {
    constructor(props) {
        super(props)

        this.state={
            incidentList: [],
            show: false,
            collapse: 0,

            oDataLink: '',
            imgPrev: [],
            isOpen: false,
            photoindex: 0,
            openIndex: null
        }
    }

    // componentDidMount() {
    //     this.fetchData(this.state.oDataLink)
    // }

    fetchData = (dataLink) => {
        Axios
            .post('/incident/list', 
            {
                oDataLink: `${dataLink}`
            }
            ,
            {
                headers: {"Authorization": localStorage.getItem('jwtToken'), "Content-Type": "application/json"}
            })
            .then(res => {
                this.setState({
                    incidentList: [...this.state.incidentList, ...res.data.newrecord.data],
                    oDataLink: res.data.newrecord.oDataLink
                })
            })
    }

    toggle = (index) => {
        this.setState({
            collapse: index,
            show: true
        })
    }

    onPreview = (ind, index, src) => {

        this.setState({
            isOpen: true,
            photoindex: index,
            imgPrev: [...this.state.imgPrev, src],
            openIndex: ind
        })
    }

    render() {
        const { incidentList } = this.state

        var incident_list = incidentList.length !== 0 ? (incidentList.map((incident, index) => (


            <Accordion>
            
                <Card className="border-0 rounded shadow-sm my-3">
                    <Card.Header className="border-0 card-header py-2">
                        <Accordion.Toggle as={Button} variant="link" eventKey="0" style={{width: "100%"}}>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h4 class="card-title m-0 truncate">
                                        {String(incident.new_canyoutellusabouttheincident)} ({(String((dayjs(incident.new_dateandtimeonwhichincidenthappened).format('MM/DD/YYYY h:mm:ss A'))))})
                                    </h4>
                                </div>
                                <div>
                                    <i className="fa fa-plus"></i>
                                </div>
                            </div>
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0" className="container">
                        <Card.Body className="m-0 p-0">
                            <hr class="PinkHr"/>
                            <div class="row no-gutters py-2">
                                <div class="col-md">

                                    <Card.Body>
                                        <Card.Title className="f-16"> Who is filling out this form?</Card.Title>
                                        
                                        {incident.new_whoisfillingoutthisform === 100000000 && <Card.Text class="text-muted">Victim</Card.Text>}
                                        {incident.new_whoisfillingoutthisform === 100000001 && <Card.Text class="text-muted">Victim's Friend / Relative</Card.Text>}
                                        {incident.new_whoisfillingoutthisform === 100000002 && <Card.Text class="text-muted">Witness</Card.Text>}
                                    </Card.Body>

                                    <hr class="m-2"/>
                                    
                                    <Card.Body>
                                        <Card.Title className="f-16"> The incident was experienced/witnessed?</Card.Title>
                                        {incident.new_theincidentwasexperiencedwitnessed === 100000000  && <Card.Text class="text-muted">In real life as physical incident</Card.Text>}
                                        {incident.new_theincidentwasexperiencedwitnessed === 100000001  && <Card.Text class="text-muted">Online or broadcast as a non-physical incident</Card.Text>}
                                    </Card.Body>
                                    
                                    <hr class="m-2"/>
                                    
                                    <Card.Body>
                                        <Card.Title className="f-16">Type of Incident</Card.Title>

                                        <Card.Text>
                                            {(incident.new_typeofincident && incident.new_typeofincident.split(',').some(element=> element === "100000000")) && <li>Abusive Behaviour</li>}
                                            {(incident.new_typeofincident && incident.new_typeofincident.split(',').some(element=> element === "100000001")) && <li>Threatening Behaviour</li>}
                                            {(incident.new_typeofincident && incident.new_typeofincident.split(',').some(element=> element === "100000002")) && <li>Assault</li>}
                                            {(incident.new_typeofincident && incident.new_typeofincident.split(',').some(element=> element === "100000003")) && <li>Vandalism</li>}
                                            {(incident.new_typeofincident && incident.new_typeofincident.split(',').some(element=> element === "100000004")) && <li>Discrimination</li>}
                                            {(incident.new_typeofincident && incident.new_typeofincident.split(',').some(element=> element === "100000005")) && <li>Hate Speech</li>}
                                            {(incident.new_typeofincident && incident.new_typeofincident.split(',').some(element=> element === "100000006")) && <li>Anti-Muslim Literature</li>}
                                            {(incident.new_typeofincident && incident.new_typeofincident.split(',').some(element=> element === "100000007")) && <li>Online content or abuse</li>}
                                        </Card.Text>
                                    </Card.Body>

                                    <hr class="m-2"/>
                                    
                                    <Card.Body>
                                        <Card.Title className="f-16"> Date and time on which incident happened?</Card.Title>

                                        <Card.Text class="text-muted">{String(dayjs(incident.new_dateandtimeonwhichincidenthappened).format('MM/DD/YYYY h:mm:ss A'))}</Card.Text>
                                    </Card.Body>
                                                                
                                    <hr class="m-2"/>
                                    
                                    <div className="container">

                                        <Card.Body class="row">
                                            <div class="col-md-4">
                                                <Card.Title className="f-16">Victim's Gender</Card.Title>

                                                {incident.new_victimsgender === 100000000 && <Card.Text class="text-muted">Male</Card.Text>}
                                                {incident.new_victimsgender === 100000001 && <Card.Text class="text-muted">Female</Card.Text>}
                                                {incident.new_victimsgender === 100000002 && <Card.Text class="text-muted">Not Applicable</Card.Text>}
                                            </div>
                                            <div class="col-md-4">
                                                <Card.Title className="f-16">Victim's Age Group</Card.Title>

                                                {incident.new_victimsagegroup === 100000000 && <Card.Text class="text-muted">0-9</Card.Text>}
                                                {incident.new_victimsagegroup === 100000001 && <Card.Text class="text-muted">10-20</Card.Text>}
                                                {incident.new_victimsagegroup === 100000002 && <Card.Text class="text-muted">21-30</Card.Text>}
                                                {incident.new_victimsagegroup === 100000003 && <Card.Text class="text-muted">31-40</Card.Text>}
                                                {incident.new_victimsagegroup === 100000004 && <Card.Text class="text-muted">41-50</Card.Text>}
                                                {incident.new_victimsagegroup === 100000005 && <Card.Text class="text-muted">51 or above</Card.Text>}
                                                {incident.new_victimsagegroup === 100000006 && <Card.Text class="text-muted">Do not know/not sure</Card.Text>}
                                                {incident.new_victimsagegroup === 100000007 && <Card.Text class="text-muted">Not Applicable (e.g targeting all muslims)</Card.Text>}
                                            </div>
                                            <div class="col-md-4">
                                                <Card.Title className="f-16">Victim's Ethnicity</Card.Title>

                                                <Card.Text class="text-muted">{String(incident.new_victimsethnicity) === 'null' ? '' : String(incident.new_victimsethnicity)}</Card.Text>
                                            </div>
                                        </Card.Body>
                                        
                                        <hr class="m-2"/>
                                        
                                        <Card.Body class="row">
                                            <div class="col-md-4">
                                                <Card.Title className="f-16">Perpetrator's Gender</Card.Title>

                                                {incident.new_perpetratorsgender === 100000000 && <Card.Text class="text-muted">Male</Card.Text>}
                                                {incident.new_perpetratorsgender === 100000001 && <Card.Text class="text-muted">Female</Card.Text>}
                                                {incident.new_perpetratorsgender === 100000002 && <Card.Text class="text-muted">Not Applicable</Card.Text>}
                                            </div>
                                            <div class="col-md-4">
                                                <Card.Title className="f-16">Perpetrator's Age Group</Card.Title>

                                                {incident.new_perpetratorsagegroup === 100000000 && <Card.Text class="text-muted">0-9</Card.Text>}
                                                {incident.new_perpetratorsagegroup === 100000001 && <Card.Text class="text-muted">10-20</Card.Text>}
                                                {incident.new_perpetratorsagegroup === 100000002 && <Card.Text class="text-muted">21-30</Card.Text>}
                                                {incident.new_perpetratorsagegroup === 100000003 && <Card.Text class="text-muted">31-40</Card.Text>}
                                                {incident.new_perpetratorsagegroup === 100000004 && <Card.Text class="text-muted">41-50</Card.Text>}
                                                {incident.new_perpetratorsagegroup === 100000005 && <Card.Text class="text-muted">51 or above</Card.Text>}
                                                {incident.new_perpetratorsagegroup === 100000006 && <Card.Text class="text-muted">Do not know/not sure</Card.Text>}
                                            </div>
                                            <div class="col-md-4">
                                                <Card.Title className="f-16">Perpetrator's Ethnicity</Card.Title>

                                                <Card.Text class="text-muted">{String(incident.new_perpetratorsethnicity) === 'null' ? '' : String(incident.new_perpetratorsethnicity)}</Card.Text>
                                            </div>
                                        </Card.Body>
                                        
                                    </div>

                                    <hr class="m-2"/>
                                    
                                    <Card.Body>
                                        <Card.Title className="f-16">Can you tell us the incident? Please give details of what, where, when, how happened.*</Card.Title>

                                        <Card.Text class="text-muted">
                                            {String(incident.new_canyoutellusabouttheincident)}
                                        </Card.Text>
                                    </Card.Body>
                                                                
                                    <hr class="m-2"/>
                                    
                                    <div className="container">

                                        <Card.Body class="row">
                                            <div class="col-md-12 my-3">
                                                <Card.Title className="f-16">Tell us more about where this incident occurred.</Card.Title>
                                            </div>
                                            <div class="col-md-4">
                                                <Card.Title className="f-16">Street Name</Card.Title>

                                                <Card.Text class="text-muted">{String(incident.new_streetname) === 'null' ? '' : String(incident.new_streetname)}</Card.Text>
                                            </div>
                                            <div class="col-md-4">
                                                <Card.Title className="f-16">Post Code</Card.Title>

                                                <Card.Text class="text-muted">{String(incident.new_postcode) === 'null' ? '' : String(incident.new_postcode)}</Card.Text>
                                            </div>
                                            <div class="col-md-4">
                                                <Card.Title className="f-16">Town or City</Card.Title>

                                                <Card.Text class="text-muted">{String(incident.new_townorcity) === 'null' ? '' : String(incident.new_townorcity)}</Card.Text>
                                            </div>
                                        </Card.Body>
                                                                                                
                                        <hr class="m-2"/>
                                        
                                        <Card.Body class="row">
                                            <div class="col-md-4">
                                                <Card.Title className="f-16">Were there witnesses present?</Card.Title>

                                                {incident.new_werethereanywitnessespresent === 100000000 && <Card.Text>Yes</Card.Text>}
                                                {incident.new_werethereanywitnessespresent === 100000001 && <Card.Text>No</Card.Text>}
                                                {incident.new_werethereanywitnessespresent === 100000002 && <Card.Text>Not Applicable</Card.Text>}
                                            </div>
                                            <div class="col-md-4">
                                                <Card.Title className="f-16">Are you aware of CCTV in the area?</Card.Title>

                                                {incident.new_areyouawareofcctvinthearea === 100000000 && <Card.Text>Yes</Card.Text>}
                                                {incident.new_areyouawareofcctvinthearea === 100000001 && <Card.Text>No</Card.Text>}
                                                {incident.new_areyouawareofcctvinthearea === 100000002 && <Card.Text>Not Applicable</Card.Text>}
                                            </div>
                                        </Card.Body>
                                    
                                    </div>

                                    <hr class="m-2"/>
                                    
                                    <Card.Body>
                                        <Card.Title className="f-16">Any supporting documents</Card.Title>
                                        <span class="d-none"> {this.state.imgPrev[index] = []}</span>
                                        <div class="IncidentListImg my-3 d-flex">
                                            <Card.Text><img src={"data:image/gif;base64,"+ incident.new_supportingdocuments} onClick={()=>this.onPreview(index, 0, "data:image/gif;base64,"+ incident.new_supportingdocuments)} alt=""/></Card.Text>
                                            <Card.Text><img src={"data:image/gif;base64,"+ incident.new_supportingdocuments2} onClick={()=>this.onPreview(index, 1, "data:image/gif;base64,"+ incident.new_supportingdocuments2)} alt=""/></Card.Text>
                                            <Card.Text><img src={"data:image/gif;base64,"+ incident.new_supportingdocuments3} onClick={()=>this.onPreview(index, 2, "data:image/gif;base64,"+ incident.new_supportingdocuments3)} alt=""/></Card.Text>
                                            <Card.Text><img src={"data:image/gif;base64,"+ incident.new_supportingdocuments4} onClick={()=>this.onPreview(index, 3, "data:image/gif;base64,"+ incident.new_supportingdocuments4)} alt=""/></Card.Text>
                                            <Card.Text><img src={"data:image/gif;base64,"+ incident.new_supportingdocuments5} onClick={()=>this.onPreview(index, 4, "data:image/gif;base64,"+ incident.new_supportingdocuments5)} alt=""/></Card.Text>
                                            
                                            {/* {this.state.imgPrev[index] = []} */}
                                            
                                            <span class="d-none">{incident.new_supportingdocuments && this.state.imgPrev[index].push("data:image/gif;base64,"+ incident.new_supportingdocuments)}</span>
                                            <span class="d-none">{incident.new_supportingdocuments2 && this.state.imgPrev[index].push("data:image/gif;base64,"+ incident.new_supportingdocuments2)}</span>
                                            <span class="d-none">{incident.new_supportingdocuments3 && this.state.imgPrev[index].push("data:image/gif;base64,"+ incident.new_supportingdocuments3)}</span>
                                            <span class="d-none">{incident.new_supportingdocuments4 && this.state.imgPrev[index].push("data:image/gif;base64,"+ incident.new_supportingdocuments4)}</span>
                                            <span class="d-none">{incident.new_supportingdocuments5 && this.state.imgPrev[index].push("data:image/gif;base64,"+ incident.new_supportingdocuments5)}</span>
                                    
                                        </div>
                                    </Card.Body>
                                                                
                                    <hr class="m-2"/>
                                    
                                    <Card.Body>
                                        <Card.Title className="f-16">Was the victim wearing any religious clothing or other religious markers (eg. a beard) at the time of the incident?</Card.Title>

                                            {incident.new_victimwearinganyreligiousclothing === 100000000 && <Card.Text>Yes</Card.Text>}
                                            {incident.new_victimwearinganyreligiousclothing === 100000001 && <Card.Text>No</Card.Text>}
                                            {incident.new_victimwearinganyreligiousclothing === 100000002 && <Card.Text>Not Applicable</Card.Text>}
                                    </Card.Body>
                                    
                                    <hr class="m-2"/>
                                    
                                    <Card.Body>
                                        <Card.Title className="f-16">If you feel like you were affected by the incident, can you select which emotions you felt?</Card.Title>

                                        <Card.Text class="text-muted">
                                            {(incident.new_emotionsyoufeltfollowingincident && incident.new_emotionsyoufeltfollowingincident.split(',').some(element=>element === "100000000")) && <li>Anger (annoyance, fury, irritation, frustration, rage, sickened etc.)</li>}
                                            {(incident.new_emotionsyoufeltfollowingincident && incident.new_emotionsyoufeltfollowingincident.split(',').some(element=>element === "100000001")) && <li>Sadness (hopelessness, helplessness, upset, despair)</li>}
                                            {(incident.new_emotionsyoufeltfollowingincident && incident.new_emotionsyoufeltfollowingincident.split(',').some(element=>element === "100000002")) && <li>Fear or worry (concern, nervous, panic etc.)</li>}
                                            {(incident.new_emotionsyoufeltfollowingincident && incident.new_emotionsyoufeltfollowingincident.split(',').some(element=>element === "100000003")) && <li>Humiliation (shame and embarrassment)</li>}
                                            {(incident.new_emotionsyoufeltfollowingincident && incident.new_emotionsyoufeltfollowingincident.split(',').some(element=>element === "100000004")) && <li>Disappointment or surprised/shocked</li>}
                                        </Card.Text>
                                    </Card.Body>
                                                                
                                    <hr class="m-2"/>
                                    
                                    <Card.Body>
                                        <Card.Title className="f-16">
                                            Can you tell us if the incident left any long-term impact? If so, what type of impact?
                                        </Card.Title>

                                        <Card.Text class="text-muted">
                                            {String(incident.new_incidentleftanylongtermimpact) === 'null' ? '' : String(incident.new_incidentleftanylongtermimpact)}
                                            
                                        </Card.Text>
                                    </Card.Body>
                                                                                            
                                    <hr class="m-2"/>
                                    
                                    <Card.Body>
                                        <Card.Title className="f-16">
                                            Will you or have you reported to police?
                                        </Card.Title>

                                            {incident.new_haveyoureportedtopolice === true && <Card.Text>Yes</Card.Text>}
                                            {incident.new_haveyoureportedtopolice === false && <Card.Text>No</Card.Text>}
                                    </Card.Body>
                                                                                                                        
                                    <hr class="m-2"/>
                                    
                                    <Card.Body>
                                        <Card.Title className="f-16">
                                            Do you want the Register to forward a copy of this report to the Police for their records?
                                        </Card.Title>

                                        <Card.Text class="text-muted">

                                            {incident.new_registertoforwardacopyofthisreport === true && <Card.Text>Yes</Card.Text>}
                                            {incident.new_registertoforwardacopyofthisreport === false && <Card.Text>No</Card.Text>}
                                        </Card.Text>
                                    </Card.Body>
                                </div>
                            </div>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        
        ))) : ('')

        return (
            <Fragment>
                <section class="IncidentListPage">
                    <div class="sec-title text-center col-md-12 py-5 bg-grayy">
                        <div class="mb-5">
                            My Incident List
                            {/* Incident's List */}
                            <hr/>
                        </div>
                    </div>
                    <div className="my-5">
                        <InfiniteScroll
                                className='container'
                                dataLength={this.state.incidentList.length} //This is important field to render the next data
                                next={this.fetchData(this.state.oDataLink)}
                                hasMore={true}
                        >
                            {incident_list}
                        </InfiniteScroll>
                    </div>
                    {this.state.isOpen && (
                        <Lightbox
                            mainSrc={this.state.imgPrev[this.state.openIndex][this.state.photoindex]}
                            nextSrc={this.state.imgPrev[this.state.openIndex][(this.state.photoindex + 1) % this.state.imgPrev[this.state.openIndex].length]}
                            prevSrc={this.state.imgPrev[this.state.openIndex][(this.state.photoindex + this.state.imgPrev[this.state.openIndex].length - 1) % this.state.imgPrev[this.state.openIndex].length]}
                            onCloseRequest={() => this.setState({ isOpen: false })}
                            onMovePrevRequest={() => {
                                this.onPreview(this.state.openIndex, ((this.state.photoindex + this.state.imgPrev[this.state.openIndex].length - 1) % this.state.imgPrev[this.state.openIndex].length))
                            }}
                            onMoveNextRequest={() => {
                                this.onPreview(this.state.openIndex, ((this.state.photoindex + 1) % this.state.imgPrev[this.state.openIndex].length))
                            }}
                        />
                    )}
                </section>
            </Fragment>
        )
    }
}


export default IncidentList
