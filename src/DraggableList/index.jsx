import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';

class DraggableList extends React.Component {
  state = {
    available: [],
    visible: [],
    startDragPosition: null,
    startDragItemName: null,
    startDragItemIndex: null,
    dragTarget: null,
    fixedVisibles: [],
    fixedVisible: null,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.available.length !== nextProps.availableColumns.length) {
      return {
        available: nextProps.availableColumns,
        visible: nextProps.visibleColumns,
        number: nextProps.numberFixed,
        fixedVisibles: nextProps.visibleColumns.slice(0, nextProps.numberFixed),
      };
    }
    return null;
  }

  setVisible = id => {
    const { visible } = this.state;
    if (visible.includes(id)) {
      return;
    }
    this.setState({
      visible: [...visible, id],
    });
  };

  setAvailable = id => {
    const { visible } = this.state;
    const updatedVisible = visible.filter(visibleName => visibleName !== id);
    this.setState({
      visible: updatedVisible,
    });
  };

  dragTargetChange = ({ target }) => {
    const { startDragPosition, available, visible } = this.state;
    let dropTarget;
    const type = target.parentNode.dataset.listtype || target.dataset.listtype;
    if (type === 'available' && startDragPosition === 'available') {
      dropTarget = available.findIndex(item => item.id === target.dataset.id);
      this.setState({
        dragTarget: dropTarget,
      });
    }
    if (type === 'visible' && startDragPosition === 'visible') {
      dropTarget = visible.findIndex(item => item === target.dataset.id);
      this.setState({
        dragTarget: dropTarget,
      });
    }
  };

  changeAvailablePosition = () => {
    const { startDragItemIndex, dragTarget, available } = this.state;
    const arr = available.map((el, index) => {
      if (index === dragTarget) {
        return available[startDragItemIndex];
      }
      if (index === startDragItemIndex) {
        return available[dragTarget];
      }
      return el;
    });
    this.setState({
      available: arr,
    });
  };

  changeVisiblePosition = () => {
    const {
      startDragItemIndex,
      dragTarget,
      visible,
      fixedVisible,
    } = this.state;
    if (dragTarget < fixedVisible - 1) {
      return null;
    }
    const arr = visible.map((el, index) => {
      if (index === dragTarget) {
        return visible[startDragItemIndex];
      }
      if (index === startDragItemIndex) {
        return visible[dragTarget];
      }
      return el;
    });
    this.setState({
      visible: arr,
    });
  };

  dragStart = index => event => {
    const { parentNode, dataset } = event.target.parentNode;
    this.setState({
      startDragPosition: parentNode.dataset.listtype,
      startDragItemName: dataset.id,
      startDragItemIndex: index,
    });
  };

  dragEnter = ({ target }) => {
    const { startDragPosition, startDragItemName } = this.state;
    const type = target.parentNode.dataset.listtype || target.dataset.listtype;
    if (type === 'available' && startDragPosition === 'visible') {
      this.setAvailable(startDragItemName);
    }
    if (type === 'visible' && startDragPosition === 'available') {
      this.setVisible(startDragItemName);
    }
  };

  toggleFixed = index => () => {
    this.setState({
      fixedVisible: index + 1,
    });
  };

  renderAvailable = (item, index) => {
    const { visible } = this.state;
    const isVisibleAvailableItem = visible.find(element => element === item.id);
    if (!isVisibleAvailableItem) {
      return (
        <ListGroup.Item
          key={item.id}
          onDragStart={this.dragStart(index)}
          onDragEnter={this.dragTargetChange}
          onDragEnd={this.changeAvailablePosition}
          data-id={item.id}>
          <div className="drag" draggable>
            {item.name}
          </div>
        </ListGroup.Item>
      );
    }
    return null;
  };

  renderVisible = (id, index) => {
    const { available, fixedVisible } = this.state;
    const item = available.find(element => element.id === id);
    const isLocked = fixedVisible > index;
    if (item) {
      return (
        <ListGroup.Item
          key={item.id}
          className={isLocked ? 'fixed' : null}
          onDragStart={this.dragStart(index)}
          onDragEnter={this.dragTargetChange}
          onDragEnd={this.changeVisiblePosition}
          onDoubleClick={this.toggleFixed(index)}
          data-id={item.id}>
          <div className="drag" draggable={!isLocked}>
            {item.name}
          </div>
        </ListGroup.Item>
      );
    }
    return null;
  };

  saveButton = () => {
    const { visible, fixedVisibles } = this.state;
    alert(
      `Visible columns: ${visible} \n\rСount of fixed: ${fixedVisibles.length}`,
    );
  };

  render() {
    const { available, visible } = this.state;
    return (
      <div>
        <div className="DraggableList">
          <div className="leftColumn">
            <h5>Available</h5>
            <ListGroup
              className="list availableList"
              data-listtype="available"
              onDragEnter={this.dragEnter}>
              {available.map(this.renderAvailable)}
            </ListGroup>
            ;
          </div>
          <div className="rightColumn">
            <h5>Visible</h5>
            <ListGroup
              className="list visibleList"
              data-listtype="visible"
              onDragEnter={this.dragEnter}>
              {visible.map(this.renderVisible)}
            </ListGroup>
          </div>
        </div>
        <div className="buttonsSegment">
          <Button variant="primary" onClick={this.saveButton}>
            Save
          </Button>
          <Button variant="secondary">Cancel</Button>
        </div>
      </div>
    );
  }
}

export default DraggableList;
