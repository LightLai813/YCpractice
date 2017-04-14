import React from "react";
import { connect } from 'react-redux';

import CheckerBoard from '../components/CheckerBoard.jsx';
import DragArea from '../components/DragArea.jsx';


class Index extends React.Component {
    componentDidMount(){
        
    }

    render() {
        return (
            <div>
                <div className="wrapper">
                    <Header />
                    <CheckerBoard />
                    <DragArea />
                </div>
                <Footer />
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
}

export default connect(  
    mapStateToProps,
    mapDispatchToProps
)(Index)

class Header extends React.Component {
    render() {
        return (
            <header>
                2048
            </header>
        );
    }
}

class Footer extends React.Component {
    render() {
        const nowYear = (new Date()).getFullYear().toString();

        return (
            <footer>
                Copyright &copy; {nowYear} &middot; All Rights Reserved
            </footer>
        );
    }
}
