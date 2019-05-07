import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';

class DraggableList extends React.Component {
    state = {
        available: [],
        visible: [],
        number: 0,
        startDragPosition: null,
        startDragItemName: null,
        startDragItemIndex: null,
        dragTarget: null,
        fixedVisibles: [],
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.available !== nextProps.availableColumns) {
          return {
            available: nextProps.availableColumns,
            visible: nextProps.visibleColumns,
            number: nextProps.numberFixed,
            fixedVisibles: nextProps.visibleColumns.slice(0, nextProps.numberFixed)
          };
        };
        return null;
    }

    setVisible = (id) => {
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
     
    dragTargetChange = (event) => {
        const type = event.target.parentNode.dataset.listtype || event.target.dataset.listtype;
        if(type === 'available' && this.state.startDragPosition === 'available') {
            let dropTarget = this.state.available.findIndex((item => item.id === event.target.dataset.id));
            this.setState({
                dragTarget: dropTarget
            }); 
        }
        if(type === 'visible' && this.state.startDragPosition === 'visible') {
            let dropTarget = this.state.visible.findIndex((item => item === event.target.dataset.id));
            this.setState({
                dragTarget: dropTarget
            }); 
        }
    }

    changeAvailablePosition = () => {
            let startDragIndex = this.state.startDragItemIndex;
            let dropTarget = this.state.dragTarget;
            let arr = this.state.available;
            arr.splice(dropTarget, 0, arr.splice(startDragIndex, 1)[0]); 
            this.setState({
                available: arr
            }); 
    }

    changeVisiblePosition = () => {
        let startDragIndex = this.state.startDragItemIndex;
        let dropTarget = this.state.dragTarget;
        let arr = this.state.visible;
        arr.splice(dropTarget, 0, arr.splice(startDragIndex, 1)[0]); 
        this.setState({
            visible: arr
        }); 
}

    dragStart = (item, index) => {
        this.setState ({
            startDragPosition: item.target.parentNode.parentNode.dataset.listtype,
            startDragItemName: item.target.parentNode.dataset.id,
            startDragItemIndex: index,
        })
    }

    dragEnter = (event) => {
        const type = event.target.parentNode.dataset.listtype || event.target.dataset.listtype;
        if(type === 'available' && this.state.startDragPosition === 'visible') {
            this.setAvailable(this.state.startDragItemName)
        }
        if (type === 'visible' && this.state.startDragPosition === 'available') {
            this.setVisible(this.state.startDragItemName)
        }
    }

    toggleFixed = (index) => {
        const target = this.state.visible[index];
        let currentFixedVisibles = this.state.fixedVisibles;
        const targetFixedInState = currentFixedVisibles.indexOf(target);
        if( targetFixedInState !== -1) {
            for(let i = index; i < this.state.visible.length; i++) {
                let deletedFromFixed = currentFixedVisibles.indexOf(this.state.visible[i]);
                if(deletedFromFixed !== -1) {
                    currentFixedVisibles.splice(deletedFromFixed,1);
                }
            }
        } else {
            for(let i=index; i >= 0; i--){
                if(currentFixedVisibles.indexOf(this.state.visible[i]) === -1) {
                    currentFixedVisibles.push(this.state.visible[i])
                } 
            }
        }
        this.setState({
            fixedVisibles: currentFixedVisibles
        })
    }


    renderAvailable = (item, index) => {
        const isVisibleAvailableItem = this.state.visible.find(element => element === item.id);
        if(!isVisibleAvailableItem ) {
            return (
                <ListGroup.Item key={item.id} 
                    onDragStart={(e)=>this.dragStart(e, index)} 
                    onDragEnter={this.dragTargetChange} 
                    onDragEnd={this.changeAvailablePosition} 
                    data-id={item.id}>
                        <div className="drag" draggable>{item.name}</div>
                    </ListGroup.Item>
            )
        }
    }
       
    renderVisible = (id, index) => {
        const item = this.state.available.find(element => element.id === id);
        const draggable = (this.state.fixedVisibles.find(itemInFixed =>itemInFixed === item.id));
        if(item) {
            return (
                <ListGroup.Item key={item.id} 
                    className={this.state.fixedVisibles.find(fixed => fixed === item.id) ? 'fixed': null}
                    onDragStart={(e)=>this.dragStart(e, index)} 
                    onDragEnter={this.dragTargetChange} 
                    onDragEnd={this.changeVisiblePosition} 
                    onDoubleClick={(e)=>this.toggleFixed(index)}
                    data-id={item.id}>
                        <div className="drag" draggable={!draggable}>{item.name}</div>
                    </ListGroup.Item>
            )
        }
    }

    saveButton = () => {
        alert(`Visible columns: ${this.state.visible} \n\rСount of fixed: ${this.state.fixedVisibles.length}`)
    }
    render() {
        return (
            <div>
                <div className="DraggableList">
                    <div className="leftColumn">
                        <h5>Available</h5>
                        <ListGroup className="list availableList" data-listtype='available' onDragEnter={this.dragEnter}>
                            {this.state.available.map((item, index) => this.renderAvailable(item, index))}
                        </ListGroup>;
                    </div>
                    <div className="rightColumn">
                        <h5>Visible</h5>
                        <ListGroup className="list visibleList" data-listtype='visible' onDragEnter={this.dragEnter}>
                            {this.state.visible.map((id, index) => this.renderVisible(id, index))}
                        </ListGroup>
                    </div>
                </div>
                <div className="buttonsSegment">
                    <Button variant="primary" onClick={this.saveButton}>Save</Button>
                    <Button variant="secondary">Cancel</Button>
                </div>  
             </div>
        )
    }
 }

export default DraggableList;