import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './sorts.css';

class Sorts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sort:'priceLtoH'
        };
        this.onSortChanged = this.onSortChanged.bind(this);
    }

    onSortChanged = (e) => {
        this.setState({
            sort: e.target.value
        }, function(){
            this.props.applySorts(this.state);
        });
    }

    componentWillReceiveProps(newProps){
        if(newProps.timestamp !== this.props.timestamp){
            this.setState({
                sort:'priceLtoH'
            });
        }
    }

  	render() {
        const category = this.props.match.params.category;
        var sortOptions = [
            {
                key:"priceLtoH",
                value:"Price: Low to high"
            },
            {
                key:"priceHtoL",
                value:"Price: High to low"
            }
        ];
        if(category === 'hotels'){
            sortOptions.push({
                key:"highRated",
                value:"Highest rated"
            })
            sortOptions.push({
                key:"stars",
                value:"Stars"
            })
        } else if(category === 'flights'){
            sortOptions.push({
                key:"dep",
                value:"Departure time"
            })
        }
    	return (
      		<div className="row sorting-content">
                <div className="col-xs-6 text-right">
                    <label>Sort by</label>
                </div>
                <div className="col-xs-6">
                    <select className="form-control" value={this.state.sort} onChange={this.onSortChanged}>
                        {
                            sortOptions.map((sort, key) => {
                                return <option value={sort.key} key={sort.key}>{sort.value}</option>
                            })
                        }
                    </select>
                </div>
      		</div>
    	);
  	}
}

export default withRouter(props => <Sorts {...props}/>);
