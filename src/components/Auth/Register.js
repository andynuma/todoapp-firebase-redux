import React from "react";
import {Grid, Form, Segment, Button, Header, Message, Icon} from "semantic-ui-react"
import {Link} from "react-router-dom"
import firebase from "../../firebase";
import md5 from "md5"

class Register extends React.Component{
  state = {
    username:"",
    email:"",
    password:"",
    passwordConfirmation:"",
    errors:[],
    loading:false,
    usersRef: firebase.database().ref("users")
  }

  isFormValid = () =>{
    let errors = [];
    let error;

    if(this.isFormEmpty(this.state)){
      error = {message: "Fill in all fields"};
      this.setState({errors: errors.concat(error)})
      return false
    } else if (!this.isPasswordValid(this.state)){
      error = {message: "Password is invalid"}
      this.setState({errors:errors.concat(error)})
      return false
    } else {
      return true;
    }
  }

  isFormEmpty = ({username,email,password,passwordConfirmation}) => {
    return !username.length || !email.length || !password.length || !passwordConfirmation.length;
  }

  isPasswordValid = ({password, passwordConfirmation}) =>{
    if(password.length < 6 || passwordConfirmation.length < 6){
      return false;
    } else if (password !== passwordConfirmation){
      return false;
    } else {
      return true;
    }
  }

  displayErrors = errors => errors.map((error,i) => <p key={i}> {error.message}</p>)

  handleInputError = (errors,inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName) ? "error":"")
  }

  handleChange = (event) =>  {
    this.setState({[event.target.name]:event.target.value})
  }

  saveUser = (createdUser) => {
    // firebaseのdatabaseにuidという要素を追加して、そこにnameとavatarをセットする
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if(this.isFormValid()){
      this.setState({errors:[], loading:true})
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
          console.log(createdUser)
          createdUser.user
          .updateProfile({
            displayName: this.state.username,
            photoURL:`http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
          })
          .then(() => {
            this.saveUser(createdUser).then(() => {
              console.log("user saved")
            })
          })
          .catch(err => {
            console.log(err);
            this.setState({errors: this.state.errors.concat(err), loading:false})
          })
        })
        .catch(err => {
          console.log(err)
          this.setState({errors:this.state.errors.concat(err),loading:false})
        })
    }
  }

  render(){
    const {username,password,email,passwordConfirmation,errors,loading} = this.state
    return(
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h1" icon color="orange" textAlign="center">
              <Icon name="puzzle piece" color="orange" />
                Register
            </Header>
            <Form onSubmit={this.handleSubmit} size="large" >
                <Segment stacked>
                    <Form.Input fluid name="username" icon="user" iconPostion="left" placeholder="Username"
                    onChange={this.handleChange} value={username} type="text" />
                    <Form.Input fluid name="email" icon="mail" iconPostion="left" placeholder="email"
                    onChange={this.handleChange} value={email} type="email" className={this.displayErrors(errors,"email")}/>
                    <Form.Input fluid name="password" icon="lock" iconPostion="left" placeholder="password"
                    onChange={this.handleChange} value={password} type="password" className={this.displayErrors(errors,"password")}/>
                    <Form.Input fluid name="passwordConfirmation" icon="lock" iconPostion="left" placeholder="Password Confirmation"
                    onChange={this.handleChange} value={passwordConfirmation} type="password" className={this.displayErrors(errors,"password")}/>
                    <Button disable={loading} className={loading ?  "loading" : ""} color="orange" fluid size="large">Submit</Button>
                </Segment>
            </Form>
            {this.state.errors.length > 0 && (
              <Message>
                <h3>Error</h3>
                {this.displayErrors(errors)}
              </Message>
            )}
            <Message>Already a user ?<Link to="/login">Login</Link></Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Register;