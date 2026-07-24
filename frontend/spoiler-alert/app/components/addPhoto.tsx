import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { ActivityIndicator, Modal, Text, TouchableOpacity, View, Image, StyleSheet } from "react-native";
import { ApiError, identifyProduct, IdentifiedProduct } from "../lib/api";
import ScannedItemCard from "./scannedItemCard";
import { Button, IconButton } from "./ui";
import { colors, radius, shadow, spacing, type } from "../constants/theme";

export type AddPhotoHandle = {
    open: () => void;
};

type Props = {
    hideTrigger?: boolean;
};

const AddPhoto = forwardRef<AddPhotoHandle, Props>(({ hideTrigger }, ref) => {
    // Setting up Camera
    const [isCameraVisible, setVisible] = useState(false);
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();

    useImperativeHandle(ref, () => ({
        open: () => setVisible(true),
    }));

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
    const [looking, setLooking] = useState(false);
    const [lookupError, setLookupError] = useState<string | null>(null);
    const [scannedProduct, setScannedProduct] = useState<IdentifiedProduct | null>(null);
    const [isCardVisible, setCardVisible] = useState(false);

    const lookupProduct = async (barcode: string) => {
        setLooking(true);
        setLookupError(null);
        try {
            const product = await identifyProduct(barcode);
            setScannedProduct(product);
            setCardVisible(true);
            setVisible(false);
        } catch (err) {
            console.error("Product identification failed:", err);
            if (err instanceof ApiError && err.status === 404) {
                setLookupError(`No Open Food Facts match for barcode ${barcode}.`);
            } else if (err instanceof ApiError) {
                setLookupError(`Lookup failed (${err.status}): ${err.message}`);
            } else {
                setLookupError(`Couldn't reach the server: ${err instanceof Error ? err.message : String(err)}`);
            }
        } finally {
            setLooking(false);
        }
    }

    const handleBarcodeScanned = ({ data }: { data: string }) => {
        if (scanned || looking) return;
        setScanned(true);
        lookupProduct(data);
    }

    const resetScanner = () => {
        setScanned(false);
        setLookupError(null);
    }

    const handleCardClose = () => {
        setCardVisible(false);
        setScannedProduct(null);
        resetScanner();
    }

    const handleCardSaved = () => {
        setCardVisible(false);
        setScannedProduct(null);
        resetScanner();
    }

    return (
        <View>
            {!hideTrigger && <Button title="+ Scan Item" onPress={() => setVisible(true)} />}

            <Modal
                id="modal scan item"
                visible={isCameraVisible}
                animationType="slide"
            >
                <View style={styles.flex}>
                    {!permission?.granted ? (
                        <View style={styles.permissionContainer}>
                            <Text style={styles.permissionText}>Camera permission is needed</Text>

                            <Button title="Grant Permission" onPress={requestPermission} style={styles.permissionButton} />
                            <Button title="Cancel" variant="ghost" onPress={() => setVisible(false)} />
                        </View>
                    ) : (
                        <View style={styles.flex}>
                            {/* Camera */}
                           <CameraView
                                style={styles.cameraView}
                                facing={facing}
                                ref={cameraRef}
                                autofocus="on"
                                barcodeScannerSettings={{
                                    barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "code128", "qr"],
                                }}
                                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                            />
                            {looking && (
                                <View style={styles.lookupBanner}>
                                    <ActivityIndicator color={colors.primary} />
                                    <Text style={styles.lookupBannerText}>Looking up product...</Text>
                                </View>
                            )}
                            {lookupError && (
                                <View style={styles.lookupBanner}>
                                    <Text style={styles.lookupErrorText}>{lookupError}</Text>
                                    <TouchableOpacity onPress={resetScanner} style={styles.scanAgainButton}>
                                        <Text style={styles.scanAgainText}>Scan Again</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            <View style={styles.topButtons}>
                                <IconButton name="close" variant="light" onPress={() => setVisible(false)} />
                                <IconButton name="camera-reverse-outline" variant="light" onPress={toggleCameraFacing} />
                            </View>

                            <TouchableOpacity style={styles.captureButton} onPress={handlePhoto}>
                                <View style={styles.captureButtonInner} />
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
                <View style={styles.previewContainer}>
                    {photo && (
                        <Image
                            source={{ uri: photo }}
                            style={styles.previewImage}
                            resizeMode="contain"
                        />
                    )}

                    <View style={styles.previewActions}>
                        <Button title="Retake" variant="secondary" onPress={handleRetake} style={styles.previewButton} />
                        <Button title="Confirm" variant="primary" onPress={() => setPreviewVisible(false)} style={styles.previewButton} />
                    </View>
                </View>
            </Modal>

            <ScannedItemCard
                visible={isCardVisible}
                product={scannedProduct}
                onClose={handleCardClose}
                onSaved={handleCardSaved}
            />

        </View>
    );

});

AddPhoto.displayName = "AddPhoto";

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xxl,
        gap: spacing.md,
        backgroundColor: colors.background,
    },
    permissionText: {
        ...type.headline,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    permissionButton: {
        width: '100%',
    },
    cameraView: {
        flex: 1,
    },
    lookupBanner: {
        position: 'absolute',
        bottom: 110,
        left: spacing.xl,
        right: spacing.xl,
        backgroundColor: colors.surface,
        padding: spacing.lg,
        borderRadius: radius.lg,
        alignItems: 'center',
        ...shadow.lg,
    },
    lookupBannerText: {
        ...type.subhead,
        color: colors.textSecondary,
        marginTop: spacing.sm,
    },
    lookupErrorText: {
        ...type.subhead,
        color: colors.danger,
        textAlign: 'center',
    },
    scanAgainButton: {
        marginTop: spacing.sm,
    },
    scanAgainText: {
        ...type.bodyMedium,
        color: colors.primary,
    },
    topButtons: {
        position: 'absolute',
        top: 56,
        right: spacing.xl,
        gap: spacing.md,
    },
    captureButton: {
        width: 76,
        height: 76,
        borderRadius: 38,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'absolute',
        bottom: 40,
        backgroundColor: 'rgba(255, 251, 245, 0.25)',
        borderWidth: 3,
        borderColor: 'rgba(255, 251, 245, 0.9)',
    },
    captureButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.textInverse,
    },
    previewContainer: {
        flex: 1,
        backgroundColor: '#000000',
    },
    previewImage: {
        flex: 1,
        width: '100%',
    },
    previewActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: spacing.xxl,
        gap: spacing.md,
    },
    previewButton: {
        flex: 1,
    },
});

export default AddPhoto
