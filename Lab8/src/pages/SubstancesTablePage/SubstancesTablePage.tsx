import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import {ChangeEvent, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {fetchSubstances, updateSubstanceName} from "store/slices/substancesSlice.ts";
import {Link, useNavigate} from "react-router-dom";
import SubstancesTable from "components/SubstancesTable/SubstancesTable.tsx";

const SubstancesTablePage = () => {

    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const {is_authenticated, is_superuser} = useAppSelector((state) => state.user)

    const {substances, substance_name} = useAppSelector((state) => state.substances)

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        dispatch(updateSubstanceName(e.target.value))
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(fetchSubstances())
    }

    useEffect(() => {
        dispatch(fetchSubstances())
    }, [])

    useEffect(() => {
        if (!is_superuser) {
            navigate("/403/")
        }
    }, [is_authenticated, is_superuser]);

    return (
        <Container>
            <Row className="mb-5">
                <Col md="6">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col xs="8">
                                <Input value={substance_name} onChange={handleChange} placeholder="Поиск..."></Input>
                            </Col>
                            <Col>
                                <Button color="primary" className="w-100 search-btn">Поиск</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col className="d-flex flex-row justify-content-end" md="6">
                    <Link to="/substances/add">
                        <Button color="primary">Новое вещество</Button>
                    </Link>
                </Col>
            </Row>
            <Row className="mt-5 d-flex">
                {substances.length > 0 ? <SubstancesTable substances={substances} fetchSubstances={fetchSubstances}/> : <h3 className="text-center mt-5">Вещества не найдены</h3>}
            </Row>
        </Container>
    );
};

export default SubstancesTablePage