import React from 'react';
import Hammer from 'react-hammerjs';
import { connect } from 'react-redux';
import { moveItems } from '../actions/numbersHandle';

class DragArea extends React.Component{
    constructor(props){
        super()
    }

    handlePan(e){
        e.preventDefault();
        console.log(e.additionalEvent);

    }

    render(){
        return(
            <Hammer onPanEnd={this.handlePan.bind(this)}>
                <div id="dragArea"></div>
            </Hammer>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {
    moveItems: moveItems,
}

export default connect(  
    mapStateToProps,
    mapDispatchToProps
)(DragArea)