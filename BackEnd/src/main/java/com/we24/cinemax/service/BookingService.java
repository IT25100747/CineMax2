package com.we24.cinemax.service;

import com.we24.cinemax.model.CheckoutRequest;
import com.we24.cinemax.model.CheckoutResponse;
import com.we24.cinemax.model.MyTicketResponse;
import java.util.List;

public interface BookingService {
    CheckoutResponse processBooking(CheckoutRequest request, String userEmail);
    List<MyTicketResponse> getMyTickets(String gmail);
    MyTicketResponse getBookingByReference(String bookingReference);
}
