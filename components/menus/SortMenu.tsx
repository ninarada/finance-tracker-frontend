import React from "react";
import {
  findNodeHandle,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

export type SortOption = "recent" | "date" | "total";

type Props = {
  sortOption: SortOption;
  sortDirection: "asc" | "desc";
  setSortOption: (option: SortOption) => void;
  setSortDirection: (direction: "asc" | "desc") => void;
};

const SortButton: React.FC<Props> = ({
  sortOption,
  sortDirection,
  setSortOption,
  setSortDirection,
}) => {
  const [sortMenuVisible, setSortMenuVisible] = React.useState(false);
  const [buttonPosition, setButtonPosition] = React.useState({ x: 0, y: 0, width: 0, height: 0 });

  const buttonRef = React.useRef<React.ComponentRef<typeof TouchableOpacity>>(null);

  const openMenu = () => {
    if (buttonRef.current) {
      const handle = findNodeHandle(buttonRef.current);
      if (handle) {
        UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
          setButtonPosition({ x: pageX, y: pageY, width, height });
          setSortMenuVisible(true);
        });
      }
    }
  };

  const sortOptions: {
    label: string;
    option: SortOption;
    direction: "asc" | "desc";
  }[] = [
    { label: "Recent (Newest First)", option: "recent", direction: "desc" },
    { label: "Recent (Oldest First)", option: "recent", direction: "asc" },
    { label: "Date (Newest First)", option: "date", direction: "desc" },
    { label: "Date (Oldest First)", option: "date", direction: "asc" },
    { label: "Total (High to Low)", option: "total", direction: "desc" },
    { label: "Total (Low to High)", option: "total", direction: "asc" },
  ];

  return (
    <>
      <TouchableOpacity
        ref={buttonRef}
        className="bg-primary-200 px-4 py-2 rounded-full w-32 mb-2"
        onPress={openMenu}
      >
        <Text className="text-white text-center font-semibold">Sort</Text>
      </TouchableOpacity>

      <Modal
        transparent
        animationType="fade"
        visible={sortMenuVisible}
        onRequestClose={() => setSortMenuVisible(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }}
          onPress={() => setSortMenuVisible(false)}
        >
          <View
            style={{
              position: "absolute",
              top: buttonPosition.y + buttonPosition.height + 4,
              left: buttonPosition.x,
            }}
            className="bg-white rounded-xl p-2 w-[220px] shadow-lg"
          >
            {sortOptions.map(({ label, option, direction }) => {
              const isActive = sortOption === option && sortDirection === direction;
              return (
                <TouchableOpacity
                  key={label}
                  onPress={() => {
                    setSortOption(option);
                    setSortDirection(direction);
                    setSortMenuVisible(false);
                  }}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    borderRadius: 8,
                    backgroundColor: isActive ? "#e0e7ff" : "transparent",
                  }}
                >
                  <Text
                    style={{
                      color: isActive ? "#4f46e5" : "#111827",
                      fontWeight: isActive ? "600" : "400",
                    }}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default SortButton;
