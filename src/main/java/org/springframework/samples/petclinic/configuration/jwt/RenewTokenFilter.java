package org.springframework.samples.petclinic.configuration.jwt;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.samples.petclinic.configuration.services.UserDetailsServiceImpl;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.Authentication;

public class RenewTokenFilter extends OncePerRequestFilter {

	@Autowired
	private JwtUtils jwtUtils;

	@Autowired
	private UserDetailsServiceImpl userDetailsService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		
        try{
            String jwt = parseJwt(request);
            String newToken = null;
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
                newToken = jwtUtils.generateJwtToken(authentication);

				if (!newToken.equals(jwt)){
					response.addHeader("New-Token", newToken);
				}
            }
        }catch(Exception e){
            logger.info("Anonymous user logged");
        }

		filterChain.doFilter(request, response);
	}

    private String parseJwt(HttpServletRequest request) {
		String headerAuth = request.getHeader("Authorization");

		if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
			return headerAuth.substring(7, headerAuth.length());
		}

		return null;
	}

}
