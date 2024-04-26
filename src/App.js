import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, useMediaQuery } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import React, { useState } from 'react'
import DataVisual from './pages/data_visual/data_visual'
import MapView from './pages/map_view/map_view'
import Learn from './pages/learn/learn'
import Home from './pages/home/home'
import CanadaFires from './pages/learn/modules/2023_canada_fires/canada_fires'
import './App.css'

function App () {
  const [anchorEl, setAnchorEl] = useState(null)
  const location = useLocation()
  const hideAppBar = location.pathname.startsWith('/Learn/module')
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const isSmallScreen = useMediaQuery('(max-width:600px)')

  return (
    <>
      {!hideAppBar && <AppBar position="static">
        <Toolbar>
          <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6">
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>TerraVaticus</Link>
              </Typography>
              {!isSmallScreen && (
              <>
              <div style={{ margin: '0 10%' }}>
                {' '}
                {/* Spacer */}
                <Link to="/data_visual" className="headerLink">
                  2023 Data Graphs
                </Link>
              </div>
              <div style={{ margin: '0 10%' }}>
                {' '}
                {/* Spacer */}
                <Link to="/Pollution Forecasts" className="headerLink">
                  Pollution Forecasts
                </Link>
              </div>
              <div style={{ margin: '0 10%' }}>
                {' '}
                {/* Spacer */}
                <Link to="/Learn" className="headerLink">
                  Learning Modules
                </Link>
              </div>
            </>)}
          </div>
          {isSmallScreen
            ? (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
              style={{ marginLeft: 'auto' }}
            >
              <MenuIcon />
            </IconButton>
              )
            : '' }

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              style={{ position: 'absolute' }} // Adjust the positioning as needed
            >
              <MenuItem component={Link} to="/" onClick={handleMenuClose}>
                Home
              </MenuItem>
              <MenuItem component={Link} to="/Pollution Forecasts" onClick={handleMenuClose}>
                Pollution Forecasts
              </MenuItem>
              <MenuItem component={Link} to="/Learn" onClick={handleMenuClose}>
                Learning Modules
              </MenuItem>
            </Menu>
          </Toolbar>
      </AppBar>}
      <Routes>
        <Route
          path="/data_visual"
          element={<DataVisual />}
        />
        <Route path="/Pollution Forecasts" element={<MapView />} />
        <Route path="/Learn" element={<Learn />} />
        <Route path="/Learn/module/2023_Canada_Fires" element={<CanadaFires />} />
        <Route
          path="/"
          element={(
            <Home />
          )}
        />
      </Routes>
      </>
  )
}

export default App
