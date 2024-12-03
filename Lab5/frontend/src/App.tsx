import {useState} from "react";
import Header from "components/Header";
import Breadcrumbs from "components/Breadcrumbs";
import SubstancePage from "pages/SubstancePage";
import SubstancesListPage from "pages/SubstancesListPage";
import {Route, Routes} from "react-router-dom";
import {T_Substance} from "src/modules/types.ts";
import {Container, Row} from "reactstrap";
import HomePage from "pages/HomePage";
import "./styles.css"

function App() {

    const [substances, setSubstances] = useState<T_Substance[]>([])

    const [selectedSubstance, setSelectedSubstance] = useState<T_Substance | null>(null)

    const [isMock, setIsMock] = useState(false);

    const [substanceName, setSubstanceName] = useState<string>("")

    return (
        <div>
            <Header/>
            <Container className="pt-4">
                <Row className="mb-3">
                    <Breadcrumbs selectedSubstance={selectedSubstance} />
                </Row>
                <Row>
                    <Routes>
						<Route path="/" element={<HomePage />} />
                        <Route path="/substances/" element={<SubstancesListPage substances={substances} setSubstances={setSubstances} isMock={isMock} setIsMock={setIsMock} substanceName={substanceName} setSubstanceName={setSubstanceName}/>} />
                        <Route path="/substances/:id" element={<SubstancePage selectedSubstance={selectedSubstance} setSelectedSubstance={setSelectedSubstance} isMock={isMock} setIsMock={setIsMock}/>} />
                    </Routes>
                </Row>
            </Container>
        </div>
    )
}

export default App
