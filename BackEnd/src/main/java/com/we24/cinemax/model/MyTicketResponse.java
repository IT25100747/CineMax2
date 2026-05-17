package com.we24.cinemax.model;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class MyTicketResponse {
    private String bookingId;
    private String movieName;
    private String moviePoster;
    private String showDate;
    private String showTime;
    private String hallName;
    private String screenType;
    private List<String> seats;
    private Double totalPaid;
    private String qrCodeData;
    private String movieStatus;
}
