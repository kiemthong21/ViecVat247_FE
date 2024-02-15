import { Fragment } from "react";
import { Routes, Route } from "react-router-dom";
import { publicRoutes } from "~/routes";
import { DefaultLayout } from "~/components/Layout";
import NotFound from "./pages/NotFound";
import GlobalStyles from "./components/GlobalStyles";
import { AuthProvider } from "./utils/AuthContext";

function App() {
    return (
        <AuthProvider>
            <GlobalStyles>
                <Routes>
                    {publicRoutes.map((route, index) => {
                        let Layout = DefaultLayout;
                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }

                        const Page = route.component;

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                    <Route path="/*" element={<NotFound />} />
                </Routes>
            </GlobalStyles>
        </AuthProvider>
    );
}

export default App;
