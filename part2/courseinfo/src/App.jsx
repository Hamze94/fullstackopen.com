const Course = (props) => {
  // console.log(props)
  return (
    <>
      {props.courses.map(course =>
        <div key={course.id}>
          <SingleCourse courses={course} />
          <Total parts={course.parts} />
        </div>
      )}
    </>
  )
}
const SingleCourse = (props) => {
  return (
    <>
      <Header courses={props.courses} />
      <Content parts={props.courses.parts} />
    </>
  )
}
const Header = (props) => <h3> {props.courses.name}</h3>
const Content = (props) => {
  console.log(props)
  return (
    <>
      {props.parts.map(part => {
        // console.log(part);
        return (
          <p key={part.id}>  {part.name} {part.exercises}</p >
        )
      })
      }
    </>
  )

}
const Total = (props) => {
  const total = props.parts.reduce((sum, part) => sum + part.exercises, 0)
  return (
    <p><strong>Total of exercises {total}</strong></p>
  )
}
const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]
  return (
    <>
      <h1>web development curriculum</h1>
      <Course courses={courses} />
    </>
  )
}

export default App
