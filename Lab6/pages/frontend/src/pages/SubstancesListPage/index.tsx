import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import SubstanceCard from "components/SubstanceCard";
import {ChangeEvent, FormEvent, useEffect} from "react";
import * as React from "react";
import {useAppSelector} from "src/store/store.ts";
import {updateSubstanceName} from "src/store/slices/substancesSlice.ts";
import {T_Substance} from "modules/types.ts";
import {SubstanceMocks} from "modules/mocks.ts";
import {useDispatch} from "react-redux";

type Props = {
    substances: T_Substance[],
    setSubstances: React.Dispatch<React.SetStateAction<T_Substance[]>>
    isMock: boolean,
    setIsMock: React.Dispatch<React.SetStateAction<boolean>>
}

const SubstancesListPage = ({substances, setSubstances, isMock, setIsMock}:Props) => {

    const dispatch = useDispatch()

    const {substance_name} = useAppSelector((state) => state.substances)

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        dispatch(updateSubstanceName(e.target.value))
    }

    const createMocks = () => {
        setIsMock(true)
        setSubstances(SubstanceMocks.filter(substance => substance.name.toLowerCase().includes(substance_name.toLowerCase())))
    }

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        await fetchSubstances()
    }

    const fetchSubstances = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/substances/?substance_name=${substance_name.toLowerCase()}`)
            const data = await response.json()
            setSubstances(data.substances)
            setIsMock(false)
        } catch {
            createMocks()
        }
    }

    useEffect(() => {
        fetchSubstances()
    }, []);

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
            </Row>
            <Row>
                {substances?.map(substance => (
                    <Col key={substance.id} sm="12" md="6" lg="4">
                        <SubstanceCard substance={substance} isMock={isMock} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default SubstancesListPage