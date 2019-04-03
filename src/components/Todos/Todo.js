import React from "react"
// import * from "semantic-ui-react"

// class Todo extends React.Component{
//   render(){
//     return(
//       <div>
//         child
//       </div>
//     )
//   }
// }

class Todo extends React.Component{

  handleDoubleClick = (index) => {
    this.props.deleteTodo(index)
    // console.log("double clicked")
  }

  // completedTodo = (key,todo) => {
  //   this.props.completedTodo(key)
  // }

  render(){
    const displayList = this.props.todos.map((todo) => {
      return (
        <li key={todo.id}>
        <button class="mini ui button" onClick={() => this.handleDoubleClick(todo.id)}>
          -
        </button>
          {/* <div class="ui buttons">
            <button class="ui button">-</button>
            <div class="or"></div>
            <button class="ui positive button mini" >--</button>
          </div> */}
          {todo.todo}
        </li>
      );
    });

    return(
      <div className="listTodo">
          <p>
          </p>
          <ul>
            {displayList}
          </ul>
      </div>
    )
  }
}

export default Todo;