//kurt's code to style addItem.tsx

import { StyleSheet } from "react-native";

export const componentStyles = () => {
    const styles = StyleSheet.create({
        modalButton: {
            backgroundColor: "red",
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
        },
        buttonText: {
            color: "white",
            fontWeight: "bold",
            fontSize: 16,
        },
        modalContainer:{    
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
        },
        modalContent: {
            backgroundColor: "white",
            width: "85%",
            borderRadius: 16,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },
        instructionText: {
            fontSize: 14,
            fontWeight: "600",
            color: "#333",
            marginTop: 15,
            marginBottom: 6,
        },
        textInput: {
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            paddingHorizontal: 10,
            height: 45,
            justifyContent: "center",
        },
        datePicker: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        buttonContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 24,
        },
        button: {
            flex: 1,
            backgroundColor: "red",
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: "center",
            marginHorizontal: 6,
        },
    });
    return styles;
}