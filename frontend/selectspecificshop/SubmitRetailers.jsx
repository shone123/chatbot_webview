import React from 'react';
import _ from 'lodash';
import request from 'superagent'
import { Link } from 'react-router-dom'
import TopHeader from '../misc/TopHeader'
import classNames from 'classnames'
import Spinner from '../misc/SpinnerComponent'
import ButtonWide from '../misc/ButtonWide'
import SelectRetailers from './SelectRetailers'
import ErrorComponent from '../misc/ErrorComponent'


class SubmitRetailers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected_retailers: [],
            validity: "",
            apply_flag:0, 
        }
    }

    componentDidMount() {
        let sel = (this.props.match.params.selstr).split(",")
        console.log("first entered component did mount")
        console.log(sel)
        let selarr = sel.map(function(a) {
            let b = {}
             b.key = a
             b.value = "https://s3.amazonaws.com/xpressobrand/images/"+a
            return b
        })
        this.setState({
            selected_retailers : selarr}, () => {
            console.log(this.state.selected_retailers)    
        }) 
         
    }

    gotoBack() {
        console.log("going back to select retailers")
        this.props.history.push(`/selectretailers?psid=${this.props.query.psid}&botid=${this.props.query.botid}`);
    }

    applyFilter() {
        let retailer_names = this.state.selected_retailers.map(function(retailer) {
            return retailer.key
        })
        console.log("entered apply filter")
        
        let SelectedRetailers = {
            retailers : retailer_names,
            validity : this.state.validity,
        }
        console.log(SelectedRetailers)
        request.post(`/api/setretailerPreference`)
        .send({
            psid : this.props.query.psid,
            botid : this.props.query.botid,
            selectedretailers : SelectedRetailers,
        })
        .then( res => {
            console.log("response is ",res)
            console.log("response txt is ",res.text)
            if(res.text==="success") {
              this.props.history.push(`/submittedFeedback/selectshop?psid=${this.props.query.psid}&botid=${this.props.query.botid}`)
            }
        })
        .catch(err => {
            if ( err && err.status ) {
                this.setState( { showSpinner : false, errorText: err.response.text } )
            }
            else {
                this.setState( { showSpinner : false, errorText: 'Server Error' } )
            }
            console.log(err);
            this.props.history.push(`/failedFeedback/selectshop?psid=${this.props.query.psid}&botid=${this.props.query.botid}`)
          //  this.props.history.push(`/failedFeedback?psid=${this.props.query.psid}&botid=${this.props.query.botid}`);
        })     

    }

    gotoSession() {
        let apply_flag = !(this.state.apply_flag)
        if(this.state.validity === "session") {
            this.setState({
                validity : 'permanent',
                apply_flag : apply_flag
            }, () => {
                console.log("validity is changed from session to ",this.state.validity)
            })
        } else {
            this.setState({
                validity : "session",
                apply_flag : apply_flag
            }, () => {
                console.log("validity is changed from permanent to ",this.state.validity)
            })
        }
    }

    onError(e,val) {
        console.log("entered on error function", val)
        switch(val.key) {
            case 'kohl\'s':    
                e.target.src = '/images/shop_icons/kohls.jpg'
                break;
            case 'macy\'s':
                e.target.src = '/images/shop_icons/macys.jpg'
                break;
            case 'nordstorm' :
                e.target.src= '/images/shop_icons/nordstrom.png'
                break;
            case 'renttherunway' :
                e.target.src = '/images/shop_icons/renttherunway.png'
                break;
            case 'forever21' :
                e.target.src = '/images/shop_icons/forever21.jpg'
                break;
            case 'express' :
                e.target.src = '/images/shop_icons/express.png'                
                break;
            case 'lkbennett' :
                e.target.src = '/images/shop_icons/lkbennett.png'            
                break;
            default :    
                e.target.src = '/images/not available.jpg'
        } 
    }

    gotoPermanent() {
        let apply_flag = !(this.state.apply_flag)
        if(this.state.validity === "permanent") {
            this.setState({
                apply_flag : apply_flag
            }, () => {
                console.log("validity has been selected as permanent by the user himself")                
            })
        }
        else {
            this.setState({
                validity : "permanent",
                apply_flag : apply_flag
            }, () => {
                console.log("validity is changed from session to ",this.state.vaidity)
            })   
        }
    }
    render() {
        let page = null
        page = <div>
                    <div className='row'>
                        <div className='col-xs-12' style={{ marginTop: '15px', fontFamily:'Arial Black' }}>
                            <TopHeader headerText="Select Retailers"/>
                        </div>
                    </div>

                    <div className='row' style={{marginLeft:'15px','marginTop':'20px',fontFamily:'Times New Roman'}} >You have chosen to limit your current search to the brands below...</div>

                    <div className='row' style={{marginBottom:'20px'}}>  
                        { this.state.selected_retailers && this.state.selected_retailers.map( (val, index) =>    
                            <div className='col-xs-4' key = {index} style={{marginBottom:'15px'}}> 
                                <img key={val.key} className='img-thumbnail' onError={e => this.onError(e,val)} src={val.value} style={{border:'solid 2px #e6e6fa'}}>
                                </img> 
                            </div>    
                        )
                    }
                    </div>

                    <div className='row' style={{marginLeft:'15px'}} >
                        <div className='checkbox' id = "sessiononly" style={{fontFamily:'Times New Roman'}}>
                            <label>
                            <input type='checkbox' onClick={() => this.gotoSession() } value=""/>
                                use for this session only
                            </label>
                        </div>

                        <div className="w-100"></div>
                        
                        <div className='checkbox' id = 'permanent' style={{fontFamily:'Times New Roman'}}>
                          <label>
                            <input type="checkbox" onClick={ ()=>this.gotoPermanent() } value="true"/>
                                Save and apply to future searches
                          </label>
                        </div>
                    </div>

                    <div className='row center-block' style={{ position: 'fixed', bottom: '0', width: '100%', marginLeft: '-15px', padding: '15px 0', background: 'white', fontFamily:'Time New Roman' }}>
                        <div className='col-xs-6'>   
                        <ButtonWide buttonText="BACK" selected={false} clickHandler={ e => this.gotoBack() } />
                        </div>
                        
                        <div className='col-xs-6'>
                        {
                            Boolean(this.state.apply_flag)?
                            <button type='button' className='btn-lg btn-block btn-warning' onClick={ e => this.applyFilter() } style={{ fontSize: '14px' }} >APPLY</button> :    
                            <button type='button' className='btn-lg btn-block' style={{ fontSize: '14px' }} >APPLY</button>
                        }
                        </div>    
                    </div>
                </div>

        if ( this.state.errorText ) {
            page = <ErrorComponent errorText={this.state.errorText} />
        }

        return(
            <div>{page}</div>
        );
    }

}

module.exports = SubmitRetailers