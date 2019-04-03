import React from 'react';
import "./App.css"
import Todos from "./Todos/Todos"
import { connect } from "react-redux"


const App = ({currentUser}) => (
  <Todos currentUser={currentUser}/>
)

const mapStateToProps = state => ({
  currentUser:state.user.currentUser
})

export default connect(mapStateToProps)(App);