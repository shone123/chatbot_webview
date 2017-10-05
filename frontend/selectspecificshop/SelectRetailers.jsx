import React from 'react';
import _ from 'lodash';
import request from 'superagent'
import { Link } from 'react-router-dom'
import TopHeader from '../misc/TopHeader'
import classNames from 'classnames'
import Spinner from '../misc/SpinnerComponent'
import ButtonWide from '../misc/ButtonWide'
import ErrorComponent from '../misc/ErrorComponent'
import SubmitRetailers from './SubmitRetailers'

class SelectRetailers extends React.Component {
	constructor(props) {
		super(props)
        this.state= {
            currentpage : 0,
            totalpages : 2,
            retailers : [],
            selectedretailers : [],
            errorText : '',            
            showSpinner : true,
            clear_selection : false,
            select_all :true,
            arr : [0,1,2,3,4]
        }
	}

    componentDidMount() {
        request.post('/api/getallRetailers')
        .send({ 
            psid : this.props.query.psid, 
            botid : this.props.query.botid 
        })
        .then( res => {
            let ret = res.text
            let retailerlist = JSON.parse(ret)
            console.log(typeof retailerlist)
            console.log(retailerlist)
            let errorText = null
            if ( retailerlist.length === 0 ) {
                errorText = 'There are no retailers in the Database!'
            }
            this.setState({ 
                showSpinner : false,
                errorText   : errorText,
                totalpages  : Math.ceil(retailerlist.length/12),
            })
            let temp=retailerlist.map(retailer => {
                let tempret = {}
                tempret.key = retailer
                tempret.value = "https://s3.amazonaws.com/xpressobrand/images/"+retailer
                tempret.selected = false
                return tempret;
            })
            this.setState({
                retailers : temp
            }, () => {
                    let cp = this.state.currentpage
                    let tarr = this.state.arr
                    cp = cp * 12
                    let indexarr1 = this.state.retailers.slice(cp)
                    let indexarr2
                    tarr.splice(0,tarr.length)
                    this.setState({
                        arr : tarr,
                    })
                    if(this.state.currentpage!==(this.state.totalpages-1)) {
                        indexarr2 = indexarr1.slice(0,12)
                    }   
                    else {
                        indexarr2 = indexarr1
                    }
                    this.setState({
                        showSpinner: false,
                        arr : indexarr2
                    })
                })
        })
        .catch( err => {
            console.log( err )
            if ( err && err.status ) {
                this.setState( { showSpinner : false, errorText: err.response.text } )
            } 
            else {
                this.setState( { showSpinner : false, errorText: 'Server Error' } )
            }
        })

               /*     
                request.post('/api/getretailerPreference')
                .send({
                    psid : this.props.query.psid,
                    botid : this.props.query.botid
                })
                .then( res => {
                    let retailerpreference = res.retailers
                    if(retailerpreference.length===0) {
                        console.log("there are no preferred retailers by the user")
                    }
                    let tempsel = retailerpreference.map(function(str) {
                            let sel = {}
                            sel.key = str
                            sel.value = "https://s3.amazonaws.com/xpressobrand/images/"+str
                            sel.selected = true
                            return sel
                        })
                    let temptotal = _.cloneDeep(this.state.retailers)
                    let i,flag
                    for(i=0;i<tempsel.length;i++) {
                        flag= temptotal.findIndex(i => i.key === tempsel[i].key)
                        temptotal[flag].selected = true
                    }            
                    this.setState({
                        retailers : temptotal,
                    })
                })
                .catch( err => {
                    console.log( err )
                    if ( err && err.status ) {
                        this.setState( { showSpinner : false, errorText: err.response.text } )
                    } 
                    else {
                        this.setState( { showSpinner : false, errorText: 'Server Error' } )
                    }
                })
               */ 
        }       

    gotoExit() {
        window.MessengerExtensions.requestCloseBrowser( function success() {
            return;
            }, err => {
            console.error( err, 'Unable to close window.', 'You may be viewing outside of the Messenger app.' )
        })
    }

    gotoSubmitRetailers() {
        let selarr = _.cloneDeep(this.state.selectedretailers)
        let selstr = selarr.map(val => {
             return (val.key)           
        })
        this.state.selectedretailers.splice(0,selstr.length)
        this.state.selectedretailers=selstr
        this.props.history.push(`/submitretailers/${this.state.selectedretailers}?psid=${this.props.query.psid}&botid=${this.props.query.botid}`);
    }

    clearSelection() { 
        let temp = this.state.retailers.map(ret => {
            ret.selected = false
            return ret
        })
        let tarr = this.state.arr.map(a => {
            a.selected = false
            return a
        })
        this.setState ({
            clear_selection : false,
            select_all : true,
            selectedretailers : [],
            retailers : temp,
            arr : tarr
        });
    }

    selectAll() {
        let temp = this.state.retailers.map( ret => {
            ret.selected = true
            return ret
        })
        let tarr = this.state.arr.map(a => {
            a.selected = true
            return a
        })
        this.setState({
            clear_selection : true,
            select_all : false,
            selectedretailers : [],
            retailers : temp,
            arr : tarr
        });
        this.setState({
            selectedretailers : temp
        })
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

    gotoPreviousPage() {
        let cp = this.state.currentpage
        cp = cp-1
        this.setState({
            currentpage : cp,
        }, () => {
            let tarr = _.cloneDeep(this.state.arr)
            cp = cp * 12
            let indexarr1 = this.state.retailers.slice(cp)
            let indexarr2
            tarr.splice(0,tarr.length)
            this.setState({
                arr : tarr,
            })
            if(this.state.currentpage!==(this.state.totalpages-1)) {
                indexarr2 = indexarr1.slice(0,12)
            }
            else {
                indexarr2 = indexarr1
            }
            this.setState({
                arr : indexarr2
            })
        })
    }

    gotoNextPage() {    
        let cp = this.state.currentpage
        cp = cp+1
        this.setState({
            currentpage : cp,
        })
        let tarr = _.cloneDeep(this.state.arr)
        cp = cp * 12
        let indexarr1 = this.state.retailers.slice(cp)
        let indexarr2
        tarr.splice(0,tarr.length)
            this.setState({
                arr : tarr,
            })
        if(this.state.currentpage!==(this.state.totalpages-1)) {
            indexarr2 = indexarr1.slice(0,12)
        }
        else {
            indexarr2 = indexarr1
        }
        this.setState({
            arr : indexarr2
        })
    }

    gotoSelect(val) {
        let cp = this.state.currentpage
        let flag = this.state.arr.findIndex(i => i.key===val.key);
        let indexval = cp*12+flag
        let tempret1 = _.cloneDeep(this.state.retailers)
        let tempret2 = _.cloneDeep(this.state.arr)
        let tempret3 = _.cloneDeep(this.state.selectedretailers)
        let i
        let flag2 = -1
        for(i=0;i<tempret3.length;i++) {
            if(tempret3[i].key===val.key) {
                flag2 =i;
            }
        }
        if(flag2 === -1) { 
            tempret1[indexval].selected=true
            tempret2[flag].selected = true
            val.selected = true
            tempret3.push(val)
        }
        else {
            tempret1[indexval].selected = false
            tempret2[flag].selected =false
            tempret3.splice(flag2,1)
        }
        this.setState({
            retailers : tempret1,
            selectedretailers : tempret3,
            arr : tempret2
            }, console.log(tempret3))
    }

    render() {
        let page = null;
        page = <div>
                <div className='row'>
                    <div className='col-xs-12' style={{ marginTop: '15px', fontFamily:'Arial Black' }}>
                        <TopHeader headerText="Select Retailers"/>
                    </div>
                </div>
                
                <div className='row'>
                    <div className='col-xs-4 text-center' onClick={() => this.clearSelection()} style={{fontFamily:'Times New Roman'}} >
                        <span><u> 
                            {
                                this.state.clear_selection && "Clear Selection"
                            }</u>
                        </span>    
                    </div>

                    <div className='col-xs-4'></div>
                    
                    <div className='col-xs-4 text-center' onClick={() => this.selectAll()} style={{fontFamily:'Times New Roman'}} >
                        <span><u> 
                            {
                                this.state.select_all && "Select All"
                            }
                            </u>
                        </span>
                    </div>    
                </div> 
                
                <div className='row' id='asdasd' style={{marginBottom:'20px'}}>  
                    { this.state.arr && this.state.arr.map( (val, index) =>    
                        <div className='col-xs-4 wrapper' key = {index} style={{marginBottom:'10px'}}> 
                            <img key={val.key} onClick={() => this.gotoSelect(val)} className='img-thumbnail' width="200" height="200" onError={e => this.onError(e,val)} src={val.value} style={{border:val.selected?'solid 2px #e6e6fa':'solid 2px #fff'}}>
                            </img>
                           <div> 
                                {
                                Boolean(val.selected) && <span className='glyphicon glyphicon-ok' style={{ position: 'absolute', top: '10px', left: '20px', color:'#e6e6fa'}}> </span> 
                                }
                            </div>
                        </div>    
                    )
                }
                </div>

                <div className='row' style={{marginBottom: '50px',fontFamily:'Times New Roman'}}>
                    <div className='col-xs-4'>
                        <span onClick={() => this.gotoPreviousPage()}> 
                            {
                                Boolean(this.state.currentpage) && <div><span className="glyphicon glyphicon-menu-left" aria-hidden="true"></span><span>Previous Page</span> </div>
                            }
                        </span>
                    </div>
                    
                    <div className='col-xs-4'> </div> 

                    <div className='col-xs-4'>
                        <span onClick={() => this.gotoNextPage()}> 
                                {
                                    Boolean(this.state.totalpages-this.state.currentpage-1) && <div> <span>Next Page</span> <span className="glyphicon glyphicon-menu-right" aria-hidden="true"></span></div>
                                }
                        </span>
                    </div>    
                </div>

                <div style={{ position: 'fixed', bottom: '0', width: '100%', marginLeft: '-15px', padding: '15px 0', background: 'white', fontFamily:'Times New Roman' }} >
                    <div className='row center-block'>
                        <div className='col-xs-6'>
                            <ButtonWide buttonText="EXIT" selected={false} clickHandler={ e => this.gotoExit(e) }/>
                        </div>
                        <div className='col-xs-6'>
                            {
                            Boolean(this.state.selectedretailers.length)?       
                                <button type='button' className='btn-lg btn-block btn-warning' onClick={ e => this.gotoSubmitRetailers() } style={{ fontSize: '14px' }} >SHOP SELECTED</button> :
                                <button type='button' className='btn-lg btn-block' onClick={ e => this.gotoSubmitRetailers() } style={{ fontSize: '14px' }} disabled>SHOP SELECTED</button>
                            }
                        </div>
                    </div>
                </div>                                        
               
               </div>

        if ( this.state.showSpinner ) {
            page = <Spinner />
        }

        return( 
            <div>{page}</div>
        );
    }
}

module.exports= SelectRetailers