const Header = (props) => <h1> {props.title}</h1>
const Part = (props) => <p>{props.part} {props.exercise}</p>
const Content  = (props)=>{
  //console.log(props)
  return(
    <>
    <Part part = {props.parts[0].part} exercise = {props.parts[0].exercises}/>
    <Part part = {props.parts[1].part} exercise = {props.parts[1].exercises}/>
    <Part part ={props.parts[2].part} exercise =  {props.parts[2].exercises}/>
    </>
  )
}
const Total = (props)=> <p>Number of exercises {props.exercises}</p>
const  App = () => {
  const course = 'Half Stack application development'
  const  parts = [
    {part: 'Fundamentals of React',   exercises: 10},
    {part:'Using props to pass data',exercises: 7 },
    {part:'State of a component', exercises: 14}
  ]
  return (
    <>
     <div>
      <Header title={course} />
      <Content parts={parts}/>
      <Total exercises={parts[0].exercises + parts[1].exercises + parts[2].exercises}/>

    </div>
    </>
  )
}

export default App
