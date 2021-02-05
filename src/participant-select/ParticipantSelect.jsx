import React, { useState } from 'react'
import './ParticipantSelect.css'

import { useCombobox, useMultipleSelection } from 'downshift'



function ParticipantSelect({
    candidates = [], 
    limit = candidates.lenght, 
    selectedPeople = [],
    onSelect,
    onRemoveSelectedItem
  }) {
    const [inputValue, setInputValue] = useState('')

    const {
        getSelectedItemProps,
        getDropdownProps,
        addSelectedItem,
        removeSelectedItem,
        selectedItems
    } = useMultipleSelection({
      selectedItems: selectedPeople,
      onSelectedItemsChange: (o) => {
        console.log(o)
        switch (o.type) {
          case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
              onRemoveSelectedItem(inputValue)
              break
          default:
              break
        }
      }
    })

    const getFilteredItems = () => {
        return candidates.filter(
            user =>
                selectedItems.indexOf(user) < 0 &&
                user.login.toLowerCase().startsWith(inputValue.toLowerCase()),
        )
      }

    const {
        isOpen,
        getToggleButtonProps,
        getLabelProps,
        getMenuProps,
        getInputProps,
        getComboboxProps,
        highlightedIndex,
        getItemProps,
    } = useCombobox({
        inputValue,
        defaultHighlightedIndex: 0, // after selection, highlight the first item.
        items: getFilteredItems(),
        onStateChange: ({ inputValue, type, selectedItem }) => {
            switch (type) {
                case useCombobox.stateChangeTypes.InputChange:
                    setInputValue(inputValue)
                    break
                case useCombobox.stateChangeTypes.InputKeyDownEnter:
                case useCombobox.stateChangeTypes.ItemClick:
                case useCombobox.stateChangeTypes.InputBlur:
                    if (
                        selectedItem
                        && selectedItems.length < limit
                      ) {
                        setInputValue('')
                        onSelect(selectedItem)
                    }
                    break
                default:
                    break
            }
        }
    })

    return (
      <>
      <div className='field participant-select'>
        <label {...getLabelProps()}>Участники ({selectedItems.length}/{limit})</label>
        <div>
          <div {...getComboboxProps()}>
            <input
              {...getInputProps(
                getDropdownProps({ preventKeyAction: isOpen }),
              )}
            />
            <button
              type="button"
              className='participant-select__btn'
              {...getToggleButtonProps()}
              aria-label="toggle menu"
            >
              &#9660;
            </button>
          </div>
        </div>
        <ul {...getMenuProps()}>
          {isOpen &&
            getFilteredItems().map(u => u.login).map((login, index) => (
              <li
                style={
                  highlightedIndex === index
                    ? { backgroundColor: '#bde4ff' }
                    : {}
                }
                key={`${login}${index}`}
                {...getItemProps({ login, index })}
              >
                {login}
              </li>
            ))}
        </ul>
      </div>
      <ul className="participant-list">
          {selectedItems.map(
              (selectedItem, index) => (
                  <li 
                    className='participant-chip'
                    key={selectedItem.id}
                    {...getSelectedItemProps({index})}
                  >
                      <img 
                        className="avatar-icon"
                        src={selectedItem.avatarUrl.trim()} 
                        alt="avatar"
                      />
                      <div className="participant-chip__name">
                        {selectedItem.login}
                      </div>
                      <button 
                        onClick={e => {
                          onRemoveSelectedItem(selectedItem.id)
                        }}
                      >
                          <img src="icons/cross.svg" alt="cross"/>
                      </button>
                  </li>
              )
          )}
      </ul>
      </>
    )
}

export default ParticipantSelect