package com.kerala.dhms.config;

import com.kerala.dhms.service.SocketIOService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

@Configuration
public class SocketConfig {

    @Bean
    public ServletRegistrationBean<HttpServlet> socketIoServlet(SocketIOService socketIOService) {
        HttpServlet servlet = new HttpServlet() {
            @Override
            protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
                socketIOService.getEngineIoServer().handleRequest(req, resp);
            }
        };

        ServletRegistrationBean<HttpServlet> registration = new ServletRegistrationBean<>(servlet, "/socket.io/*");
        registration.setName("socketIoServlet");
        registration.setOrder(1);
        registration.setAsyncSupported(true);
        return registration;
    }
}
