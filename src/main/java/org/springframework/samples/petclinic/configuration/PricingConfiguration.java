package org.springframework.samples.petclinic.configuration;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.security.auth.message.AuthException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.samples.petclinic.configuration.services.UserDetailsImpl;
import org.springframework.samples.petclinic.user.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import io.github.isagroup.PricingContext;

@Component
public class PricingConfiguration extends PricingContext {

    private static final Logger logger = Logger.getLogger(PricingConfiguration.class.getName());

    @Autowired
    private UserService userService;

    @Value("${petclinic.app.jwtSecret}")
    private String jwtSecret;

    @Override
    public String getJwtSecret(){
        return jwtSecret;
    }

    @Override
    public String getConfigFilePath(){
        return "pricing/petclinic.yml";
    }

    @Override
    public Boolean userAffectedByPricing(){
        Authentication userAuth = SecurityContextHolder.getContext().getAuthentication();

        UserDetailsImpl userDetails = (UserDetailsImpl) userAuth.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
            .collect(Collectors.toList());
        
        return roles.contains("OWNER");
    }

    @Override
    public Object getUserAuthorities() {
        Authentication userAuth = SecurityContextHolder.getContext().getAuthentication();

        Object userAuthorities = new HashMap<>();

        if (!(userAuth.getPrincipal() instanceof String)) {
            UserDetailsImpl userDetails = (UserDetailsImpl) userAuth.getPrincipal();
            userAuthorities = userDetails.getAuthorities().stream().map(auth -> auth.getAuthority())
                    .collect(Collectors.toList());
        }

        return userAuthorities;
    }

    @Override
    public Map<String, Object> getUserContext() {
        try {
            return userService.findUserContext();
        } catch (AuthException e) {
            logger.info("Anonimous user");
            return new HashMap<>();
        }
    }

    @Override
    public String getUserPlan() {
        try {
            String userPlan = userService.findUserPlan();
            return userPlan;
        } catch (AuthException e) {
            logger.info("Anonimous user");
            return "BASIC";
        }
    }
    
}