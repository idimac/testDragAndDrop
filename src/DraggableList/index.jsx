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
        const { visible } = this.state;
        if(visible.includes(id)) {
            return 
        }
        const updatedVisible = [...visible];
        updatedVisible.push(id);
        this.setState({
            visible: updatedVisible
        })
    }

    setAvailable = (id) => {
        const { visible } = this.state;
        const updatedVisible = visible.filter(visibleName => visibleName !== id);
        this.setState({
            visible: updatedVisible
        })
    }
     
    dragTargetChange = (event) => {
        const { target } = event;
        const { startDragPosition, available, visible } = this.state;
        const type = target.parentNode.dataset.listtype || target.dataset.listtype;
        if(type === 'available' && startDragPosition === 'available') {
            let dropTarget = available.findIndex((item => item.id === target.dataset.id));
            this.setState({
                dragTarget: dropTarget
            }); 
        }
        if(type === 'visible' && startDragPosition === 'visible') {
            let dropTarget = visible.findIndex((item => item === target.dataset.id));
            this.setState({
                dragTarget: dropTarget
            }); 
        }
    }

    changeAvailablePosition = () => {
            const { startDragItemIndex, dragTarget, available } = this.state;
            let arr = available;
            arr.splice(dragTarget, 0, arr.splice(startDragItemIndex, 1)[0]); 
            this.setState({
                available: arr
            }); 
    }

    changeVisiblePosition = () => {
        const { startDragItemIndex, dragTarget, visible } = this.state;
        let arr = visible;
        arr.splice(dragTarget, 0, arr.splice(startDragItemIndex, 1)[0]); 
        this.setState({
            visible: arr
        }); 
}

    dragStart = (item, index) => {
        const { parentNode } = item.target;
        this.setState ({
            startDragPosition: parentNode.parentNode.dataset.listtype,
            startDragItemName: parentNode.dataset.id,
            startDragItemIndex: index,
        })
    }

    dragEnter = (event) => {
        const { startDragPosition, startDragItemName } = this.state;
        const { target } = event;
        const type = target.parentNode.dataset.listtype || target.dataset.listtype;
        if(type === 'available' && startDragPosition === 'visible') {
            this.setAvailable(startDragItemName)
        }
        if (type === 'visible' && startDragPosition === 'available') {
            this.setVisible(startDragItemName)
        }
    }

    toggleFixed = (index) => {
        const { visible, fixedVisibles } = this.state;
        const fixedVisiblesToUpdate = [...fixedVisibles]; 
        const target = visible[index];
        const targetFixedInState = fixedVisiblesToUpdate.indexOf(target);
        if( targetFixedInState !== -1) {
            for(let i = index; i < this.state.visible.length; i++) {
                let deletedFromFixed = fixedVisiblesToUpdate.indexOf(this.state.visible[i]);
                if(deletedFromFixed !== -1) {
                    fixedVisiblesToUpdate.splice(deletedFromFixed,1);
                }
            }
        } else {
            for(let i=index; i >= 0; i--){
                if(fixedVisiblesToUpdate.indexOf(this.state.visible[i]) === -1) {
                    fixedVisiblesToUpdate.push(this.state.visible[i])
                } 
            }
        }
        this.setState({
            fixedVisibles: fixedVisiblesToUpdate
        })
    }


    renderAvailable = (item, index) => {
        const { visible } = this.state;
        const isVisibleAvailableItem = visible.find(element => element === item.id);
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
        const { available, fixedVisibles } = this.state;
        const item = available.find(element => element.id === id);
        const draggable = (fixedVisibles.find(itemInFixed =>itemInFixed === item.id));
        if(item) {
            return (
                <ListGroup.Item key={item.id} 
                    className={fixedVisibles.find(fixed => fixed === item.id) ? 'fixed': null}
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
        const { visible, fixedVisibles } = this.state;
        alert(`Visible columns: ${visible} \n\rСount of fixed: ${fixedVisibles.length}`)
    }
    render() {
        const { available, visible } = this.state;
        return (
            <div>
                <div className="DraggableList">
                    <div className="leftColumn">
                        <h5>Available</h5>
                        <ListGroup className="list availableList" data-listtype='available' onDragEnter={this.dragEnter}>
                            {available.map((item, index) => this.renderAvailable(item, index))}
                        </ListGroup>;
                    </div>
                    <div className="rightColumn">
                        <h5>Visible</h5>
                        <ListGroup className="list visibleList" data-listtype='visible' onDragEnter={this.dragEnter}>
                            {visible.map((id, index) => this.renderVisible(id, index))}
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