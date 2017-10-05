import React from 'react';
import { render } from 'react-dom';
import _ from 'lodash'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
const queryString = require('query-string');

class RouteComponent extends React.Component {

  constructor(props) {
    super(props)
    let query = { psid : null, botid : null }  // Empty template for query
    _.merge( query, queryString.parse(this.props.location.search) )
    this.state = { 
        query : query,
        path : this.props.location.pathname
    }
  }

  componentWillMount() {

    if (!_.isNull( this.state.path.match(/product/g ) ) ) {
        import('./product/ProductDetailsComponent').then(ProductDetailsComponent => {
            this.ProductDetailsComponent = ProductDetailsComponent
            this.forceUpdate()
        })

        import('./item/AddToItemComponent').then(AddToItemComponent => {
            this.AddToItemComponent = AddToItemComponent
            this.forceUpdate()
        })
        import('./item/AddedToItemComponent').then(AddedToItemComponent => {
            this.AddedToItemComponent = AddedToItemComponent
            this.forceUpdate()
        })
        import('./item/ViewItemsComponent').then(ViewItemsComponent => {
            this.ViewItemsComponent = ViewItemsComponent
            this.forceUpdate()
        })
        import('./item/ViewItemComponent').then(ViewItemComponent => {
            this.ViewItemComponent = ViewItemComponent
            this.forceUpdate()
        })
        import('./item/ItemsClearConfirmComponent').then(ItemsClearConfirmComponent => {
            this.ItemsClearConfirmComponent = ItemsClearConfirmComponent
            this.forceUpdate()
        })
        import('./cart/CheckoutComponent').then(CheckoutComponent => {
            this.CheckoutComponent = CheckoutComponent
            this.forceUpdate()
        })
        import('./cart/SubmitOrderComponent').then(SubmitOrderComponent => {
            this.SubmitOrderComponent = SubmitOrderComponent
            this.forceUpdate()
        })

    } else if ( !_.isNull( this.state.path.match(/expand/g ) ) ) {

        import('./expand/ExpandedMenu').then(ExpandedMenu => {
            this.ExpandedMenu = ExpandedMenu
            this.forceUpdate() 
        })

        import('./item/AddToItemComponent').then(AddToItemComponent => {
            this.AddToItemComponent = AddToItemComponent
            this.forceUpdate()
        })
        import('./item/AddedToItemComponent').then(AddedToItemComponent => {
            this.AddedToItemComponent = AddedToItemComponent
            this.forceUpdate()
        })
        import('./item/ViewItemsComponent').then(ViewItemsComponent => {
            this.ViewItemsComponent = ViewItemsComponent
            this.forceUpdate()
        })
        import('./item/ViewItemComponent').then(ViewItemComponent => {
            this.ViewItemComponent = ViewItemComponent
            this.forceUpdate()
        })
        import('./item/ItemsClearConfirmComponent').then(ItemsClearConfirmComponent => {
            this.ItemsClearConfirmComponent = ItemsClearConfirmComponent
            this.forceUpdate()
        })
        import('./cart/CheckoutComponent').then(CheckoutComponent => {
            this.CheckoutComponent = CheckoutComponent
            this.forceUpdate()
        })
        import('./cart/SubmitOrderComponent').then(SubmitOrderComponent => {
            this.SubmitOrderComponent = SubmitOrderComponent
            this.forceUpdate()
        })

        import('./notright/NotRightVisionComponent').then(NotRightVisionComponent => {
            this.NotRightVisionComponent = NotRightVisionComponent
            this.forceUpdate()
        })
        import('./notright/NotRightComponent').then(NotRightComponent => {
            this.NotRightComponent = NotRightComponent
            this.forceUpdate()
        })
        import('./notright/NotRightSuccess').then(NotRightSuccess => {
            this.NotRightSuccess = NotRightSuccess
            this.forceUpdate()
        })
        import('./notright/NotRightFail').then(NotRightFail => {
            this.NotRightFail = NotRightFail
            this.forceUpdate()
        })

    } else if ( !_.isNull( this.state.path.match(/profile/g ) ) ) {
        import('./profile/ProfileComponent').then(ProfileComponent => {
            this.ProfileComponent = ProfileComponent
            this.forceUpdate()
        })
        import('./profile/ProfileItemComponent').then(ProfileItemComponent => {
            this.ProfileItemComponent = ProfileItemComponent
            this.forceUpdate()
        })
        import('./profile/ProfileDoneComponent').then(ProfileDoneComponent => {
            this.ProfileDoneComponent = ProfileDoneComponent
            this.forceUpdate()
        })

    } else if ( !_.isNull( this.state.path.match(/questionSelect/g ) ) ) {
        import('./questions/QuestionSelectComponent').then(QuestionSelectComponent => {
            this.QuestionSelectComponent = QuestionSelectComponent
            this.forceUpdate()
        })

    } else if ( !_.isNull( this.state.path.match(/getFeedback/g ) ) ) {
        import('./questions/QuestionDisplayComponent').then(QuestionDisplayComponent => {
            this.QuestionDisplayComponent = QuestionDisplayComponent
            this.forceUpdate()
        })

        import('./questions/QuestionSuccessComponent').then(QuestionSuccessComponent => {
            this.QuestionSuccessComponent = QuestionSuccessComponent
            this.forceUpdate()
        })

    } else if ( !_.isNull( this.state.path.match(/showUserAnswer/g ) ) ) {
        import('./questions/QuestionDisplayUserComponent').then(QuestionDisplayUserComponent => {
            this.QuestionDisplayUserComponent = QuestionDisplayUserComponent
            this.forceUpdate()
        })

    } else if ( !_.isNull( this.state.path.match(/rating/g ) ) ) {

        import('./botrating/Rating').then(Rating => {
            this.Rating = Rating
            this.forceUpdate()
        })
        import('./botrating/RatingReason').then(RatingReason => {
            this.RatingReason = RatingReason
            this.forceUpdate()
        })
        import('./botrating/SubmittedFeedback').then(SubmittedFeedback => {
            this.SubmittedFeedback = SubmittedFeedback
            this.forceUpdate()
        })
        import('./botrating/FailedFeedback').then(FailedFeedback => {
            this.FailedFeedback = FailedFeedback
            this.forceUpdate()
        })
    } else if ( !_.isNull( this.state.path.match(/selectretailers/g ) ) ) {

        import( './selectspecificshop/SelectRetailers' ).then(SelectRetailers => {
            this.SelectRetailers = SelectRetailers
            this.forceUpdate()
        })
        import ( './selectspecificshop/SubmitRetailers' ).then(SubmitRetailers => {
            this.SubmitRetailers = SubmitRetailers
            this.forceUpdate()
        })
        import('./botrating/SubmittedFeedback').then(SubmittedFeedback => {
            this.SubmittedFeedback = SubmittedFeedback
            this.forceUpdate()
        })
        import('./botrating/FailedFeedback').then(FailedFeedback => {
            this.FailedFeedback = FailedFeedback
            this.forceUpdate()
        })
    } else if ( !_.isNull( this.state.path.match(/viewItems/g ) ) ) {
        import('./item/ViewItemsComponent').then(ViewItemsComponent => {
            this.ViewItemsComponent = ViewItemsComponent
            this.forceUpdate()
        })
        import('./item/ViewItemComponent').then(ViewItemComponent => {
            this.ViewItemComponent = ViewItemComponent
            this.forceUpdate()
        })
        import('./item/ItemsClearConfirmComponent').then(ItemsClearConfirmComponent => {
            this.ItemsClearConfirmComponent = ItemsClearConfirmComponent
            this.forceUpdate()
        })
        import('./cart/CheckoutComponent').then(CheckoutComponent => {
            this.CheckoutComponent = CheckoutComponent
            this.forceUpdate()
        })
        import('./cart/SubmitOrderComponent').then(SubmitOrderComponent => {
            this.SubmitOrderComponent = SubmitOrderComponent
            this.forceUpdate()
        })
    }
  }

  render() {
    return (
      <div>
        { this.ProfileComponent ? <Route path='/profile' render={ props => <this.ProfileComponent {...props} query={this.state.query} device={this.props.device} /> } /> : null }
        { this.ProfileItemComponent ? <Route path='/profileItem/:gender/:category' component={ props => <this.ProfileItemComponent {...props} query={this.state.query} device={this.props.device} /> } /> : null }
        { this.ProfileDoneComponent ? <Route path='/profileCompleted' component={ props => <this.ProfileDoneComponent {...props} query={this.state.query} device={this.props.device} /> } /> : null }

        { this.CheckoutComponent ? <Route path='/checkout/:catalog' render={ props => <this.CheckoutComponent {...props} query={this.state.query} device={this.props.device} /> } /> : null }
        { this.SubmitOrderComponent ? <Route path='/submitOrder/:catalog' render={ props => <this.SubmitOrderComponent {...props} query={this.state.query} device={this.props.device} /> } /> : null }

        { this.ExpandedMenu ? <Route path='/expand' render={ props => <this.ExpandedMenu {...props} query={this.state.query} device={this.props.device} /> } /> : null }
            
        { this.NotRightVisionComponent ? <Route path='/notRightVision' render={ props => <this.NotRightVisionComponent {...props} query={this.state.query} device={this.props.device} />} /> : null }
        { this.NotRightComponent ? <Route path='/notRight' render={ props => <this.NotRightComponent {...props} query={this.state.query} device={this.props.device} />} /> : null }
        { this.NotRightSuccess ? <Route path='/notRightSuccess' render={ props => <this.NotRightSuccess {...props} query={this.state.query} device={this.props.device} />} /> : null }
        { this.NotRightFail ? <Route path='/notRightFail' render={ props => <this.NotRightFail {...props} query={this.state.query} device={this.props.device} />} /> : null }

        { this.ProductDetailsComponent ? <Route path='/product' render={ props => <this.ProductDetailsComponent {...props} query={this.state.query} device={this.props.device} /> } /> : null }

        { this.AddToItemComponent ? <Route path='/addToItem' render={ props => <this.AddToItemComponent {...props} query={this.state.query} device={this.props.device} /> } /> : null }
        { this.AddedToItemComponent ? <Route path='/addedToItem' render={ props => <this.AddedToItemComponent {...props} query={this.state.query} device={this.props.device} /> } /> : null }
        { this.ViewItemsComponent ? <Route path='/viewItems/:mode' render={ props => <this.ViewItemsComponent {...props} query={this.state.query} device={this.props.device} /> } /> : null }
        { this.ViewItemComponent ? <Route path='/viewItem' render={ props => <this.ViewItemComponent {...props} query={this.state.query} device={this.props.device} /> } /> : null }
        { this.ItemsClearConfirmComponent ? <Route path='/itemsClear' render={ props => <this.ItemsClearConfirmComponent {...props} query={this.state.query} device={this.props.device} /> } /> : null }

        { this.Rating ? <Route path='/rating' render={ props => <this.Rating {...props} query={this.state.query} device={this.props.device} /> } /> : null }
        { this.RatingReason ? <Route path='/ratingReason/:FeedbackRating' render={ props => <this.RatingReason {...props} query={this.state.query} device={this.props.device} /> } /> : null }
        { this.SubmittedFeedback ? <Route path='/submittedFeedback/:str' render={ props => <this.SubmittedFeedback {...props} query={this.state.query} device={this.props.device} /> } /> : null }
        { this.FailedFeedback ? <Route path='/failedFeedback/:str' render={ props => <this.FailedFeedback {...props} query={this.state.query} device={this.props.device} /> } /> : null }

        { this.SelectRetailers ? <Route path='/selectretailers' render={ props => <this.SelectRetailers {...props} query={this.state.query} device={this.props.device} /> } /> : null }
        { this.SubmitRetailers ? <Route path='/submitretailers/:selstr' render={ props => <this.SubmitRetailers {...props} query={this.state.query} device={this.props.device} /> } /> : null }

        { this.QuestionSelectComponent ? <Route path='/questionSelect' render={ props => <this.QuestionSelectComponent {...props} query={this.state.query} device={this.props.device} /> } /> : null }
        { this.QuestionDisplayComponent ? <Route path='/getFeedback' render={ props => <this.QuestionDisplayComponent {...props} query={this.state.query} device={this.props.device} /> } /> : null }
        { this.QuestionSuccessComponent ? <Route path='/questionSuccess' render={ props => <this.QuestionSuccessComponent {...props} query={this.state.query} device={this.props.device} /> } /> : null }
        { this.QuestionDisplayUserComponent ? <Route path='/showUserAnswer' render={props => <this.QuestionDisplayUserComponent {...props} query={this.state.query} device={this.props.device} /> } /> : null }
      </div>
    )
  }
}

module.exports = RouteComponent
