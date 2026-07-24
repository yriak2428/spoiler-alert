import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { componentStyles } from "../assets/styles/add.item.style";
import { Button } from "./ui";
import { colors, statusColors } from "../constants/theme";
import { addFoodItem } from "./foodData"

export type AddItemHandle = {
    open: () => void;
};

type Props = {
    hideTrigger?: boolean;
};

const AddItem = forwardRef<AddItemHandle, Props>(({ hideTrigger }, ref) => {
    const styles = componentStyles();

    const [isModalVisible, setVisible] = useState(false);
    const [newItem, setNewItem] = useState({
        itemName: "",
        category: "Fruits and Vegetables",
        date: ""
    });
    const [quantity, setQuantity] = useState("1");
    const [quantityError, setQuantityError] = useState(false);

    useImperativeHandle(ref, () => ({
        open: () => setVisible(true),
    }));

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

    const handleSubmit = async () => {
        if (newItem.itemName.trim() === "") return;

        const parsedQuantity = parseInt(quantity, 10);
        if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
            setQuantityError(true);
            return;
        }
        setQuantityError(false);

        try {
            await addFoodItem({
                name: newItem.itemName,
                category: newItem.category,
                date: newDate,
                quantity: parsedQuantity,
            });
        } catch (e) {
            console.error("Failed to add item:", e);
        }

        handleCancel();
    }

    const handleCancel = () => {
        setNewItem({
            itemName: "",
            category: "Fruits and Vegetables",
            date: ""
        });
        setQuantity("1");
        setQuantityError(false);
        setDate(new Date())
        setDateText("Select Date")
        setVisible(false);
    }

    return (
        <View>
            {!hideTrigger && <Button title="+ Add Item" onPress={() => setVisible(true)} />}

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
                                placeholder="E.g. Bread"
                                placeholderTextColor={colors.textTertiary}
                                value={newItem.itemName}
                                onChangeText={(e) => setNewItem({...newItem, itemName: e})}
                            />

                        </View>

                        <Text style={styles.instructionText}>Quantity:</Text>
                        <View style={styles.textInput}>
                            <TextInput
                                placeholder="1"
                                placeholderTextColor={colors.textTertiary}
                                value={quantity}
                                onChangeText={(text) => {
                                    setQuantity(text.replace(/[^0-9]/g, ""));
                                    if (quantityError) setQuantityError(false);
                                }}
                                keyboardType="number-pad"
                            />
                        </View>
                        {quantityError && (
                            <Text style={{ color: statusColors.expired.fg, fontSize: 12, marginTop: -8, marginBottom: 8 }}>
                                Must enter a quantity larger than 0
                            </Text>
                        )}

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
                            <Text>{dateText}</Text>
                            <TouchableOpacity onPress={() => setPicker(true)}>
                                <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
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
                            <Button title="Cancel" variant="secondary" style={styles.button} onPress={handleCancel} />
                            <Button title="Submit" variant="primary" style={styles.button} onPress={handleSubmit} />
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    )
});

AddItem.displayName = "AddItem";

export default AddItem