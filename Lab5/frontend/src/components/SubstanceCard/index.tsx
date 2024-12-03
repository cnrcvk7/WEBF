import {Button, Card, CardBody, CardImg, CardText, CardTitle} from "reactstrap";
import mockImage from "assets/mock.png";
import {Link} from "react-router-dom";
import {T_Substance} from "modules/types.ts";

interface SubstanceCardProps {
    substance: T_Substance,
    isMock: boolean
}

const SubstanceCard = ({substance, isMock}: SubstanceCardProps) => {
    return (
        <Card key={substance.id} style={{width: '18rem', margin: "0 auto 50px", height: "calc(100% - 50px)" }}>
            <CardImg
                src={isMock ? mockImage as string : substance.image}
                style={{"height": "200px"}}
            />
            <CardBody className="d-flex flex-column justify-content-between">
                <CardTitle tag="h5">
                    {substance.name}
                </CardTitle>
                <CardText>
                    Порядковый номер: {substance.number}
                </CardText>
                <Link to={`/substances/${substance.id}`}>
                    <Button color="primary">
                        Открыть
                    </Button>
                </Link>
            </CardBody>
        </Card>
    );
};

export default SubstanceCard