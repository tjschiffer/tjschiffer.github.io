import React from 'react'
import { connect } from 'react-redux'
import '../../assets/css/main.css'

/**
 * Wraps element and updates the color with the state's color attribute
 */
class TextColorChanger extends React.Component {
  render () {
    return (
      <div>
        <div className={this.props.className} style={{ color: this.props.color }}>{this.props.children}</div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    color: state.color
  }
}

export default connect(mapStateToProps)(TextColorChanger)
