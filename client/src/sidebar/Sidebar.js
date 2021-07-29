//import react-bootstrap components
import { ListGroup } from 'react-bootstrap';
//import react-router-dom components
import { Route, Switch, Link } from 'react-router-dom';

function Filter(props) {
    //Filter custom component

    //Compute url to point to
    let url = props.n === "Next 7 Days" ? "/next7days" : "/" + props.n.toLowerCase()

    return (<Link to={url}>
        <ListGroup.Item className="flushStyle" action={true} active={props.n === props.currentFilter} >
            {props.n}
        </ListGroup.Item>
    </Link>)
}

function Sidebar(props) {
    //Sidebar custom component

    //If the state sidebarRB of App.js is false => "collapse". In general, when the window reaches a
    //certain size the aside will still be visible and it won't collapse into the button as we did for
    //previous labs. We can use the state to force the collapse class that will make the aside menu
    //collapse when the window size is reduced. The same thing happens when the menu is expanded
    //and the user clicks on the toggle button to close it, sidebarRB is set to false so the menu
    //will collapse.
    //If the state sidebarRB is true => "". If sidebarRB is true then the user has clicked on the toggle 
    //button to expand the menu, sidebarRB has been set to true and so the menu must not collapse, that
    //is the reason why we use "".
    let show = (!props.sidebarRB) ? "collapse" : "";

    //Names of the filters to show in the menu
    const filterNames = ["All", "Important", "Today", "Next 7 Days", "Private"];

    return (<aside className={"d-sm-block col-sm-4 col-12 bg-light below-nav " + show}>
        <Switch>
            <Route exact path="/important">
                <ListGroup>
                    {filterNames.map((name) => <Filter key={name} currentFilter={"Important"} n={name} ></Filter>)}
                </ListGroup>
            </Route>
            <Route exact path="/next7days">
                <ListGroup >
                    {filterNames.map((name) => <Filter key={name} currentFilter={"Next 7 Days"} n={name} ></Filter>)}
                </ListGroup>
            </Route>
            <Route exact path="/private">
                <ListGroup >
                    {filterNames.map((name) => <Filter key={name} currentFilter={"Private"} n={name}  ></Filter>)}
                </ListGroup>
            </Route>
            <Route exact path="/today">
                <ListGroup >
                    {filterNames.map((name) => <Filter key={name} currentFilter={"Today"} n={name}  ></Filter>)}
                </ListGroup>
            </Route>
            <Route exact path="/all">
                <ListGroup >
                    {filterNames.map((name) => <Filter key={name} currentFilter={"All"} n={name}></Filter>)}
                </ListGroup>
            </Route>
            <Route exact path="/">
                <ListGroup >
                    {filterNames.map((name) => <Filter key={name} currentFilter={"All"} n={name}></Filter>)}
                </ListGroup>
            </Route>
            <Route>
                <ListGroup >
                    {filterNames.map((name) => <Filter key={name} currentFilter={"None"} n={name}></Filter>)}
                </ListGroup>
            </Route>
        </Switch>
    </aside>)
}

export default Sidebar;