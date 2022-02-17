import React from "react";
import classes from "../css/BoardLetter.module.css"
class BoardLetter extends React.Component {
    // constructor(props){
    //     super(props)
    //     this.state = {
    //         letter: this.props.letter
    //     }
    // }
    // componentDidUpdate(){
    //     console.log("did update")
    // }
    render() {
        return (
            <div className={`${classes.BoardLetter} ${this.props.letterstatus}`} onClick={() => this.props.setTarget(this)}>
                {this.props.letter}
            </div>
        )
    }
}
export default BoardLetter