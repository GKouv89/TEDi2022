import Pagination from 'react-bootstrap/Pagination'
import { useState, useContext, useEffect } from 'react'
import { PaginationContext } from '../context/PaginationContext'

function MyPagination(props){
    // At most, 3 pages will show in the center,
    // as well as the first and the last one.
    // If there are fewer than 5 tabs overall, no ellipse.
    // const [active, setActive] = useState(1)
    const { active, setActive,} = useContext(PaginationContext);
    let items = [];

    const handleClick = (page) => {
        setActive(page)
        props.callback(page)
    }

    if(props.count > 5){
        items.push(<Pagination.Item active={1 === active} onClick={() => handleClick(1)}>{1}</Pagination.Item>)
        if(active <= 3){
            items.push(<Pagination.Item active={2 === active} onClick={() => handleClick(2)}>{2}</Pagination.Item>)
            items.push(<Pagination.Item active={3 === active} onClick={() => handleClick(3)}>{3}</Pagination.Item>)
            items.push(<Pagination.Ellipsis />)
        }else if(active >= props.count - 2){
            items.push(<Pagination.Ellipsis />)
            items.push(<Pagination.Item active={props.count - 2 === active} onClick={() => handleClick(props.count - 2)}>{props.count - 2}</Pagination.Item>)
            items.push(<Pagination.Item active={props.count - 1 === active} onClick={() => handleClick(props.count - 1)}>{props.count - 1}</Pagination.Item>)
        }else{
            items.push(<Pagination.Ellipsis />)
            for(let i = active - 1; i <= active + 1; i++){
                items.push(<Pagination.Item active={i === active} onClick={() => handleClick(i)}>{i}</Pagination.Item>)
            }
            items.push(<Pagination.Ellipsis />)
        }
        items.push(<Pagination.Item active={props.count === active} onClick={() => handleClick(props.count)}>{props.count}</Pagination.Item>)
    }else{
        for(let i = 1; i <= props.count; i++){
            items.push(
                <Pagination.Item active={i === active} onClick={() => handleClick(i)}>{i}</Pagination.Item>
            )
        }    
    }

    return(
        <Pagination>
            <Pagination.First onClick={() => handleClick(1)}/>
            <Pagination.Prev onClick={() => handleClick(active - 1)}/>
            {items}
            <Pagination.Next onClick={() => handleClick(active + 1)}/>
            <Pagination.Last onClick={() => handleClick(props.count)}/>
        </Pagination>
    )
}

export default MyPagination