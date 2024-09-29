import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ClickPayService {
  private readonly apiUrl: string = 'https://api.clickpay.com';
  private readonly apiKey: string = 'SLJNM2HDW2-JJZMKZHNKJ-JZLTGLNDZ6'; // Replace with your ClickPay API Key
  private readonly profileId: string = '45402'; // Replace with your ClickPay profile ID

  // Function to create a payment
  async createPayment(
    orderId: string,
    amount: number,
    // currency: string,
    // customerDetails: any,
  ) {
    const data = {
      profile_id: this.profileId,
      tran_type: 'sale',
      tran_class: 'ecom',
      cart_id: orderId,
      cart_description: `Payment for Order ${orderId}`,
      cart_currency: 'SAR',
      cart_amount: amount,
      callback: 'https://click-pay-533n.vercel.app//clickpay/callback', // Your callback URL
      return: 'https://click-pay-533n.vercel.app//clickpay/return', // URL the user is returned to after payment
    };

    try {
      const response = await axios.post(
        'https://secure.clickpay.com.sa/payment/request',
        data,
        {
          headers: {
            Authorization: `${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data; // Return payment initiation data
    } catch (error) {
      console.log('Error response data:', error.response?.data);
      console.log('Error status:', error.response?.status);
      throw new Error('Payment creation failed');
    }
  }

  async queryPayment(tranRef: string): Promise<any> {
    const url = 'https://secure.clickpay.com.sa/payment/query';

    const headers = {
      Authorization: `${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    const data = {
      profile_id: this.profileId,
      tran_ref: tranRef,
    };

    try {
      const response = await axios.post(url, data, { headers });
      const status = response.data.payment_result.response_status;
      const cart = response.data.cart_id;
      return { cart, status };
    } catch (error) {
      console.error(
        'Error querying payment:',
        error.response?.data || error.message,
      );
      throw error; // Handle error appropriately
    }
  }

  // {"tranRef":"TST2427300206415"}
}
