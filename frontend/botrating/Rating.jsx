import React from 'react';
import _ from 'lodash';
import request from 'superagent'
import { Link } from 'react-router-dom'
import TopHeader from '../misc/TopHeader'
import classNames from 'classnames'
import Spinner from '../misc/SpinnerComponent'
import ButtonWide from '../misc/ButtonWide'
import SquareButton from '../misc/SquareButton'
import SubmittedFeedback from './SubmittedFeedback'
import RatingReason from './RatingReason'
import FailedFeedback from './FailedFeedback'

// var Loader = require('halogenium/DotLoader')

class Rating extends React.Component {
            constructor(props) {
                super(props);
                this.state= {
                    query : this.props.query,
                    FeedbackRating : {
                        value : 5,
                        reason : "",
                    },
                    errorText : "",
                    arr : [0,1,2,3,4,5,6,7,8,9,10],
                    color : [false,false,false,false,false,false,false,false,false,false,false]
                }
            }

            gotoRatingvalue(e) {
                //this.setState({ FeedbackRating: _.extend(thi.state.FeedbackRating, {value:e}) });
                var rate = this.state.FeedbackRating;
                rate.value = e;
                this.setState({FeedbackRating : rate}); 

                console.log(this.state.FeedbackRating.value);
                console.log(this.state.query.psid);
                console.log(this.state.query.botid);
                this.gotoRatingReason(e);
            }


            gotoRatingReason(e) {
                this.state.color[e]= true
                setTimeout( () =>
                    this.props.history.push(`/ratingReason/${this.state.FeedbackRating.value}?psid=${this.props.query.psid}&botid=${this.props.query.botid}`), 1000)
            }

            render() {
                return (
                    <div>
                        <div className='row' style={{ marginTop: '15px' }}>
                            <div className='col-xs-12' style={{fontSize:'20px', fontFamily:'Arial Black'}}>
                                <TopHeader headerText="Feedback"/>
                            </div>
                        </div>
                        <div className='row' style={{marginTop: '20px'}}>
                            <div className='col-xs-12 text-center' style={{fontSize:'18px', fontFamily:'Times New Roman'}} >
                                <span> How likely are you to recommend BotCouture to friends, family or colleagues </span>
                            </div>
                        </div>
                        <div className='row' style={{ marginTop:'10px'}}> 
                            <div>
                                {  this.state.arr && this.state.arr.map(val =>
                                    <div key={val} className='col-xs-1'>
                                    <SquareButton key={val} buttonValue={val} selected={this.state.color[val]} clickHandler={ e => this.gotoRatingvalue(val)}/>
                                    </div>
                                    )
                                }
                            </div>
                            <div className='col-xs-1'></div>
                        </div>

                        <div className='row' style ={{marginTop:'10px'}}>
                            <div className='col-xs-1'>
                                <h4>&nbsp;&nbsp;|</h4>
                            </div>
                            <div className='col-xs-9 text-center'>
                                <h4> &nbsp;&nbsp;&nbsp;&nbsp;| </h4>
                            </div>
                            <div className='col-xs-1 text-center'>
                                <h4> &nbsp;&nbsp;&nbsp;&nbsp;| </h4>
                            </div>
                        </div>
                        <div className='row' style={{marginTop:'10px'}}>
                            <div className='col-xs-3 text-left' style= {{fontSize:'14px', fontFamily:'Times New Roman'}}>
                                <span>Not likely</span>
                            </div>
                            <div className='col-xs-6 text-center' style= {{fontSize:'14px', fontFamily:'Times New Roman'}}>
                                <span>Neutral</span>
                            </div>
                            <div className='col-xs-3 text-left' style= {{fontSize:'14px', fontFamily:'Times'}}>
                                 <span>very likely</span> 
                            </div>
                        </div>
                    </div>      
                );
            }
}

module.exports = Rating
