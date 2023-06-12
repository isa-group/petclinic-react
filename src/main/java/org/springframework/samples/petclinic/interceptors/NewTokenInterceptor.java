package org.springframework.samples.petclinic.interceptors;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class NewTokenInterceptor implements HandlerInterceptor {

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        // Retrieve the new token from wherever it is stored (e.g., a service, database, etc.)
        String newToken = "prueba"

        // Add the newToken header to the response
        response.addHeader("newToken", newToken);
    }
}
