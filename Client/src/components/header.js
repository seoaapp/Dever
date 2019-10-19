import React from 'react'
import { Menu, Container } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

const Header = () => {
  return (
    <header>
      <Menu fixed='top' inverted>
        <Container>
          <Menu.Item header>Dever</Menu.Item>
        </Container>
      </Menu>
    </header>
  )
}

export default Header
