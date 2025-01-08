import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import {ChangeEvent, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {fetchSubstances, updateSubstanceName} from "store/slices/substancesSlice.ts";
import SubstanceCard from "components/SubstanceCard/SubstanceCard.tsx";
import Bin from "components/Bin/Bin.tsx";

const SubstancesListPage = () => {

    const dispatch = useAppDispatch()

    const {substances, substance_name} = useAppSelector((state) => state.substances)

    const {is_authenticated, is_superuser} = useAppSelector((state) => state.user)

    const {draft_medicine_id, substances_count} = useAppSelector((state) => state.medicines)

    const hasDraft = draft_medicine_id != null

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
                {is_authenticated && !is_superuser &&
                    <Col className="d-flex flex-row justify-content-end" md="6">
                        <Bin isActive={hasDraft} draft_medicine_id={draft_medicine_id} substances_count={substances_count} />
                    </Col>
                }
            </Row>
            <Row className="mt-5 d-flex">
                {substances?.map(substance => (
                    <Col key={substance.id} className="mb-5 d-flex justify-content-center" sm="12" md="6" lg="4">
                        <SubstanceCard substance={substance} showAddBtn={is_authenticated} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default SubstancesListPage