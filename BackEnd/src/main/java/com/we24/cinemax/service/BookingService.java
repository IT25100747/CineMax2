package com.we24.cinemax.service;

import com.we24.cinemax.model.CheckoutRequest;
import com.we24.cinemax.model.CheckoutResponse;

public interface BookingService {
    CheckoutResponse processBooking(CheckoutRequest request, String userEmail);
}
