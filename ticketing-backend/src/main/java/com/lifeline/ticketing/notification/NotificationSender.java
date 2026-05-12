package com.lifeline.ticketing.notification;

public interface NotificationSender {
    void send(String to, String subject, String body);
}