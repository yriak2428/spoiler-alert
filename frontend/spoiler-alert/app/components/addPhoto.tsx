import { Ionicons } from "@expo/vector-icons";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from "react";
import { Button, Modal, Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import { buttonItemStyles } from "../assets/styles/home.style";

const AddPhoto = () => {
    const styles = buttonItemStyles();

    // Setting up Camera
    const [isCameraVisible, setVisible] = useState(false);
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    // Take Photo
    const cameraRef = useRef<CameraView>(null);
    const [photo, setPhoto] = useState<string | null>(null);
    const [isPreviewVisible, setPreviewVisible] = useState(false);

    const handlePhoto = async () => {
        if (!cameraRef.current) return;

        const result = await cameraRef.current.takePictureAsync({ quality: 0.8 });

        if (result?.uri){
            setPhoto(result.uri);
            setPreviewVisible(true);
            setVisible(false);
        }
    }

    const handleRetake = () => {
        setPhoto(null);
        setPreviewVisible(false);
        setVisible(true);
    }

    // Barcode Scanning
    const [scanned, setScanned] = useState(false);
    const [scannedProduct, setScannedProduct] = useState<any>(null);

    const lookupProduct = async (barcode: string) => {
        try {
            const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
            const json = await res.json();

            if (json.status === 1) {
                const product = json.product;
                setScannedProduct({
                    barcode,
                    name: product.product_name || "Unknown item",
                    category: product.categories || "",
                    imageUrl: product.image_url || null,
                });
                // TODO: insert into Supabase products table here
            } else {
                setScannedProduct({ barcode, name: "Not found", category: "", imageUrl: null });
            }
        } catch (err) {
            console.error("Open Food Facts lookup failed:", err);
        }
    }

    const handleBarcodeScanned = ({ data }: { data: string }) => {
        if (scanned) return;
        setScanned(true);
        lookupProduct(data);
    }

    const resetScanner = () => {
        setScanned(false);
        setScannedProduct(null);
    }
        
    return (
        <View>
            <TouchableOpacity style={styles.modalButton}  onPress={() => setVisible(true)}>
                <Text style={styles.buttonText}>+ Scan Item</Text>
            </TouchableOpacity>

            <Modal
                id="modal scan item"
                visible={isCameraVisible}
                animationType="slide"
            >
                <View style={{ flex: 1}}>
                    {!permission?.granted ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{fontWeight: "bold"}}>Camera permission is needed</Text>
                            
                            <Button onPress={requestPermission} title="Grant Permission" />
                            <Button onPress={() => setVisible(false)} title="Cancel" />
                        </View>
                    ) : (
                        <View style={{flex: 1}}>
                            {/* Camera */}
                           <CameraView
                                style={styles.cameraView}
                                facing={facing}
                                ref={cameraRef}
                                barcodeScannerSettings={{
                                    barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
                                }}
                                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                            />
                            {scannedProduct && (
                                <View style={{ position: 'absolute', bottom: 100, left: 20, right: 20, backgroundColor: 'white', padding: 12, borderRadius: 10 }}>
                                    <Text style={{ fontWeight: 'bold' }}>{scannedProduct.name}</Text>
                                    <Text>{scannedProduct.category}</Text>
                                    <TouchableOpacity onPress={resetScanner} style={{ marginTop: 8 }}>
                                        <Text style={{ color: 'blue' }}>Scan Again</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                                <View style={styles.topButtons}>
                                     {/* Close Button */}
                                    <TouchableOpacity style={styles.topButton} onPress={() => setVisible(false)}>
                                        <View style={styles.buttonText}>
                                            <Ionicons name="close-sharp" color="#000000" size={20} />
                                        </View>
                                    </TouchableOpacity>

                                    {/* Flip Button */}
                                    <TouchableOpacity style={styles.topButton} onPress={toggleCameraFacing}>
                                        <View style={styles.buttonText}>
                                            <Ionicons name="camera-reverse-outline" color="#000" size={24} />
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                {/* Capture Button */}
                                <TouchableOpacity style={styles.captureButton} onPress={handlePhoto}>
                                    <View style={styles.buttonText}>
                                        <Ionicons name="camera-outline" color="#000" size={30} />
                                    </View>
                                </TouchableOpacity>
                        </View>
                    )}
                </View>
            </Modal>
            
            <Modal
                id="modal scan preview"
                visible={isPreviewVisible}
                animationType="slide"
            >
                <View style={{ flex: 1, backgroundColor: '#000000' }}>
                    
                    {photo && (
                        <Image
                            source={{ uri: photo }}
                            style={{ flex: 1, width: "100%"}}
                            resizeMode="contain"
                        />
                    )}

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 30 }}>
                        <TouchableOpacity onPress={handleRetake}>
                            <Text style={{ color: '#fff', fontSize: 16 }}>Retake</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setPreviewVisible(false)}>
                            <Text style={{ color: '#fff', fontSize: 16 }}>Confirm</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>

        </View>
    );

}

export default AddPhoto