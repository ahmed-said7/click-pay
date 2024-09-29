import { Injectable } from '@nestjs/common';
import axios from 'axios';
// SHJNM2HDT9-JJZMHKKJ9T-TB6HHNDNDB
// SLJNM2HDW2-JJZMKZHNKJ-JZLTGLNDZ6
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
      callback: 'https://click-pay-frax.vercel.app/clickpay/callback', // Your callback URL
      return: 'https://click-pay-frax.vercel.app/clickpay/return', // URL the user is returned to after payment
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

  // Function to handle ClickPay callback after payment
  async handleCallback(paymentData: any) {
    const { status, cart_id, tran_ref } = paymentData;

    if (status === 'success') {
      // Handle successful payment (e.g., update order status)
      // Call to your order service or database
      await this.updateOrderStatus(cart_id, 'paid', tran_ref);
    } else {
      // Handle payment failure
      await this.updateOrderStatus(cart_id, 'failed', tran_ref);
    }

    return { status: 'ok' };
  }

  // Function to verify a payment by transaction reference
  async verifyPayment(transactionId: string) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/payment/${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );
      return response.data; // Return payment verification data
    } catch (error) {
      console.error(
        'Error verifying payment',
        error.response?.data || error.message,
      );
      throw new Error('Payment verification failed');
    }
  }

  // Optional: Function to process a refund
  async processRefund(transactionId: string, amount: number) {
    const data = {
      profile_id: this.profileId,
      tran_type: 'refund',
      tran_class: 'ecom',
      cart_id: transactionId,
      cart_amount: amount,
    };

    try {
      const response = await axios.post(`${this.apiUrl}/refund`, data, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data; // Return refund process data
    } catch (error) {
      console.error(
        'Error processing refund',
        error.response?.data || error.message,
      );
      throw new Error('Refund failed');
    }
  }

  // Helper function to update order status
  private async updateOrderStatus(
    orderId: string,
    status: string,
    transactionId: string,
  ) {
    // Implement your order service or database update logic here
    console.log(
      `Order ${orderId} has been updated to status: ${status}, Transaction ID: ${transactionId}`,
    );
    // For example, save this to your database
  }
}
