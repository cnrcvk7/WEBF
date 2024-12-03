import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import {T_Substance} from "src/modules/types.ts";
import SubstanceCard from "components/SubstanceCard";
import {SubstanceMocks} from "src/modules/mocks.ts";
import {FormEvent, useEffect} from "react";
import * as React from "react";

type Props = {
    substances: T_Substance[],
    setSubstances: React.Dispatch<React.SetStateAction<T_Substance[]>>
    isMock: boolean,
    setIsMock: React.Dispatch<React.SetStateAction<boolean>>
    substanceName: string,
    setSubstanceName: React.Dispatch<React.SetStateAction<string>>
}

const SubstancesListPage = ({substances, setSubstances, isMock, setIsMock, substanceName, setSubstanceName}:Props) => {

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/substances/?substance_name=${substanceName.toLowerCase()}`)
            const data = await response.json()
            setSubstances(data.substances)
            setIsMock(false)
        } catch {
            createMocks()
        }
    }

    const createMocks = () => {
        setIsMock(true)
        setSubstances(SubstanceMocks.filter(substance => substance.name.toLowerCase().includes(substanceName.toLowerCase())))
    }

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        if (isMock) {
            createMocks()
        } else {
            await fetchData()
        }
    }

    useEffect(() => {
        fetchData()
    }, []);

    return (
        <Container>
            <Row className="mb-5">
                <Col md="6">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md="8">
                                <Input value={substanceName} onChange={(e) => setSubstanceName(e.target.value)} placeholder="Поиск..."></Input>
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
                    <Col key={substance.id} xs="4">
                        <SubstanceCard substance={substance} isMock={isMock} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default SubstancesListPage