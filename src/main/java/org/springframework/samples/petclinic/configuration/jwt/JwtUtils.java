package org.springframework.samples.petclinic.configuration.jwt;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.samples.petclinic.configuration.services.UserDetailsImpl;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${petclinic.app.jwtSecret}")
    private String jwtSecret;

    @Value("${petclinic.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    public String generateJwtToken(Authentication authentication) {

        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Map<String, Object> claims = new HashMap<>();
        claims.put("authorities",
                userPrincipal.getAuthorities().stream().map(auth -> auth.getAuthority()).collect(Collectors.toList()));

        return Jwts.builder().claims(claims).subject((userPrincipal.getUsername())).issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret))).compact();
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser().verifyWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret))).build()
                .parseSignedClaims(token)
                .getPayload().getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().verifyWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret))).build()
                    .parseSignedClaims(authToken);
            return true;
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (JwtException e) {
            logger.error("JWT is not valid: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is null or empty: {}", e.getMessage());
        }

        return false;
    }
}
