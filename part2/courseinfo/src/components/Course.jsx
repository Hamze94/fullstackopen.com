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


export default Course;