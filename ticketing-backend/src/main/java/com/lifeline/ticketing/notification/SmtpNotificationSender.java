package com.lifeline.ticketing.notification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SmtpNotificationSender implements NotificationSender {

    private final JavaMailSender mailSender;

    @Value("${notification.from-email}")
    private String from;

    @Override
    public void send(String to, String subject, String body) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo(to);
        msg.setSubject(subject);
        msg.setText(body);
        try {
            mailSender.send(msg);
            log.info("Email sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}", to, e);
        }
    }
}