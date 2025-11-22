const Header = (props) => <h1> {props.course.name}</h1>
const Content = (props) => {
  // console.log(props)
  return (
    <>
      {props.parts.map(part => {
        console.log(part);
        return (
          <p key={part.name}>  {part.name} {part.exercises}</p >
        )
      })
      }
    </>
  )
}
const Total = (props) => {
  const exercisesArray = props.parts.map(part => part.exercises)
  let total = 0;
  exercisesArray.forEach(exercise => {
    total += exercise
  });
  return (
    <p>Number of exercises {total}</p>
  )
}
const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  return (
    <>
      <div>
        <Header course={course} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />

      </div>
    </>
  )
}

export default App
