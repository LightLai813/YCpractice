import React from 'react';

import { connect } from 'react-redux';
import { getDefaultNumbers } from '../actions/numbersHandle';

class CheckerBoard extends React.Component{
    constructor(props){
        super(props);
    }

    componentWillMount() {
        this.props.getDefaultNumbers();
    }

    // 接收到上層 props 有更動 
    componentWillReceiveProps(nextProps){
        console.log('hello');
    }

    // 更新前動作
    componentWillUpdate(nextProps, nextState){
    
    }

    eachRow(obj, i){
        console.log(obj);
        const unitW = 120;

        const styleOption =[
            {
                top: ((i+.5)*unitW) + 'px',
                left: (.5*unitW)+'px',
                
            },{
                top: ((i+.5)*unitW) + 'px',
                left: (1.5*unitW) + 'px',
                
            },{
                top: ((i+.5)*unitW) + 'px',
                left: (2.5*unitW) + 'px',
                
            },{
                top: ((i+.5)*unitW) + 'px',
                left: (3.5*unitW) + 'px',
                
            }
        ]

        return (
            <div key={i}>
                <div key={i+'0'} className={'item n' + obj[0]} style={styleOption[0]} ></div>
                <div key={i+'1'} className={'item n' + obj[1]} style={styleOption[1]} ></div>
                <div key={i+'2'} className={'item n' + obj[2]} style={styleOption[2]} ></div>
                <div key={i+'3'} className={'item n' + obj[3]} style={styleOption[3]} ></div>
            </div>
        );
    }

    render(){
        return(
            <div id="checkerBoard">
                {this.props.numbers.map(this.eachRow.bind(this))}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    numbers: state.numbers,
    gameover: state.gameover,
})

const mapDispatchToProps = {
    getDefaultNumbers: getDefaultNumbers,
}

export default connect(  
    mapStateToProps,
    mapDispatchToProps
)(CheckerBoard)