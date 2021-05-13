/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe(
  'pk_test_51Ilzd4SIiZ7mNkQYVwWWTPl1ySePJPN9gc9c79abWi13YwSeRpDX3qwyYIDUyNrcnktgYHDFIHPEYPxzAe6nSHAC00a5j5pNh4'
);
export const bookTour = async (tourId) => {
  try {
    //1)Get checkout session from end Point
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);
    //2)Create checkout form and Charge the credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
