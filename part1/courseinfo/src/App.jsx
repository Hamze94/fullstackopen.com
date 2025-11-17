const Header = (props) => <h1> {props.title}</h1>
const Content  = (props)=>{
  console.log(props)
  return(
    <>
    <p>{props.parts[0].part}  {props.parts[0].exercises}</p>
    <p>{props.parts[1].part} {props.parts[1].exercises}</p>
    <p>{props.parts[2].part} {props.parts[2].exercises}</p>
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
