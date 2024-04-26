import React, { useState } from 'react'
import { Paper } from '@mui/material'
import Introduction from './sections/introduction'
import LearningAssistant from '../../learning_assistant'
import Button from '@mui/material/Button'
export default function Content () {
  const [page, setPage] = useState(0)

  const handleBackButtonClick = () => {
    if (page > 0) {
      setPage(page - 1)
    }
  }

  const handleForwardButtonClick = () => {
    if (page === 0) {
      setPage(page + 1)
    }
  }
  return (
    <>

    <Paper
      elevation={3}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '4%',
        height: '90vh',
        width: '95%'
      }}>
      {page === 0 && <Introduction />}
      {page > 0 && <LearningAssistant />}
    </Paper>
    <div style={{ marginBottom: '5%', display: 'flex', justifyContent: 'space-between', width: '50%' }}>
      <Button variant="contained" color="primary" onClick={() => handleBackButtonClick()}>
        Previous
        </Button>
        <Button variant="contained" color="primary" onClick={() => handleForwardButtonClick()}>
          Next
        </Button>
    </div>
    </>
  )
}
