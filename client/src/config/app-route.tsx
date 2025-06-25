import Page1 from "../pages/HomePage";
import Page2 from "../pages/ScenarioBuilderPage";

const AppRoute = [
    {
        path: "/page1",
        element: <Page1 />
    },
    {
        path: "/page2",
        element: <Page2 />
    }
]

export default AppRoute;