import { useEffect, useState } from 'react'

import styles from '../styles/home.module.scss'

export default function Home() {
  const emptyBoard = Array(9).fill('')

  const [board, setBoard] = useState(emptyBoard)
  const [currentPlayer, setCurrentPlayer] = useState('O')
  const [winner, setWinner] = useState(null)

  function handleCellClicked(index: number) {
    if (winner) {
      return 
    }

    if (board[index] !== '') {
      return
    }

    setBoard(board => 
      board.map((item, itemIndex) => itemIndex === index ? currentPlayer : item 
    ))

    setCurrentPlayer(currentPlayer => currentPlayer === 'X' ? 'O' : 'X')
  }

  function handleCheckWinner() {
    const possibleWaysToWins = [
      [board[0], board[1], board[2]],
      [board[3], board[4], board[5]],
      [board[6], board[7], board[8]],

      [board[0], board[3], board[6]],
      [board[1], board[4], board[7]],
      [board[2], board[5], board[8]],

      [board[0], board[4], board[8]],
      [board[2], board[4], board[6]],
    ]

    possibleWaysToWins.forEach(cells => {
      if (cells.every(cell => cell === 'X')) {
        setWinner('X')
        return
      }

      if (cells.every(cell => cell === 'O')) {
        setWinner('O')
        return
      }

      handleCheckDraw()
    })
  }

  function handleCheckDraw() {
    if (board.every(cell => cell !== '')) {
      setWinner('E')
    }
  }

  function handleResetGame() {
    setCurrentPlayer('O')
    setBoard(emptyBoard)
    setWinner(null)
  }

  useEffect(() => {
    (async () => {
      if (Notification.permission !== 'denied') {
        // Pede ao usuário para utilizar a Notificação Desktop
        await Notification.requestPermission()
      }
    })()

    handleResetGame()
  }, [])

  useEffect(handleCheckWinner, [board])

  useEffect(() => {
    if (winner) {
      if (Notification.permission === 'granted') {
        winner === 'E' 
          ? new Notification(`Empate`, {
              body: 'Nenhum jogador venceu!',
              icon: '/balance.png',
            })
          : new Notification(`Ganhador`, {
              body: `${winner} venceu!`,
              icon: '/trophy.png',
            })  
      }
    }
  }, [winner])

  return (
    <main>
      <h1 className={styles.title}>Jogo da Velha</h1>

      <div className={`${styles.board} ${winner ? styles.gameOver : ''}`}>
        {board.map((item, index) => {
          return (
            <div 
              key={index} 
              className={`${styles.cell} ${(item === '' ?? '') || (item === 'X' ? styles.X : styles.O)}`}
              onClick={() => handleCellClicked(index)}
            >
              {item}
            </div>
          )
        })}
      </div>

      <button 
        type="button" 
        className={styles.reset} 
        onClick={handleResetGame}
      >
        Recomeçar jogo
      </button>
    </main>
  )
}
