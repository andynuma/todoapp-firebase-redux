import React from "react"
import { Form } from "semantic-ui-react"
import firebase from "../../firebase"
import Todo from "./Todo"
import Spinner from "../../Spinner";

class Todos extends React.Component{
  state = {
    todos:[],
    text:"",
    userId:"",
    usersRef:firebase.database().ref("users/" + this.props.currentUser.uid),
  }

  // userのtodoを呼び出す
  componentDidMount() {
    this.addListeners()
    console.log(this.props.currentUser)
  }

  componentWillUnmount() {
    this.state.usersRef.off()
  }

  // 最初の表示
  addListeners = () => {
    let loadedTodos = []
    const { usersRef } = this.state
    // console.log("REF:",usersRef.path)

    usersRef.on("child_added", snap => {
      if(snap.val().todo !== undefined){
        // console.log(snap.val())
        loadedTodos.push(snap.val())
        this.setState({ todos : loadedTodos})
        // this.setState({ todos: [...this.state.todos, snap.val()] })
      }
    })
    console.log("loadedTodos:",this.state.todos)
  }
  
  // firebaseのuser下にtodoを追加する
  addTodo = () => {
    const { text, usersRef } = this.state;
    // console.log(usersRef)
    const key = usersRef.push().key
    const todoData = {
        id : key,
        todo : text,
        completed: false
    }
    // console.log(todoData.id)
    usersRef
      .push()   // pushでキー以下に{ todo : text }を保存
      .set(todoData) // users/userId/キー　の次に{todo:text}が保存される
      .then(() => {
        console.log("todo added")
      })
      .catch(err => {
        console.log(err)
      })
  }

  // todoの表示
  displayTodo = () => (
    <Todo todos={this.state.todos}/>
  )

  deleteTodo = (id) => {
    const { todos, usersRef } = this.state
    this.setState({
      todos: todos.filter(todo => {
        return todo.id !== id
      })
    })

    // firebaseから削除、keyで判定
    usersRef.orderByChild("id").equalTo(id).once("value", snap => {
      const updates = {}
      snap.forEach(child => updates[child.key] = null);
      usersRef.update(updates)
    })
  }

  // completedTodo = (key) => {
  //   const { usersRef, todos } = this.state
  //   this.setState({ 
  //     todos : todos.filter( todo => {
  //       if(todo.id === key){
  //         todo.completed = true
  //         console.log(todo.todo)
  //       }
  //       return todo.completed !== true
  //     })
  //   })
  //   console.log("state ",this.state.todos)
    
  //   usersRef
  //     .orderByChild("id").equalTo(key).once("value",snap =>{
  //       console.log("database",snap.val())
  //       snap.forEach(child => {
  //         child.completed = true
  //       })
  //     })
  // }

  // add todo のsubmit
  handleSubmit = event => {
    event.preventDefault();
    this.addTodo()
    this.setState({text : ""})
  }

  handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log("sign out"))
  }

  handleChange = event => {
    this.setState({text : event.target.value})
  }

  render(){
    const { todos } = this.state
    return(
      this.props.isloading
      ?  <Spinner/>
      : <div>
          <h2 class="ui header">
            <img src={this.props.currentUser.photoURL} class="ui circular image"/>
              {this.props.currentUser.displayName}
          </h2>
          <Form onSubmit={this.handleSubmit} autoComplete="off">
            <Form.Input onChange={this.handleChange}>
              <input placeholder='Todo' name="text" value={this.state.text} />
            </Form.Input>
          </Form>
          <p></p>
          <Todo
            todos={todos}
            currentUser={this.props.currentUser}
            deleteTodo={this.deleteTodo}
            completedTodo={this.completedTodo}
            />
          <button class="negative ui button" onClick={this.handleSignout}>Logout</button>
        </div>
    )
  }
}
      
export default Todos;
