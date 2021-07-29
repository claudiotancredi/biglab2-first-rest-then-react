//import my icons
import profileIcon from "../myicons/profileicon.svg";
import todoIcon from "../myicons/todoicon.svg";
//import react-bootstrap components
import { Navbar, Image, Form, Button } from 'react-bootstrap';

function ToggleButton(props) {
    //ToggleButton custom component

    //Callback function used to toggle the state sidebarRB of the App component.
    //sidebarRB is passed to the Sidebar component and this change will start the
    //re-rendering phase so that the menu can be collapsed/shown.
    const toggleSidebar = () => {
        props.setSidebarRBState((state) => !state);
    }
    //Toggle button with onClick callback
    return (<Navbar.Toggle onClick={toggleSidebar} />)
}

function Logo() {
    //Logo custom component (icon + name)
    return (
        <Navbar.Brand href="#">
            <Image src={todoIcon} />{' '}
        ToDo Manager
        </Navbar.Brand>
    )
}

function SearchBar() {
    //SearchBar custom component - no implementation required here.
    return (
        <Form className="my-2 my-lg-0 mx-auto d-none d-sm-block" inline={true} action="#" aria-label="Quick search" role="search">
            <Form.Control as="input" className="mr-sm-2" type="search" placeholder="Search" aria-label="Search query" />
        </Form>
    )
}

function ProfileIcon(props) {
    //ProfileIcon custom component - no implementation required here.
    return (<>
        <Navbar.Brand>
            {props.username}{' '}
            <Image src={profileIcon} />
        </Navbar.Brand>
        <Button className="logout " size="md" variant="link outline-light" as="title" onClick={props.logout}>Logout </Button>
    </>)
}

function NavBar(props) {
    //NavBar custom component
    return (
        <Navbar expand="sm" bg="success" variant="dark" fixed="top">

            <ToggleButton setSidebarRBState={props.setSidebarRBState} />

            <Logo />

            <SearchBar />

            <ProfileIcon username={props.username} logout={props.logout} />

        </Navbar>
    )
}

export default NavBar;