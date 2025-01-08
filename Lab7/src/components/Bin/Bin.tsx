import {Link} from "react-router-dom";
import {Badge, Button} from "reactstrap";

type Props = {
    isActive: boolean,
    draft_medicine_id: string,
    substances_count: number
}

const Bin = ({isActive, draft_medicine_id, substances_count}:Props) => {

    if (!isActive) {
        return <Button color={"secondary"} className="bin-wrapper" disabled>Корзина</Button>
    }

    return (
        <Link to={`/medicines/${draft_medicine_id}/`} className="bin-wrapper">
            <Button color={"primary"} className="w-100 bin">
                Корзина
                <Badge>
                    {substances_count}
                </Badge>
            </Button>
        </Link>
    )
}

export default Bin