import ReactDom from 'react-dom';
import React, {Fragment} from 'react';
import {createStore} from 'redux';

function TodoApp (state = {}, action) {
    switch(action.type) {
        case 'ADD_ITEM' :
            return {...state, items: [...state.items, action.item]}
       case 'DELETE_ITEM' :
            return {...state, items: state.items.filter(item => {
                    if(item.id !== action.itemId){
                        return item;
                    }
                })
            }
        case 'CHANGE_SELECTION':
            return {...state, items: state.items.map(item => {
                    if(item.id == action.itemId){
                        item.selected ? "" : "checked";
                        return item;
                    } else {
                        return item;
                    }
                })
            }

        default :
            return state;
    }
}

const store = createStore(TodoApp, {
    items : [
        {id: "123", "text" : "List Item 1", selected: ''},
        {id: "234", "text" : "List Item 2", selected: ''}
    ]
});

let inputElement = null;

const ListItems = ({items}) => 
    <ul className="list-group">
        {items.map( i => 
            <li className={"list-group-item " + (i.selected ? 'selected' : '')} key={i.id}>
                <input type="checkbox" checked={i.selected} onClick={changeSelection} data-id={i.id} id={i.id} />
                <label htmlFor={i.id}>{i.text}</label>
                <a href="#" onClick={deleteItem.bind(this, i)}>Delete Item</a>
            </li>
        )}
    </ul>;

const AddListItem = () => {
        return (
            <div className="container">
                <div className="panel panel-default">
                    <div className="panel-body">
                        <h1>TODO LIST APP</h1>
                        <form onSubmit={addItem}>
                            <div className = "input-group">
                                <input type="text" placeholder="Add Item" ref={node => inputElement = node} className="form-control" />
                                <span className="input-group-btn">
                                    <button className="btn btn-default btn-primary" type="submit">Add</button>
                                </span>
                            </div>
                        </form>  
                    </div>
                </div>
            </div>    
        );
    }

function addItem(e) {
    //e.preventDefault();
    const newItemVal = inputElement.value.trim();
    if (newItemVal == ''){
        return false;
    }
    else {
        const item = {
            'id': '' + Math.random(),
            'text': newItemVal,
            'selected': ''
        }
        store.dispatch({
            type: 'ADD_ITEM',
            item
        });
        inputElement.value = '';
    }    
}

function deleteItem(e) {
    //e.preventDefault();
    const itemId = e.id;
    store.dispatch({
        type: 'DELETE_ITEM',
        itemId
    });
}

function changeSelection(e) {
    const itemId = e.target.dataset.id;
    store.dispatch({
        type: 'CHANGE_SELECTION',
        itemId
    });
}

store.subscribe(() => {
    const allItems = store.getState().items;
    ReactDom.render(
        <Fragment><AddListItem /><ListItems items={allItems} /></Fragment>,
        // <Fragment><ListSection items={allItems}/></Fragment>,
        document.getElementById('todoListSection')
    );
})

store.dispatch({type: 'DEFAULT'});
