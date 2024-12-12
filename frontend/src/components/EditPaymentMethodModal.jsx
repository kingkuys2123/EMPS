import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, FormControl } from '@mui/material';
import CustomSnackbar from './CustomSnackbar';
import PaymentMethodService from '../services/PaymentMethodService.jsx';
import { getAuth } from "../utils/AuthContext.jsx";

const EditPaymentMethodModal = ({ open, onClose, userId, paymentMethod, setPaymentMethod }) => {
    const { currentUser } = getAuth();

    const [paymentType, setPaymentType] = useState('');
    const [gcashName, setGcashName] = useState('');
    const [gcashNumber, setGcashNumber] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    const [gcashNameError, setGcashNameError] = useState(false);
    const [gcashNumberError, setGcashNumberError] = useState(false);
    const [cardHolderNameError, setCardHolderNameError] = useState(false);
    const [cardNumberError, setCardNumberError] = useState(false);
    const [expiryDateError, setExpiryDateError] = useState(false);
    const [cvvError, setCvvError] = useState(false);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        if (paymentMethod) {
            setPaymentType(paymentMethod.paymentType);
            setGcashName(paymentMethod.gcashName || '');
            setGcashNumber(paymentMethod.gcashNumber || '');
            setCardHolderName(paymentMethod.creditCardHolderName || '');
            setCardNumber(paymentMethod.creditCardNumber || '');
            setExpiryDate(paymentMethod.creditCardExpiry || '');
            setCvv(paymentMethod.creditCardCVV || '');
        }
    }, [paymentMethod]);

    const handleSubmit = async () => {
        let hasError = false;

        if (paymentType === 'gcash') {
            if (!gcashName) {
                setGcashNameError(true);
                hasError = true;
            } else {
                setGcashNameError(false);
            }
            if (!gcashNumber) {
                setGcashNumberError(true);
                hasError = true;
            } else {
                setGcashNumberError(false);
            }
        }

        if (paymentType === 'credit_card') {
            if (!cardHolderName) {
                setCardHolderNameError(true);
                hasError = true;
            } else {
                setCardHolderNameError(false);
            }
            if (!cardNumber) {
                setCardNumberError(true);
                hasError = true;
            } else {
                setCardNumberError(false);
            }
            if (!expiryDate) {
                setExpiryDateError(true);
                hasError = true;
            } else {
                setExpiryDateError(false);
            }
            if (!cvv) {
                setCvvError(true);
                hasError = true;
            } else {
                setCvvError(false);
            }
        }

        if (hasError) {
            setSnackbarMessage('Please fill in all fields.');
            setOpenSnackbar(true);
            return;
        }

        const updatedPaymentMethod = paymentType === 'gcash'
            ? { paymentType: 'gcash', gcashName, gcashNumber }
            : { paymentType: 'credit_card', creditCardHolderName: cardHolderName, creditCardNumber: cardNumber, creditCardExpiry: expiryDate, creditCardCVV: cvv };

        try {
            await PaymentMethodService.updateUserPaymentMethod(currentUser.userID, updatedPaymentMethod);

            const refreshedPaymentMethod = await PaymentMethodService.getUserPaymentMethod(userId);
            setPaymentMethod(refreshedPaymentMethod);

            setSnackbarMessage('Payment method updated successfully.');
            setOpenSnackbar(true);

            onClose();
        } catch (e) {
            setSnackbarMessage(e.message);
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    if (!paymentMethod) {
        return null; // or a loading spinner, or some other placeholder
    }

    return (
        <div>
            <Modal open={open} onClose={onClose}>
                <div>
                    <Box sx={{ width: 400, padding: 4, backgroundColor: 'white', margin: 'auto', marginTop: '10%', borderRadius: 5 }}>
                        <Typography variant="h6" gutterBottom>
                            Edit Payment Method
                        </Typography>
                        {paymentType === 'gcash' && (
                            <>
                                <TextField
                                    label="GCash Name"
                                    fullWidth
                                    margin="normal"
                                    value={gcashName}
                                    onChange={(e) => setGcashName(e.target.value)}
                                    error={gcashNameError}
                                />
                                <TextField
                                    label="GCash Number"
                                    fullWidth
                                    margin="normal"
                                    value={gcashNumber}
                                    onChange={(e) => setGcashNumber(e.target.value)}
                                    error={gcashNumberError}
                                />
                            </>
                        )}
                        {paymentType === 'credit_card' && (
                            <>
                                <TextField
                                    label="Card Holder Name"
                                    fullWidth
                                    margin="normal"
                                    value={cardHolderName}
                                    onChange={(e) => setCardHolderName(e.target.value)}
                                    error={cardHolderNameError}
                                />
                                <TextField
                                    label="Card Number"
                                    fullWidth
                                    margin="normal"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    error={cardNumberError}
                                />
                                <TextField
                                    label="Expiry Date"
                                    fullWidth
                                    margin="normal"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    error={expiryDateError}
                                />
                                <TextField
                                    label="CVV"
                                    fullWidth
                                    margin="normal"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    error={cvvError}
                                />
                            </>
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                            <Button onClick={onClose} sx={{ marginRight: 1, backgroundColor: '#7F7F7F', color: 'white', '&:hover': { backgroundColor: '#6b6b6b' } }}>Cancel</Button>
                            <Button variant="contained" onClick={handleSubmit} sx={{ backgroundColor: '#C63F47', borderRadius: 0, '&:hover': { backgroundColor: '#a32d34' } }}>Save</Button>
                        </Box>
                    </Box>
                </div>
            </Modal>
            <CustomSnackbar open={openSnackbar} message={snackbarMessage} onClose={handleCloseSnackbar} />
        </div>
    );
};

export default EditPaymentMethodModal;