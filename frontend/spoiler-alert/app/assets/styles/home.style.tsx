import { StyleSheet } from "react-native";

export const buttonItemStyles = () => {
    const styles = StyleSheet.create({
        modalContainer:{    
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
        },
        modalContent: {
            width: 300,
            backgroundColor: "whitesmoke",
            borderRadius: 5,
            borderColor: '#83858f',
            borderWidth: 2,
            paddingHorizontal: 10,
            paddingVertical: 5
        },
        instructionText:{
            marginTop: 15,
            marginBottom: 5,
            fontSize: 16,
            fontWeight: "bold"
        },
        textInput:{
            minHeight: 40,
            borderWidth: 1,
            borderColor: "black",
            borderRadius: 5,
            justifyContent: "center",
            overflow: "hidden",
        }, 
        datePicker:{
            paddingRight: 15,
            paddingLeft: 5,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
        },
        modalButton: {
            borderWidth: 1,
            borderColor: "#dins1e0f2",
            padding: 5, 
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
            alignItems: "center"
        },
        buttonContainer:{
            flexDirection: "row",
            justifyContent: "center",
            gap: 12,
            margin: 15
        },
        button:{
            borderRadius: 10,
            width: 70,
            borderColor: "black",
            alignItems: "center",
            borderWidth: 1
        },
        buttonText:{
            alignItems: "center",
            padding: 5,
            fontWeight: "bold",
            fontSize: 16
        },
        // Scan Item Styles
        cameraView:{
            flex: 1
        },
        captureButton:{
            width: 80,
            height: 80,
            justifyContent: 'center',
            alignSelf: 'center',
            backgroundColor: 'transparent',
        },
        topButtons:{
            position: 'absolute',
            top: 50,
            right: 20,
            width: 36,
            height: 36,
            gap: 10
        },
        topButton:{
            borderRadius: 18,
            backgroundColor: 'rgba(255, 255, 255, 1.0)',
            justifyContent: 'center',
            alignItems: 'center',
            width: 40,
            height: 40,
        },
    });
    return styles;
}

export const displayDateStyles = () => {
    const styles = StyleSheet.create({
        dateContainer:{
            alignItems: "flex-start",
        },
        date:{
            fontSize: 16,
        }
    });
    return styles;
}

export const homePageStyles = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8F9FA', 
      paddingTop: 60, 
      paddingHorizontal: 16,
    },
    welcomeMsg: {
      marginBottom: 4,
    },
    welcomeMsgText: {
      fontSize: 24,
      fontWeight: '700',
      color: '#1A1A1A',
    },
    dateContainer: {
      marginBottom: 24,
    },

    // Wrapper for all items
    itemWrapper: {
      gap: 20,
    },

    // For each category
    itemContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    itemHeader: {
      fontSize: 16,
      fontWeight: '600',
      color: '#4A4A4A',
      marginBottom: 12,
    },
    itemContentContainer: {
      flexDirection: 'row',
    },
    itemText:{
      width: 200, 
      margin: 1, 
      justifyContent: 'center',
      padding: 10, 
      gap: 5
    },
    expiryItemWrapper: {
      borderLeftWidth: 4,
      borderLeftColor: '#f72f2f', 
      paddingLeft: 8,
    },
    nearExpiryItemWrapper: {
      borderLeftWidth: 4,
      borderLeftColor: '#efcc33', 
      paddingLeft: 8,
    },
    safeItemWrapper: {
      borderLeftWidth: 4,
      borderLeftColor: '#2adf75', 
      paddingLeft: 8,
    },
    bottomButtonWrapper: {
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      gap: 10,
      paddingTop: 20
    },
    bottomButton: {
      width: '100%', 
    },
  });

  return styles;
}