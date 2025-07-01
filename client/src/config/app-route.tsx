import Page1 from "../pages/HomePage";
import Page2 from "../pages/ScenarioBuilderPage";
import Page3 from "../pages/ModelHubPage";

const AppRoute = [
    {
        path: "/page1",
        element: <Page1 />
    },
    {
        path: "/page2",
        element: <Page2 />
    },
    {
        path: "/page3",
        element: <Page3 />
    }
]

export default AppRoute;