import { useState } from 'react'
const StaticsLine = ({ text, value }) => <p>{text} {value}</p>
const Statics = ({ good, neutral, bad, totalFeedBack, averageFeedback, positiveFeedback }) => {
  if (totalFeedBack === 0) {
    return (
      <>
        <h1>Statics</h1>
        <p>No feed back given</p>
      </>
    )
  }
  return (
    <>
      <h1>Statics</h1>
      <StaticsLine text="Good" value={good} />
      <StaticsLine text="Neutral" value={neutral} />
      <StaticsLine text="Bad" value={bad} />
      <StaticsLine text="All" value={totalFeedBack} />
      <StaticsLine text="Average" value={averageFeedback} />
      <StaticsLine text="Positive" value={`${positiveFeedback}%`} />
    </>
  )
}
const FeedBackButton = (props) => <button onClick={props.onClick}>{props.text}</button>

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const handleGood = () => setGood(good + 1)
  const handleNeutral = () => setNeutral(neutral + 1)
  const handleBad = () => setBad(bad + 1)
  const totalFeedBack = good + neutral + bad;
  const positiveFeedback = (good / totalFeedBack) * 100
  const averageFeedback = (good - bad) / totalFeedBack
  return (
    <>
      <h1>Given Feed Back </h1>
      <FeedBackButton text="good" onClick={handleGood} />
      <FeedBackButton text="neutral" onClick={handleNeutral} />
      <FeedBackButton text="bad" onClick={handleBad} />
      <Statics {...{ good, neutral, bad, totalFeedBack, averageFeedback, positiveFeedback }} />

    </>
  )
}
export default App
