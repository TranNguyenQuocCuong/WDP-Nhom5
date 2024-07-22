import React, { useState } from 'react';

const PaymentMethodScreen = ({ history }) => {
    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    const submitHandler = (e) => {
        e.preventDefault();
        // Save payment method to state/store
        history.push('/placeorder');
    };

    return (
        <div>
            <h1>Payment Method</h1>
            <form onSubmit={submitHandler}>
                <div>
                    <input
                        type="radio"
                        id="PayPal"
                        name="paymentMethod"
                        value="PayPal"
                        checked
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label htmlFor="PayPal">PayPal</label>
                </div>
                <div>
                    <input
                        type="radio"
                        id="Stripe"
                        name="paymentMethod"
                        value="Stripe"
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label htmlFor="Stripe">Stripe</label>
                </div>
                <button type="submit">Continue</button>
            </form>
        </div>
    );
};

export default PaymentMethodScreen;
