import {Route, Routes} from "react-router-dom";
import {Container, Row} from "reactstrap";
import "./styles.css"
import HomePage from "pages/HomePage/HomePage.tsx";
import LoginPage from "pages/LoginPage/LoginPage.tsx";
import RegisterPage from "pages/RegisterPage/RegisterPage.tsx";
import SubstancesListPage from "pages/SubstancesListPage/SubstancesListPage.tsx";
import SubstancePage from "pages/SubstancePage/SubstancePage.tsx";
import MedicinesPage from "pages/MedicinesPage/MedicinesPage.tsx";
import MedicinePage from "pages/MedicinePage/MedicinePage.tsx";
import ProfilePage from "pages/ProfilePage/ProfilePage.tsx";
import AccessDeniedPage from "pages/AccessDeniedPage/AccessDeniedPage.tsx";
import NotFoundPage from "pages/NotFoundPage/NotFoundPage.tsx";
import Header from "components/Header/Header.tsx";
import Breadcrumbs from "components/Breadcrumbs/Breadcrumbs.tsx";
import SubstancesTablePage from "pages/SubstancesTablePage/SubstancesTablePage.tsx";
import SubstanceEditPage from "pages/SubstanceEditPage/SubstanceEditPage.tsx";
import SubstanceAddPage from "pages/SubstanceAddPage/SubstanceAddPage.tsx";

function App() {
    return (
        <div>
            <Header />
            <Container className="pt-4">
                <Row className="mb-3">
                    <Breadcrumbs />
                </Row>
                <Row>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login/" element={<LoginPage />} />
                        <Route path="/register/" element={<RegisterPage />} />
                        <Route path="/substances/" element={<SubstancesListPage />} />
                        <Route path="/substances-table/" element={<SubstancesTablePage />} />
                        <Route path="/substances/:id/" element={<SubstancePage />} />
                        <Route path="/substances/:id/edit" element={<SubstanceEditPage />} />
                        <Route path="/substances/add" element={<SubstanceAddPage />} />
                        <Route path="/medicines/" element={<MedicinesPage />} />
                        <Route path="/medicines/:id/" element={<MedicinePage />} />
                        <Route path="/profile/" element={<ProfilePage />} />
                        <Route path="/403/" element={<AccessDeniedPage />} />
                        <Route path="/404/" element={<NotFoundPage />} />
                        <Route path='*' element={<NotFoundPage />} />
                    </Routes>
                </Row>
            </Container>
        </div>
    )
}

export default App
