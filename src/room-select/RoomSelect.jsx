import React from "react";
import "./RoomSelect.css";
import { useSelect } from "downshift";

function RoomSelect({ className = "", selectedRoom, rooms = [], onSelect }) {
  const {
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
    selectedItem,
    isOpen,
    highlightedIndex,
  } = useSelect({
    selectedItem: selectedRoom,
    items: rooms,
    onSelectedItemChange: ({ selectedItem }) => onSelect(selectedItem),
  });

  const renderItem = (item) => {
    const { title, floor } = item;

    return <>{`${title}${"\u00A0"}${"\u00B7"}${"\u00A0"}${floor} Этаж`}</>;
  };

  return (
    <div className="room-select">
      <div>
        <button
          type="button"
          className={className + " room-select__btn"}
          {...getToggleButtonProps()}
          aria-label="toggle menu"
        >
          {!selectedItem ? "выберите комнату" : renderItem(selectedItem)}
        </button>
        <i className="icon-arrow">&#9660;</i>
      </div>
      <ul {...getMenuProps()}>
        {isOpen &&
          rooms.map((item, index) => (
            <li
              key={`${item.id}${index}`}
              {...getItemProps({ item, index })}
              style={
                highlightedIndex === index ? { backgroundColor: "#bde4ff" } : {}
              }
            >
              {renderItem(item)}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default RoomSelect;
