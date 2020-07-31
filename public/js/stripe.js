import Axios from 'axios';
import { showAlert } from './alert';

/*eslint-disable*/
import axios from 'axios';
const stripe = Stripe(
  'pk_test_51HAXDwDYrRXvZ8mLMTXsRZjvSUnPlbI0G8VTKk68vsqDxdRF6CtquiGFBvgLpyyRzWehotoibdWsehRa2tiq4dqE00zKZqX1NU'
);

export const bookTour = async (tourId) => {
  try {
    //Get checkout session from endpoint
    const session = await axios.get(
      `http://localhost:3000/api/v1/booking/checkout-session/${tourId}`
    );
    console.log(session);
    //Create a checkout form + process (charge credit card)
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    console.log(err);
    showAlert('error', err);
  }
};
