import React, { Component } from 'react'
import classes from "../css/InfoModal.module.css"
export default class InfoModal extends Component {
  render() {
    return (
      <div className={classes.modal}>
          <div className={classes.modalContent}>
            <h1>Hello</h1>
          </div>
      </div>
    )
  }
}
