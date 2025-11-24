import { useState } from 'react'
const Statics = ({ good, neutral, bad, totalFeedBack, averageFeedback, positiveFeedback }) => {
  return (
    <>
      <h1>Statics</h1>
      <p>Good {good}</p>
      <p>Neutral {neutral}</p>
      <p>Bad {bad}</p>
      <p>All {totalFeedBack}</p>
      <p>Average {averageFeedback}</p>
      <p>Positive {positiveFeedback}% </p>
    </>
  )
}

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
      <button onClick={handleGood}>Good</button>
      <button onClick={handleNeutral}>Neutral</button>
      <button onClick={handleBad}>Bad</button>
      <Statics {...{ good, neutral, bad, totalFeedBack, averageFeedback, positiveFeedback }} />

    </>
  )
}
export default App
