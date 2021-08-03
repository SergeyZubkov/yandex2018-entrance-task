import React, { useState } from "react";
import "./ParticipantSelect.css";

import { useCombobox, useMultipleSelection } from "downshift";
import { ReactComponent as CrossIcon } from "../icons/cross.svg";

function ParticipantSelect({
  className = "",
  candidates = [],
  limit = candidates.length,
  selectedPeople = [],
  onSelectedItemsChange,
}) {
  const [inputValue, setInputValue] = useState("");

  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems,
  } = useMultipleSelection({
    selectedItems: selectedPeople,
    onSelectedItemsChange,
    // onSelectedItemsChange: (o) => {
    //   console.log(o)
    //   switch (o.type) {
    //     case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace:
    //     case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
    //         onRemoveSelectedItem(inputValue)
    //         break
    //     default:
    //         break
    //   }
    // }
  });

  const getFilteredItems = () => {
    return candidates.filter(
      (user) =>
        !selectedItems.some((sI) => sI.id === user.id) &&
        user.login.toLowerCase().startsWith(inputValue.toLowerCase())
    );
  };

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    selectItem,
  } = useCombobox({
    inputValue,
    defaultHighlightedIndex: 0, // after selection, highlight the first item.
    items: getFilteredItems(),
    onStateChange: ({ inputValue, type, selectedItem }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(inputValue);
          break;
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (selectedItem && selectedItems.length < limit) {
            setInputValue("");
            addSelectedItem(selectedItem);
          }

          selectItem(null);
          break;
        default:
          break;
      }
    },
  });

  return (
    <>
      <div className="participant-select">
        <div>
          <div {...getComboboxProps()}>
            <input
              className={className}
              {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
            />
            <button
              type="button"
              className="participant-select__btn"
              {...getToggleButtonProps()}
              aria-label="toggle menu"
            >
              &#9660;
            </button>
          </div>
        </div>
        <ul {...getMenuProps()}>
          {isOpen &&
            getFilteredItems().map((person, index) => (
              <li
                style={
                  highlightedIndex === index
                    ? { backgroundColor: "#bde4ff" }
                    : {}
                }
                {...getItemProps({
                  key: person.id,
                  index,
                  onClick: (e) => console.log(e),
                })}
              >
                {person.login}
              </li>
            ))}
        </ul>
      </div>
      <ul className="participant-list">
        {selectedItems.map((selectedItem, index) => (
          <li
            className="participant-chip"
            key={selectedItem.id}
            {...getSelectedItemProps({ index })}
          >
            <img
              className="avatar-icon"
              src={selectedItem.avatarUrl.trim()}
              alt="avatar"
            />
            <div className="participant-chip__name">{selectedItem.login}</div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeSelectedItem(selectedItem);
              }}
            >
              <CrossIcon className="participant-chip__cross-icon" />
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default ParticipantSelect;
