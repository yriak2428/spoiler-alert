import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

//comment out whichever is needed depending on which style to pick
//kurt's style
import { componentStyles } from "../assets/styles/add.item.style";
//Valerie's style
// import { buttonItemStyles } from "../assets/styles/home.style";


const AddItem = () => {
    // const styles = buttonItemStyles();
    const styles = componentStyles();

    const [isModalVisible, setVisible] = useState(false);
    const [newItem, setNewItem] = useState({
        itemName: "",
        category: "Fruits and Vegetables",
        date: ""
    });

    const [newDate, setDate] = useState(new Date());
    const [dateText, setDateText] = useState("Select Date")
    const [showPicker, setPicker] = useState(false);

    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setPicker(false);

        if (selectedDate) {
                setDate(selectedDate);
                let fDate = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
                setDateText(fDate);
        }
    }
    
    const foodCategories = ["Fruits and Vegetables", "Meat and Dairy", "Carbohydrates", "Others"];
    const [itemList, setItemList] = useState([]);


    const handleSubmit = () => {
        // if (newItem.itemName.trim() === "") return;
        // Missing adding item to the item list
        handleCancel();
    }

    const handleCancel = () => {
        setNewItem({
            itemName: "",
            category: "Fruits and Vegetables",
            date: ""
        });
        setDate(new Date())    
        setDateText("Select Date")
        setVisible(false);
    }
        
    return (
        <View>
            <TouchableOpacity style={styles.modalButton} onPress={() => setVisible(true)}>
                <Text style={styles.buttonText}>+ Add Item</Text>
            </TouchableOpacity>

            <Modal
                id="modal add item"
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.instructionText}>Enter the item name:</Text>
                        <View style={styles.textInput}>
                            <TextInput
                                placeholder=" E.g. Bread"
                                value={newItem.itemName}
                                onChangeText={(e) => setNewItem({...newItem, itemName: e})} 
                            />

                        </View>


                        <Text style={styles.instructionText}>Choose the food category:</Text>
                        <View style={styles.textInput}>
                            <Picker
                                selectedValue={newItem.category}
                                onValueChange={(e) => setNewItem({...newItem, category: e})}
                            >
                                {foodCategories.map((c) => (
                                    <Picker.Item key={c} label={c} value={c}/>
                                ))}
                            </Picker>
                        </View>    

                        <Text style={styles.instructionText}>Select the Date</Text>
                        <View style={[styles.textInput, styles.datePicker]}>
                            <Text> {dateText}</Text>
                            <TouchableOpacity onPress={() => setPicker(true)}>
                                <Ionicons name="calendar-outline"/>
                            </TouchableOpacity>

                            {
                                showPicker && (
                                    <DateTimePicker 
                                        mode={'date'}
                                        display={"calendar"}
                                        value={newDate || new Date()}
                                        onChange={handleDateChange}
                                    />
                                )
                            }
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={() => handleCancel()}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    )
}

export default AddItem