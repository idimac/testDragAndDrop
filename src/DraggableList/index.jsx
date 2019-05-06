import React from 'react';
import { ListGroup } from 'react-bootstrap';

class DraggableList extends React.Component {
    state = {
        available: this.props.availableColumns,
        visible: this.props.visibleColumns,
        number: this.props.numberFixed,
        startDragPosition: null,
        startDragItemName: null,
    }
    componentDidMount() {
        document.addEventListener("drop", this.dragEnter, false);
    }
    setVisible = (id) => {
        console.log(id)
        if(this.state.visible.includes(id)) {
            return 
        }
        const updatedVisible = this.state.visible;
        updatedVisible.push(id);
        this.setState({
            visible: updatedVisible
        })
    }

    setAvailable = (id) => {
        const visible = this.state.visible;
        const updatedVisible = visible.filter(visibleName => visibleName !== id);
        this.setState({
            visible: updatedVisible
        })
    }

    dragStart = (item) => {
        this.setState ({
            startDragPosition: item.target.parentNode.parentNode.dataset.listtype,
            startDragItemName: item.target.parentNode.dataset.id
        })
    }

    dragEnter = (event) => {
        const type = event.target.parentNode.dataset.listtype;
        if(type === 'available' && this.state.startDragPosition === 'visible') {
            this.setAvailable(this.state.startDragItemName)
        }
        if (type === 'visible' && this.state.startDragPosition === 'available') {
            this.setVisible(this.state.startDragItemName)
        }
    }


    renderAvailable = (item) => {
        const isVisibleAvailableItem = this.state.visible.find(element => element === item.id);
        if(!isVisibleAvailableItem ) {
            return (
                <ListGroup.Item key={item.id} onDragStart={this.dragStart} data-id={item.id}><div className="drag" draggable>{item.name}</div></ListGroup.Item>
            )
        }
    }
       
    renderVisible = (id) => {
        const item = this.state.available.find(element => element.id === id);
        if(item) {
            return (
                <ListGroup.Item key={item.id} onDragStart={this.dragStart} data-id={item.id}><div className="drag" draggable>{item.name}</div></ListGroup.Item>
            )
        }
    }
    render() {
        return (
            <div className="DraggableList">
                 <div className="leftColumn">
                    <h5>Available</h5>
                    <ListGroup className="list availableList" data-listtype='available' onDragEnter={this.dragEnter}>
                        {this.state.available.map(item => this.renderAvailable(item))}
                    </ListGroup>;
                 </div>
                 <div className="rightColumn">
                    <h5>Visible</h5>
                    <ListGroup className="list visibleList" data-listtype='visible' onDragEnter={this.dragEnter}>
                        {this.state.visible.map(id => this.renderVisible(id))}
                    </ListGroup>;
                 </div>
              </div>
        )
    }
 }

export default DraggableList;