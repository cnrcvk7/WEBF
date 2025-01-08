import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {Col, Container, Row} from "reactstrap";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {fetchSubstance, removeSelectedSubstance} from "store/slices/substancesSlice.ts";

const SubstancePage = () => {
    const { id } = useParams<{id: string}>();

    const dispatch = useAppDispatch()

    const {substance} = useAppSelector((state) => state.substances)

    useEffect(() => {
        dispatch(fetchSubstance(id))
        return () => dispatch(removeSelectedSubstance())
    }, []);

    if (!substance) {
        return (
            <div>

            </div>
        )
    }

    return (
        <Container>
            <Row>
                <Col md="6">
                    <img
                        alt=""
                        src={substance.image}
                        className="w-100"
                    />
                </Col>
                <Col md="6">
                    <h1 className="mb-3">{substance.name}</h1>
                    <p className="fs-5">Описание: {substance.description}</p>
                    <p className="fs-5">Порядковый номер: {substance.number} </p>
                </Col>
            </Row>
        </Container>
    );
};

export default SubstancePage