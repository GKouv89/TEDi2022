import Pagination from 'react-bootstrap/Pagination'
import { useState } from 'react'
function MyPagination(props){
    // At most, 3 pages will show in the center,
    // as well as the first and the last one.
    // If there are fewer than 5 tabs overall, no ellipse.
    const [active, setActive] = useState(1)
    let items = [];
    if(props.count > 5){
        items.push(<Pagination.Item active={1 === active} onClick={() => setActive(1)}>{1}</Pagination.Item>)
        if(active <= 3){
            items.push(<Pagination.Item active={2 === active} onClick={() => setActive(2)}>{2}</Pagination.Item>)
            items.push(<Pagination.Item active={3 === active} onClick={() => setActive(3)}>{3}</Pagination.Item>)
            items.push(<Pagination.Ellipsis />)
        }else if(active >= props.count - 2){
            items.push(<Pagination.Ellipsis />)
            items.push(<Pagination.Item active={props.count - 2 === active} onClick={() => setActive(props.count - 2)}>{props.count - 2}</Pagination.Item>)
            items.push(<Pagination.Item active={props.count - 1 === active} onClick={() => setActive(props.count - 1)}>{props.count - 1}</Pagination.Item>)
        }else{
            items.push(<Pagination.Ellipsis />)
            for(let i = active - 1; i <= active + 1; i++){
                items.push(<Pagination.Item active={i === active} onClick={() => setActive(i)}>{i}</Pagination.Item>)
            }
            items.push(<Pagination.Ellipsis />)
        }
        items.push(<Pagination.Item active={props.count === active} onClick={() => setActive(props.count)}>{props.count}</Pagination.Item>)
    }else{
        for(let i = 1; i <= props.count; i++){
            items.push(
                <Pagination.Item active={i === active} onClick={() => setActive(i)}>{i}</Pagination.Item>
            )
        }    
    }

    return(
        <Pagination>
            <Pagination.First onClick={() => setActive(1)}/>
            <Pagination.Prev onClick={() => setActive(active - 1)}/>
            {items}
            <Pagination.Next onClick={() => setActive(active + 1)}/>
            <Pagination.Last onClick={() => setActive(props.count)}/>
        </Pagination>
    )
}

export default MyPagination