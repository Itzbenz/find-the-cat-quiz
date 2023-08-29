import { useState } from 'react'
import { Button, DarkThemeToggle, Flowbite, Modal, Navbar } from 'flowbite-react'


//calculate superposition probabilities
//since the current box don't have cat, the neighboring boxes don't increase their probabilities from this box
//imagine A, B, C boxes, each box has 1/3 probability
//imagine we select B
//cat in A will move to B
//there no cat in B, so cat in B will not move
//cat in C will move to B
//so the probability of cat in B is 1/2 + 1/2 = 2/2
//2 is the number of quantum cats, 1 from A and 1 from C

//imagine A, B, C boxes, each box has 1/3 probability
//imagine we select A
//cat in A won't move
//cat in B will move to A and C
//cat in C will move to B
//so the probability of cat in A is 1/3, B is 1/3 and C is 1/3
//3 is the number of quantum cats, 2 from B and 1 from C
function calculateSuperpositions(showSuperpositionProbabilities: number[], guessedPosition: number) {
  const newSuperpositions: number[] = []
  let imaginaryCatCount = 0
  for (let i = 0; i < showSuperpositionProbabilities.length; i++) {
    let neighbourCount = 0;
    if(i - 1 >= 0 && i - 1 !== guessedPosition) {
      neighbourCount++
    }
    if(i + 1 < showSuperpositionProbabilities.length && i + 1 !== guessedPosition) {
      neighbourCount++
    }
    newSuperpositions.push(neighbourCount)
    //neighbourCount is the number of quantum cats goes to this box
    imaginaryCatCount += neighbourCount
  }
  
  //normalize superpositions
  for (let i = 0; i < newSuperpositions.length; i++) {
    newSuperpositions[i] = newSuperpositions[i] / imaginaryCatCount
  }
  return newSuperpositions
}


function App() {
  const [numberOfBoxes, setNumberOfBoxes] = useState(5)
  const [catPosition, setCatPosition] = useState(Math.floor(Math.random() * numberOfBoxes))
  const [showCat, setShowCat] = useState(false)
  const [showSuperpositionProbabilities, setShowSuperpositionProbabilities] = useState(false)
  const [days, setDays] = useState(1)
  const [superpositions, setSuperpositions] = useState<number[]>(Array.from({ length: numberOfBoxes }, () => 1 / numberOfBoxes))
  const [isWin, setIsWin] = useState(false)
  function setBoxes(numberOfBoxes: number) {
    if (numberOfBoxes < 0) {
      return
    }
    setCatPosition(Math.floor(Math.random() * numberOfBoxes))
    setNumberOfBoxes(numberOfBoxes)
    setDays(1)
    setIsWin(false)
    setSuperpositions(Array.from({ length: numberOfBoxes }, () => 1 / numberOfBoxes))
  }
  function guessCatPositionOnBox(guessedPos: number) {
    if (guessedPos === catPosition) {
      setIsWin(true)
      return
    }
    setDays(days + 1)
    //cat move to adjacent box from current cat position
    const choices: number[] = []
    if (catPosition > 0) {
      choices.push(catPosition - 1)
    }
    if (catPosition < numberOfBoxes - 1) {
      choices.push(catPosition + 1)
    }
    const newCatPosition = choices[Math.floor(Math.random() * choices.length)]
    setCatPosition(newCatPosition)
    setSuperpositions((prevSuperpositions) => {
      return calculateSuperpositions(prevSuperpositions, guessedPos)
    })
  }

  return (
    <Flowbite>

      <Navbar
        fluid

      >
        <Navbar.Brand>
          <h1 className="text-2xl font-bold dark:text-gray-200">
            Find the cat
          </h1>
        </Navbar.Brand>
        <Navbar.Toggle />

        <Navbar.Collapse>
          <DarkThemeToggle>
            Toggle dark theme
          </DarkThemeToggle>
          <Button className="hidden w-24 mt-4 md:mt-0">Settings</Button>
        </Navbar.Collapse>

      </Navbar>
      <div className="h-screen bg-gray-50 text-gray-900
       dark:bg-gray-900 dark:text-gray-200
       flex flex-col items-center justify-center">
        {/* <p className="mb-4">Current cat position: {catPosition}</p> */}
        {isWin && (
          <div className="mb-4">
            <p className="mb-4">You win!</p>
            <Button onClick={() => setBoxes(5)}>Play again</Button>
          </div>
        )}
        <p className="mb-4">Days: {days}</p>
        <div className="flex flex-wrap justify-center items-center">
          {Array.from({ length: numberOfBoxes }).map((_, index) => (
            <div key={index} className='w-16 ml-3 flex flex-col items-center justify-center'>
              {showSuperpositionProbabilities && (
                <p className="text-xs ">
                  {(superpositions[index]* 100).toFixed(1) }%
                </p>
              )}
              <button
                className={`w-full h-16 m-2 rounded-lg shadow-lg ${catPosition === index && showCat ? 'bg-green-500' : 'bg-gray-500'}`}
                onClick={() => guessCatPositionOnBox(index)}
              />
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4 justify-center">
          <Button onClick={() => setBoxes(numberOfBoxes + 1)} className="mr-2">Add 1 boxes</Button>
          <Button onClick={() => setBoxes(numberOfBoxes - 1)}>Remove 1 boxes</Button>
          <Button onClick={() => setShowCat(!showCat)} className="ml-2">Toggle cat</Button>
          <Button onClick={() => setShowSuperpositionProbabilities(!showSuperpositionProbabilities)} className="ml-2">Toggle superposition probabilities</Button>
        </div>

        <div className="mt-4">
          <Modal
            title="Modal title"
          >
            <p className="mb-4">Modal content</p>
            <Button>Close modal</Button>
          </Modal>
        </div>
      </div>
    </Flowbite>
  )
}

export default App
