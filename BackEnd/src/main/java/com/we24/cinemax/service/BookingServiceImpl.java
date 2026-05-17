package com.we24.cinemax.service;

import com.we24.cinemax.entity.*;
import com.we24.cinemax.model.CheckoutRequest;
import com.we24.cinemax.model.CheckoutResponse;
import com.we24.cinemax.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final SeatReservationRepository seatReservationRepository;
    private final ScreenTimeRepository screenTimeRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public CheckoutResponse processBooking(CheckoutRequest request, String userEmail) {
        // 1. Fetch ScreenTime
        ScreenTime screenTime = screenTimeRepository.findById(request.getScreenTimeId())
                .orElseThrow(() -> new RuntimeException("ScreenTime not found"));

        // 2. Fetch User if authenticated
        User user = null;
        if (userEmail != null && !userEmail.isEmpty()) {
            user = userRepository.findByGmail(userEmail).orElse(null);
        }

        // 3. Verify Seats are not already booked
        List<SeatReservation> existingReservations = seatReservationRepository.findByScreenTimeId(screenTime.getId());
        List<String> bookedSeats = existingReservations.stream()
                .filter(res -> res.getStatus().equals("RESERVED"))
                .map(SeatReservation::getSeatNumber)
                .collect(Collectors.toList());

        for (String requestedSeat : request.getSeatNumbers()) {
            if (bookedSeats.contains(requestedSeat)) {
                throw new RuntimeException("Seat " + requestedSeat + " is already booked.");
            }
        }

        // 4. Create Booking
        String bookingRef = "BKG-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Booking booking = Booking.builder()
                .bookingReference(bookingRef)
                .user(user)
                .guestName(user != null ? user.getFullName() : request.getGuestName())
                .guestEmail(user != null ? user.getGmail() : request.getGuestEmail())
                .guestPhone(user != null ? user.getPhoneNumber() : request.getGuestPhone())
                .screenTime(screenTime)
                .totalAmount(request.getTotalAmount())
                .status("CONFIRMED")
                .build();
        booking = bookingRepository.save(booking);

        // 5. Create Seat Reservations
        for (String seatNum : request.getSeatNumbers()) {
            SeatReservation reservation = SeatReservation.builder()
                    .booking(booking)
                    .screenTime(screenTime)
                    .seatNumber(seatNum)
                    .status("RESERVED")
                    .build();
            seatReservationRepository.save(reservation);
        }

        // 6. Process Payment (Mock)
        Payment payment = Payment.builder()
                .booking(booking)
                .transactionId("TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase())
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "CREDIT_CARD")
                .paidAmount(request.getTotalAmount())
                .paymentStatus("SUCCESS")
                .paymentTimestamp(LocalDateTime.now())
                .build();
        paymentRepository.save(payment);

        // 7. Return Response
        return CheckoutResponse.builder()
                .bookingId(booking.getId())
                .bookingReference(bookingRef)
                .status("SUCCESS")
                .message("Booking completed successfully")
                .build();
    }

    @Override
    public List<com.we24.cinemax.model.MyTicketResponse> getMyTickets(String gmail) {
        List<Booking> bookings = bookingRepository.findByUser_GmailOrderByCreatedAtDesc(gmail);
        return bookings.stream().map(booking -> {
            List<String> seats = seatReservationRepository.findByBookingId(booking.getId())
                    .stream()
                    .filter(res -> "RESERVED".equals(res.getStatus()))
                    .map(SeatReservation::getSeatNumber)
                    .collect(Collectors.toList());

            String showDate = booking.getScreenTime().getShowDate() != null ? booking.getScreenTime().getShowDate().toString() : "";
            String showTime = booking.getScreenTime().getShowTime() != null ? booking.getScreenTime().getShowTime().toString() : "";
            String hallName = "Hall " + booking.getScreenTime().getScreenNumber();
            String screenType = "IMAX"; 

            return com.we24.cinemax.model.MyTicketResponse.builder()
                    .bookingId(booking.getBookingReference())
                    .movieName(booking.getScreenTime().getMovie().getMovieName())
                    .moviePoster(booking.getScreenTime().getMovie().getPosterUrl())
                    .showDate(showDate)
                    .showTime(showTime)
                    .hallName(hallName)
                    .screenType(screenType)
                    .seats(seats)
                    .totalPaid(booking.getTotalAmount())
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    public com.we24.cinemax.model.MyTicketResponse getBookingByReference(String bookingReference) {
        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        List<String> seats = seatReservationRepository.findByBookingId(booking.getId())
                .stream()
                .filter(res -> "RESERVED".equals(res.getStatus()))
                .map(SeatReservation::getSeatNumber)
                .collect(Collectors.toList());

        String showDate = booking.getScreenTime().getShowDate() != null ? booking.getScreenTime().getShowDate().toString() : "";
        String showTime = booking.getScreenTime().getShowTime() != null ? booking.getScreenTime().getShowTime().toString() : "";
        String hallName = "Hall " + booking.getScreenTime().getScreenNumber();
        String screenType = "IMAX";
        String movieName = booking.getScreenTime().getMovie().getMovieName();

        String qrData = String.format("%s | Seats: %s | Booking: %s | %s | %s %s",
                hallName, String.join(", ", seats), booking.getBookingReference(), movieName, showDate, showTime);

        return com.we24.cinemax.model.MyTicketResponse.builder()
                .bookingId(booking.getBookingReference())
                .movieName(movieName)
                .moviePoster(booking.getScreenTime().getMovie().getPosterUrl())
                .showDate(showDate)
                .showTime(showTime)
                .hallName(hallName)
                .screenType(screenType)
                .seats(seats)
                .totalPaid(booking.getTotalAmount())
                .qrCodeData(qrData)
                .build();
    }
}
